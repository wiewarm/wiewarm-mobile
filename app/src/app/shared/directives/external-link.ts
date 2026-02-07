import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: 'a[appExternalLink]',
  host: {
    '[attr.target]': 'target',
    '[attr.rel]': 'rel',
    '[attr.aria-disabled]': 'ariaDisabled',
    '(click)': 'onClick($event)',
  },
})
export class ExternalLinkDirective {
  private readonly element = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  protected get target(): string | null {
    return this.linkState === 'external' ? '_blank' : null;
  }

  protected get rel(): string | null {
    return this.linkState === 'external' ? 'noopener noreferrer' : null;
  }

  protected get ariaDisabled(): 'true' | null {
    return this.linkState === 'invalid' ? 'true' : null;
  }

  onClick(event: MouseEvent) {
    if (this.linkState === 'invalid') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private get linkState(): 'empty' | 'invalid' | 'internal' | 'external' {
    const href = this.element.nativeElement.getAttribute('href')?.trim();

    if (!href) {
      return 'empty';
    }

    const url = this.parseUrl(href);
    if (!url || !this.isAllowedProtocol(url.protocol)) {
      return 'invalid';
    }

    if (url.origin !== window.location.origin) {
      return 'external';
    }

    return 'internal';
  }

  private parseUrl(href: string): URL | null {
    try {
      return new URL(href, document.baseURI);
    } catch {
      return null;
    }
  }

  private isAllowedProtocol(protocol: string): boolean {
    return protocol === 'http:' || protocol === 'https:';
  }
}
