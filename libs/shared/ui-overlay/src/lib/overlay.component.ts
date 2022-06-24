import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'snarlabs-overlay',
  standalone: true,
  imports: [CommonModule],
  template: ` <p class="p-4">overlay works!</p> `,
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
export class OverlayComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
