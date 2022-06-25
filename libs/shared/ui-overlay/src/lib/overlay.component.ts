import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiOverlayRef } from './ui-overlay-ref';

@Component({
  selector: 'snarlabs-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-4xl">{{ uiOverlayData.heading }}</h2>
    <p>
      {{ uiOverlayData.text }}
    </p>
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
export class OverlayComponent implements OnInit {
  constructor(
    public uiOverlayRef: UiOverlayRef,
    @Inject('UI_OVERLAY_DATA') public uiOverlayData: any
  ) {}

  ngOnInit(): void {}
}
