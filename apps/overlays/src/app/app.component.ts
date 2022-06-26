import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiOverlayService } from '@snarlabs/shared/ui-overlay';
import { UiModalDialogService } from '@snarlabs/shared/ui/ui-modal-dialog';
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
  constructor(
    private readonly overlayService: UiOverlayService,
    private readonly uiModalDialogService: UiModalDialogService
  ) {
    this.showModal();
  }
  showOverlay() {
    const uiOverlayRef = this.overlayService.open({
      data: {
        heading: 'heading data via params',
        text: 'lorem ipsum',
      },
    });
  }

  showModal() {
    const ref = this.uiModalDialogService.open({
      kind: 'slide-over',
      hasBackdrop: true,
    });
    ref.addCloseGuard((result) => result !== undefined);
    ref.afterClosed$.subscribe((result) => console.log(result));
  }
}
