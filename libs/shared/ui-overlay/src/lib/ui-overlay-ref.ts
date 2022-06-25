import { OverlayRef } from '@angular/cdk/overlay';
import { filter, Observable, Subject, take } from 'rxjs';
import { OverlayComponent } from './overlay.component';
import { AnimationEvent } from '@angular/animations';

export class UiOverlayRef {
  componentInstance?: OverlayComponent;
  private _beforeClose = new Subject<void>();
  private _afterClosed = new Subject<void>();

  constructor(private readonly overlayRef: OverlayRef) {}
  close(): void {
    // Listen for animation 'start' events
    this.componentInstance?.animationStateChanged
      .pipe(
        filter((event: AnimationEvent) => event.phaseName === 'start'),
        take(1)
      )
      .subscribe(() => {
        console.log('close animation start');

        this._beforeClose.next();
        this._beforeClose.complete();
        this.overlayRef.detachBackdrop();
      });

    // Listen for animation 'done' events
    this.componentInstance?.animationStateChanged
      .pipe(
        filter(
          (event) => event.phaseName === 'done' && event.toState === 'leave'
        ),
        take(1)
      )
      .subscribe(() => {
        console.log('close animation done');

        this.overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();

        // Make sure to also clear the reference to the
        // component instance to avoid memory leaks
        this.componentInstance = undefined;
      });

    // Start exit animation
    this.componentInstance?.startExitAnimation();
  }

  afterClosed(): Observable<void> {
    console.log('after closed');

    return this._afterClosed.asObservable();
  }

  beforeClose(): Observable<void> {
    console.log('before closed');

    return this._beforeClose.asObservable();
  }
}
