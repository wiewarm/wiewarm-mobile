import { Injectable, resource } from '@angular/core';
import { BadDetail } from '../interfaces/bad-detail.interface';

@Injectable({ providedIn: 'root' })
export class BadDetailResourceService {
  private readonly apiBase = 'https://beta.wiewarm.ch/api/v1/bad/';

  getDetailResource(id: string) {
    return resource<BadDetail, unknown>({
      loader: ({ abortSignal }) =>
        fetch(this.apiBase + id, { signal: abortSignal }).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<BadDetail>;
        }),
    });
  }
}
