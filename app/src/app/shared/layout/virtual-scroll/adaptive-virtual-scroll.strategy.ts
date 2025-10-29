import { Injectable, InjectionToken, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import type {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy as CdkVirtualScrollStrategy} from '@angular/cdk/scrolling';
import {
  FixedSizeVirtualScrollStrategy
} from '@angular/cdk/scrolling';
import type { Observable, Subscription } from 'rxjs';

export const ADAPTIVE_VS_CONFIG = new InjectionToken<AdaptiveVsConfig>(
  'ADAPTIVE_VS_CONFIG'
);

/** Is $breakpoint-md from SCSS (48em = 768px) */
export const BREAKPOINT_M = '(min-width: 48em)';

export interface AdaptiveVsConfig {
  mobile: { itemSize: number; minBuffer?: number; maxBuffer?: number };
  desktop: { itemSize: number; minBuffer?: number; maxBuffer?: number };
  factorMin?: number; // default 7
  factorMax?: number; // default 14
}

type Mode = 'mobile' | 'desktop';

@Injectable()
export class AdaptiveVirtualScrollStrategy implements CdkVirtualScrollStrategy {
  private inner: FixedSizeVirtualScrollStrategy;
  private sub?: Subscription;
  private viewport?: CdkVirtualScrollViewport;

  get scrolledIndexChange(): Observable<number> {
    return this.inner.scrolledIndexChange;
  }

  constructor() {
    const bp = inject(BreakpointObserver);
    const cfg = inject<AdaptiveVsConfig>(ADAPTIVE_VS_CONFIG);

    const initialMode: Mode = bp.isMatched(BREAKPOINT_M) ? 'desktop' : 'mobile';
    const init = this.resolve(cfg, initialMode);
    this.inner = new FixedSizeVirtualScrollStrategy(
      init.itemSize,
      init.minBuffer,
      init.maxBuffer
    );

    this.sub = bp.observe([BREAKPOINT_M]).subscribe((result) => {
      const mode: Mode = result.matches ? 'desktop' : 'mobile';
      this.apply(cfg, mode);
    });
  }

  private resolve(cfg: AdaptiveVsConfig, mode: Mode) {
    const src = cfg[mode];
    const fMin = cfg.factorMin ?? 7;
    const fMax = cfg.factorMax ?? 14;
    return {
      itemSize: src.itemSize,
      minBuffer: src.minBuffer ?? src.itemSize * fMin,
      maxBuffer: src.maxBuffer ?? src.itemSize * fMax,
    };
  }

  private apply(cfg: AdaptiveVsConfig, mode: Mode) {
    const s = this.resolve(cfg, mode);
    this.inner.updateItemAndBufferSize(s.itemSize, s.minBuffer, s.maxBuffer);
    this.viewport?.checkViewportSize();
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.inner.attach(viewport);
    this.viewport.checkViewportSize();
  }

  detach(): void {
    this.inner.detach();
    this.viewport = undefined;
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  onContentScrolled(): void {
    this.inner.onContentScrolled();
  }
  onDataLengthChanged(): void {
    this.inner.onDataLengthChanged();
  }
  onContentRendered(): void {
    this.inner.onContentRendered();
  }
  onRenderedOffsetChanged(): void {
    this.inner.onRenderedOffsetChanged();
  }
  scrollToIndex(i: number, b: ScrollBehavior): void {
    this.inner.scrollToIndex(i, b);
  }
}
