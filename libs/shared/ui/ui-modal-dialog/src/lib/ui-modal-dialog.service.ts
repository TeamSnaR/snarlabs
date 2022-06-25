import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { UiModalDialogRef } from './ui-modal-dialog-ref';
import { UiModalDialogComponent } from './ui-modal-dialog.component';

const DEFAULT_CONFIG: OverlayConfig = {
  hasBackdrop: true,
  // panelClass: ['bg-white', 'w-screen', 'max-w-md'],
  backdropClass: 'dark-backdrop',
};

@Injectable({
  providedIn: 'root',
})
export class UiModalDialogService {
  constructor(private readonly overlay: Overlay) {}

  open() {
    const overlayRef = this.createOverlay();
    const uiModalDialogRef = new UiModalDialogRef(overlayRef);
    const componentPortal = new ComponentPortal(UiModalDialogComponent);
    const containerRef = overlayRef.attach(componentPortal);
    overlayRef.backdropClick().subscribe(() => {
      uiModalDialogRef.close();
    });
    uiModalDialogRef.componentInstance = containerRef.instance;
  }

  private createOverlay() {
    const overlayConfig = this.getOverlayConfig();
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig() {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .right();

    const overlayConfig = new OverlayConfig({
      ...DEFAULT_CONFIG,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
