import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { UiModalDialogRef } from './ui-modal-dialog-ref';
import { UiModalDialogComponent } from './ui-modal-dialog.component';

const DEFAULT_CONFIG: OverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'bg-slate-500',
};

@Injectable({
  providedIn: 'root',
})
export class UiModalDialogService {
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {}

  open() {
    const overlayRef = this.createOverlay();
    const uiModalDialogRef = new UiModalDialogRef(overlayRef);
    overlayRef.backdropClick().subscribe(() => {
      uiModalDialogRef.close();
    });
    uiModalDialogRef.componentInstance = this.attachModalDialogContainer(
      overlayRef,
      uiModalDialogRef
    );

    return uiModalDialogRef;
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

  private attachModalDialogContainer(
    overlayRef: OverlayRef,
    uiModalDialogRef: UiModalDialogRef
  ) {
    const modalDialogInjector = this.createInjector(uiModalDialogRef);

    const componentPortal = new ComponentPortal(
      UiModalDialogComponent,
      null,
      modalDialogInjector
    );
    const containerRef = overlayRef.attach(componentPortal);

    return containerRef.instance;
  }

  private createInjector(uiModalDialogRef: UiModalDialogRef) {
    return Injector.create({
      providers: [
        { provide: 'UI_MODAL_DIALOG_REF', useValue: uiModalDialogRef },
      ],
      parent: this.injector,
    });
  }
}
