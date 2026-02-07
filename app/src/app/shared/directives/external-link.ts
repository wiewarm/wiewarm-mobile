import { Directive } from '@angular/core';

@Directive({
  selector: 'a[appExternalLink]',
  host: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})
export class ExternalLinkDirective {}
