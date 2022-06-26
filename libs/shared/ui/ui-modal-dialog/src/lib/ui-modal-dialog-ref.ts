import { OverlayRef } from '@angular/cdk/overlay';
import { filter, Subject, take } from 'rxjs';
import { UiModalDialogComponent } from './ui-modal-dialog.component';
import { AnimationEvent } from '@angular/animations';

export class UiModalDialogRef {
  // stream that emits data before modal dialog is closed
  private beforeCloseStream = new Subject<void>();
  // stream that emits data after modal dialog has been closed
  private afterClosedStream = new Subject<void>();
  componentInstance: UiModalDialogComponent | null = null;
  beforeClose$ = this.beforeCloseStream.asObservable();

  afterClosed$ = this.afterClosedStream.asObservable();
  constructor(private readonly overlayRef: OverlayRef) {}

  close() {
    this.componentInstance?.animationStateChanged
      .pipe(
        filter(
          (animationEvent: AnimationEvent) =>
            animationEvent.phaseName === 'enter'
        ),
        take(1)
      )
      .subscribe(() => {
        this.beforeCloseStream.next();
        this.beforeCloseStream.complete();
        this.overlayRef.detachBackdrop();
      });

    this.componentInstance?.animationStateChanged
      .pipe(
        filter(
          (event: AnimationEvent) =>
            event.phaseName === 'done' && event.toState === 'leave'
        ),
        take(1)
      )
      .subscribe(() => {
        this.overlayRef.dispose();
        this.afterClosedStream.next();
        this.afterClosedStream.complete();

        // Make sure to also clear the reference to the
        // component instance to avoid memory leaks
        this.componentInstance = null;
      });

    this.componentInstance?.startExitAnimation();
  }
}
