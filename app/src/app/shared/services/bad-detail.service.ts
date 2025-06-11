import { Injectable, resource } from '@angular/core';
import { BadDetail } from '../interfaces/bad-detail.interface';
import { BadItem } from '../interfaces/bad-item.interface';

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly API_BASE = 'https://beta.wiewarm.ch/api/v1';

  getResource() {
    return resource<BadItem[], unknown>({
      loader: ({ abortSignal }) =>
        fetch(this.API_BASE + '/temperature/all_current.json/0', {
          signal: abortSignal,
        }).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<BadItem[]>;
        }),
    });
  }

  getDetailResource(id: string) {
    return resource<BadDetail, unknown>({
      loader: ({ abortSignal }) =>
        fetch(this.API_BASE + '/bad/' + id, {
          signal: abortSignal,
        }).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<BadDetail>;
        }),
    });
  }
}
