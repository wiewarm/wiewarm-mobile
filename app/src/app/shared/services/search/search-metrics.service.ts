import { Injectable } from '@angular/core';

export interface SearchMetric {
  readonly elapsedMs: number;
  readonly hasQuery: boolean;
  readonly queryLength: number;
  readonly resultCount: number;
  readonly timestamp: number;
  readonly zeroResults: boolean;
}

@Injectable({ providedIn: 'root' })
// TBD: Wire up metrics by wrapping searchBadItems in the component/store layer
export class SearchMetricsService {
  private metric: SearchMetric | null = null;

  get lastSearch(): SearchMetric | null {
    return this.metric;
  }

  recordSearch(metric: Omit<SearchMetric, 'timestamp'>): void {
    this.metric = {
      ...metric,
      timestamp: Date.now(),
    };
  }
}
