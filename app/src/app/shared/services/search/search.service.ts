import { inject, Injectable } from '@angular/core';

import type { BadItem } from '../interfaces/bad-item.interface';
import { SearchMetricsService } from './search-metrics.service';
import { searchBadItems, type BadSearchIndex } from '../../util/bad-search.util';

@Injectable()
export class SearchService {
  private readonly searchMetrics = inject(SearchMetricsService);

  search(index: BadSearchIndex, query: string): BadItem[] {
    const startedAt = performance.now();
    const items = searchBadItems(index, query);
    const hasQuery = query.trim().length > 0;

    this.searchMetrics.recordSearch({
      elapsedMs: performance.now() - startedAt,
      hasQuery,
      queryLength: hasQuery ? query.trim().length : 0,
      resultCount: items.length,
      zeroResults: hasQuery && items.length === 0,
    });

    return items;
  }
}
