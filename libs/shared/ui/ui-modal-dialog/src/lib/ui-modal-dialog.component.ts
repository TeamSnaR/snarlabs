import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnimationEvent } from '@angular/animations';
import { UiModalDialogRef } from './ui-modal-dialog-ref';

const ESCAPE_KEY = 'Escape';
@Component({
  selector: 'snarlabs-ui-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-modal-dialog.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideOver', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
        })
      ),
      state(
        'enter',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'leave',
        style({
          transform: 'translateX(100%)',
        })
      ),
      transition('* => *', animate('500ms ease-in-out')),
    ]),
  ],
})
export class UiModalDialogComponent {
  animationState$ = new BehaviorSubject<'void' | 'enter' | 'leave'>('enter');
  animationStateChanged = new Subject<AnimationEvent>();

  @HostListener('document:keydown', ['$event']) private handleKeydown(
    event: KeyboardEvent
  ) {
    if (event.key === ESCAPE_KEY) {
      this.uiModalDialogRef.tryClose();
    }
  }
  constructor(
    @Inject('UI_MODAL_DIALOG_REF') private uiModalDialogRef: UiModalDialogRef
  ) {}
  onAnimationStart(animationEvent: AnimationEvent) {
    this.animationStateChanged.next(animationEvent);
  }
  onAnimationDone(animationEvent: AnimationEvent) {
    this.animationStateChanged.next(animationEvent);
  }
  startExitAnimation() {
    this.animationState$.next('leave');
  }

  close() {
    this.uiModalDialogRef.tryClose();
  }
}
