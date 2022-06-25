import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiOverlayRef } from './ui-overlay-ref';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BehaviorSubject, shareReplay, Subject } from 'rxjs';
import { tap } from 'rxjs';
import { AnimationEvent } from '@angular/animations';

const ESCAPE_CODE = 'Escape';
const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'snarlabs-overlay',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => fadeIn', animate(ANIMATION_TIMINGS)),
    ]),
    trigger('slideContent', [
      state(
        'void',
        style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })
      ),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state(
        'leave',
        style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })
      ),
      transition('* => *', animate(ANIMATION_TIMINGS)),
    ]),
  ],
  template: `
    <div
      class="overlay-content"
      [@slideContent]="animationState$ | async"
      (@slideContent.start)="onAnimationStart($event)"
      (@slideContent.done)="onAnimationDone($event)"
    >
      <div class="spinner-wrapper" *ngIf="loadingObs$ | async">loading...</div>

      <div [@fade]="(loadingObs$ | async) ? 'fadeOut' : 'fadeIn'">
        <h2 class="text-4xl">{{ uiOverlayData.heading }}</h2>
        <p>
          {{ uiOverlayData.text }}
        </p>
      </div>
    </div>
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
export class OverlayComponent {
  animationState$ = new BehaviorSubject<'void' | 'enter' | 'leave'>('enter');
  loaded$ = new BehaviorSubject<boolean>(true);
  loadingObs$ = this.loaded$
    .asObservable()
    .pipe(tap(console.log), shareReplay({ bufferSize: 1, refCount: true }));
  animationStateChanged = new EventEmitter<AnimationEvent>();
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
  ) {
    setTimeout(() => {
      this.loaded$.next(false);
    }, 3000);
  }

  onAnimationStart($event: AnimationEvent) {
    console.log(
      'on animate start',
      $event.phaseName,
      $event.fromState,
      $event.toState
    );

    this.animationStateChanged.emit($event);
  }

  onAnimationDone($event: AnimationEvent) {
    console.log(
      'on animate done',
      $event.phaseName,
      $event.fromState,
      $event.toState
    );

    this.animationStateChanged.emit($event);
  }

  startExitAnimation() {
    console.log('exit animation');
    this.animationState$.next('leave');
  }
}
