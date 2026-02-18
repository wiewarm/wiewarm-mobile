import { Directive } from "@angular/core";

@Directive({
  selector: 'a[appExternalLink]',
  host: {
    'attr.target': '_blank',
    'attr.rel': 'noopener noreferrer',
  },
})
export class ExternalLinkDirective {}
