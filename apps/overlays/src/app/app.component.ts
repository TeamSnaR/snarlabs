import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    const uiOverlayRef = this.overlayService.open({
      data: {
        heading: 'heading data via params',
        text: 'lorem ipsum',
      },
    });
  }
}
