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
  template: `
    <h2 class="text-4xl">hello world panel</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quibusdam
      ratione doloribus hic excepturi non, alias consequuntur repellendus est
      minima dignissimos, suscipit beatae aperiam necessitatibus assumenda
      aliquam labore? Dolor, hic!
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
  constructor() {}

  ngOnInit(): void {}
}
