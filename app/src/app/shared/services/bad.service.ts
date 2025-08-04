import { Injectable, resource } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BadDetail } from '../interfaces/bad-detail.interface';
import { BadItem } from '../interfaces/bad-item.interface';

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly API_BASE = environment.apiBase;

  private badCache?: BadItem[];
  private badDetailCache = new Map<string, BadDetail>();

  private handleHttpResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} ${response.statusText || ''}`
      );
    }
    return response.json() as Promise<T>;
  }

  getResource() {
    return resource<BadItem[], unknown>({
      loader: ({ abortSignal }) => {
        if (this.badCache) {
          return Promise.resolve(this.badCache);
        }
        return fetch(`${this.API_BASE}/temperature/all_current.json/0`, {
          signal: abortSignal,
        })
          .then((res) => this.handleHttpResponse<BadItem[]>(res))
          .then((data) => {
            this.badCache = data;
            return data;
          });
      },
    });
  }

  getDetailResource(id: string) {
    return resource<BadDetail, unknown>({
      loader: ({ abortSignal }) => {
        const cached = this.badDetailCache.get(id);
        if (cached) {
          return Promise.resolve(cached);
        }
        return fetch(`${this.API_BASE}/bad/${id}`, { signal: abortSignal })
          .then((res) => this.handleHttpResponse<BadDetail>(res))
          .then((data) => {
            this.badDetailCache.set(id, data);
            return data;
          });
      },
    });
  }
}
