import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { UiOverlayService } from '@snarlabs/shared/ui-overlay';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  selector: 'snarlabs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NxWelcomeComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'overlays';
  constructor(private readonly overlayService: UiOverlayService) {}
  showOverlay() {
    const uiOverlayRef = this.overlayService.open();

    setTimeout(() => {
      uiOverlayRef.close();
    }, 2000);
  }
}
