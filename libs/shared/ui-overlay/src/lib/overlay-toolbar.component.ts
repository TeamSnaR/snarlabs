import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'snarlabs-overlay-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayToolbarComponent {}
