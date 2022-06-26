import { OverlayRef } from '@angular/cdk/overlay';
import {
  filter,
  of,
  Subject,
  take,
  from,
  merge,
  defaultIfEmpty,
  first,
} from 'rxjs';
import { UiModalDialogComponent } from './ui-modal-dialog.component';
import { AnimationEvent } from '@angular/animations';
import { GuardFn } from './ui-modal-dialog.types';

export class UiModalDialogRef {
  // stream that emits data before modal dialog is closed
  public readonly id: string;
  private readonly beforeCloseStream = new Subject<unknown>();
  // stream that emits data after modal dialog has been closed
  private readonly afterClosedStream = new Subject<unknown>();
  private readonly beforeCloseGuards: GuardFn<unknown>[] = [];
  private componentInstance: UiModalDialogComponent | null = null;
  beforeClose$ = this.beforeCloseStream.asObservable();
  afterClosed$ = this.afterClosedStream.asObservable();

  // onClose: (result?: unknown) => void;
  constructor(private readonly overlayRef: OverlayRef) {
    this.id = `dialog-${Math.random().toString(36).substring(7)}`;
  }

  setComponentInstance(componentInstance: UiModalDialogComponent | null) {
    this.componentInstance = componentInstance;
  }

  addCloseGuard(guardFn: GuardFn<unknown>) {
    this.beforeCloseGuards.push(guardFn);
  }

  tryClose(result?: unknown) {
    this.canClose(result)
      .pipe(filter<boolean>(Boolean))
      .subscribe({ next: () => this.close(result) });
  }
  private canClose(result: unknown) {
    const guards$ = this.beforeCloseGuards
      .map((guard) => guard(result))
      .filter((v) => v !== undefined && v !== true)
      .map((value) => {
        return typeof value === 'boolean'
          ? of(value)
          : from(value).pipe(filter((canClose) => !canClose));
      });

    return merge(...guards$).pipe(defaultIfEmpty(true), first());
  }
  private close(result?: unknown) {
    this.componentInstance?.animationStateChanged
      .pipe(
        filter(
          (animationEvent: AnimationEvent) =>
            animationEvent.phaseName === 'enter'
        ),
        take(1)
      )
      .subscribe(() => {
        this.beforeCloseStream.next(null);
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
        this.afterClosedStream.next(result);
        this.afterClosedStream.complete();

        // Make sure to also clear the reference to the
        // component instance to avoid memory leaks
        this.setComponentInstance(null);
      });

    this.componentInstance?.startExitAnimation();
  }
}
