import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiOverlayRef } from './ui-overlay-ref';

const ESCAPE_CODE = 'Escape';

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
  @HostListener('document:keydown', ['$event']) private handleKeydown(
    event: KeyboardEvent
  ) {
    if (event.key === ESCAPE_CODE) {
      this.uiOverlayRef.close();
    }
  }

  constructor(
    public uiOverlayRef: UiOverlayRef,
    @Inject('UI_OVERLAY_DATA') public uiOverlayData: any
  ) {}

  ngOnInit(): void {}
}
