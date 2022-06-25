import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { OverlayComponent } from './overlay.component';
import { UiOverlayRef } from './ui-overlay-ref';
import { UiOverlayConfig } from './ui-overlay.config';

const DEFAULT_CONFIG: UiOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'bg-white',
  data: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class UiOverlayService {
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {}

  open(config?: UiOverlayConfig): UiOverlayRef {
    const overlayConfig = { ...DEFAULT_CONFIG, ...config };
    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(overlayConfig);

    // // Create ComponentPortal that can be attached to a PortalHost
    // const componentPortal = new ComponentPortal(OverlayComponent);

    // // Attach ComponentPortal to PortalHost
    // overlayRef.attach(componentPortal);
    const uiOverlayRef = new UiOverlayRef(overlayRef);
    const component = this.attachDialogContainer(
      overlayRef,
      overlayConfig,
      uiOverlayRef
    );

    overlayRef.backdropClick().subscribe(() => uiOverlayRef.close());

    uiOverlayRef.componentInstance = component;
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
      .right();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private createInjector(
    config: UiOverlayConfig,
    uiOverlayRef: UiOverlayRef
  ): Injector {
    return Injector.create({
      providers: [
        { provide: UiOverlayRef, useValue: uiOverlayRef },
        { provide: 'UI_OVERLAY_DATA', useValue: config.data },
      ],
      parent: this.injector,
    });
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: UiOverlayConfig,
    uiOverlayRef: UiOverlayRef
  ) {
    const injector = this.createInjector(config, uiOverlayRef);

    const componentPortal = new ComponentPortal(
      OverlayComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<OverlayComponent> =
      overlayRef.attach(componentPortal);

    return containerRef.instance;
  }
}
