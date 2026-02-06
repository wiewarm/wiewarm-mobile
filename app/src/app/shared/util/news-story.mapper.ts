import type {
  ImageApiItem,
  NewsApiItem,
  NewsStoryItem,
} from '../services/interfaces/news-story.interface';

const DEFAULT_IMAGE_BASE = 'https://www.wiewarm.ch';

function formatLocation(plz?: string, ort?: string): string {
  return [plz, ort].filter(Boolean).join(' ').trim();
}

function normalizeDate(dateValue?: string | null): string | null {
  if (!dateValue) return null;
  const trimmed = dateValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toTimestamp(rawDate?: string | null, pretty?: string | null): number {
  const normalized = normalizeDate(rawDate);
  if (normalized) {
    const parsed = Date.parse(normalized.replace(' ', 'T'));
    if (!Number.isNaN(parsed)) return parsed;
  }

  const parsedPretty = pretty ? Date.parse(pretty) : Number.NaN;
  if (!Number.isNaN(parsedPretty)) return parsedPretty;

  return 0;
}

function resolveImageUrl(path: string | undefined, origin = DEFAULT_IMAGE_BASE): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  return new URL(trimmed, origin).toString();
}

function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function mapNewsAndImagesToStories(
  newsItems: NewsApiItem[],
  imageItems: ImageApiItem[],
): NewsStoryItem[] {
  const imagesByBadId = new Map<string, ImageApiItem>();

  const sortedImages = [...imageItems].sort((a, b) => {
    return toTimestamp(b.date, b.date_pretty) - toTimestamp(a.date, a.date_pretty);
  });

  for (const image of sortedImages) {
    const badId = String(image.badid);
    if (!imagesByBadId.has(badId)) {
      imagesByBadId.set(badId, image);
    }
  }

  const fromNews: NewsStoryItem[] = newsItems.map((item) => {
    const badId = String(item.badid);
    const matchedImage = imagesByBadId.get(badId);
    const infoText = (item.info ?? '').trim();

    return {
      id: `news:${badId}:${item.infoid}`,
      kind: 'news',
      badId,
      badName: item.badname,
      locationText: formatLocation(item.plz, item.ort),
      title: `Mitteilung von ${item.badname}, ${item.ort}`,
      body: infoText,
      imageUrl: resolveImageUrl(matchedImage?.image),
      thumbnailUrl: resolveImageUrl(matchedImage?.thumbnail),
      publishedAt: normalizeDate(item.date),
      publishedAtPretty: normalizeDate(item.date_pretty),
    };
  });

  const fromImages: NewsStoryItem[] = imageItems.map((item) => {
    const badId = String(item.badid);
    const imageRef = item.original || item.image || '';

    return {
      id: `img:${badId}:${hashString(imageRef)}`,
      kind: 'impression',
      badId,
      badName: item.badname,
      locationText: formatLocation(item.plz, item.ort),
      title: `Bild hochgeladen von ${item.badname}, ${item.ort}`,
      body: (item.description ?? '').trim(),
      imageUrl: resolveImageUrl(item.original || item.image),
      thumbnailUrl: resolveImageUrl(item.thumbnail || item.image),
      publishedAt: normalizeDate(item.date),
      publishedAtPretty: normalizeDate(item.date_pretty),
    };
  });

  return [...fromNews, ...fromImages].sort((a, b) => {
    return toTimestamp(b.publishedAt, b.publishedAtPretty) - toTimestamp(a.publishedAt, a.publishedAtPretty);
  });
}
