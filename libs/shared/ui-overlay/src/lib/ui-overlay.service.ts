import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { OverlayComponent } from './overlay.component';
import { UiOverlayRef } from './ui-overlay-ref';
import { UiOverlayConfig } from './ui-overlay.config';

const DEFAULT_CONFIG: UiOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'bg-white',
};

@Injectable({
  providedIn: 'root',
})
export class UiOverlayService {
  constructor(private readonly overlay: Overlay) {}

  open(config?: UiOverlayConfig): UiOverlayRef {
    const overlayConfig = { ...DEFAULT_CONFIG, ...config };
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(overlayConfig);

    // Create ComponentPortal that can be attached to a PortalHost
    const componentPortal = new ComponentPortal(OverlayComponent);

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(componentPortal);

    const uiOverlayRef = new UiOverlayRef(overlayRef);
    overlayRef.backdropClick().subscribe(() => uiOverlayRef.close());

    return uiOverlayRef;
  }

  private createOverlay(config: UiOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: UiOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
