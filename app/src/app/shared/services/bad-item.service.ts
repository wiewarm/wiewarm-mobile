import { Injectable, resource } from '@angular/core';
import { BadItem } from '../interfaces/bad-item.interface';

@Injectable({ providedIn: 'root' })
export class BadItemResourceService {
  private readonly apiUrl =
    'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0';

  /**
   * ResourceRef<BadItem[]> mit Signals:
   *  - value(): BadItem[] | undefined
   *  - isLoading(): boolean
   *  - error(): Error | undefined
   */
  itemsResource = resource<BadItem[], unknown>({
    loader: ({ abortSignal }) =>
      fetch(this.apiUrl, { signal: abortSignal }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<BadItem[]>;
      }),
  });
}
