import { OverlayRef } from '@angular/cdk/overlay';

export class UiOverlayRef {
  constructor(private readonly overlayRef: OverlayRef) {}
  close(): void {
    this.overlayRef.dispose();
  }
}
