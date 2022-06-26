import { Observable } from 'rxjs';

export type UiModalDialogKind = 'slide-over' | 'confirm';
export type GuardFn<R> = (
  result?: R
) => boolean | Observable<boolean> | Promise<boolean>;
