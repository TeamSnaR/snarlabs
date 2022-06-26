import {
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Injectable,
  Injector,
  TemplateRef,
  Type,
} from '@angular/core';
import { Observable } from 'rxjs';
import { UiModalDialogRef } from './ui-modal-dialog-ref';
import { UiModalDialogComponent } from './ui-modal-dialog.component';
import { UiModalDialogKind } from './ui-modal-dialog.types';

const DEFAULT_CONFIG: OverlayConfig = {
  backdropClass: 'bg-slate-500',
  hasBackdrop: true,
};

export interface UiModalDialogData {
  kind: UiModalDialogKind;
  contentComponent?: ComponentRef<any> | TemplateRef<any>;
  hasBackdrop?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UiModalDialogService {
  private dialogs: UiModalDialogRef[] = [];
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {}

  open(uiModalDialogData: UiModalDialogData) {
    const overlayRef = this.createOverlay(uiModalDialogData);
    const uiModalDialogRef = new UiModalDialogRef(overlayRef);
    overlayRef.backdropClick().subscribe(() => {
      uiModalDialogRef.tryClose();
    });

    const component = this.attachModalDialogContainer(
      overlayRef,
      uiModalDialogRef
    );

    uiModalDialogRef.setComponentInstance(component);

    this.dialogs.push(uiModalDialogRef);

    uiModalDialogRef.afterClosed$.subscribe((_) => {
      this.dialogs = this.dialogs.filter(
        ({ id }) => uiModalDialogRef.id !== id
      );
    });

    return uiModalDialogRef;
  }

  closeAll() {
    this.dialogs.forEach((dialog) => dialog.tryClose());
  }

  private createOverlay(uiModalDialogData: UiModalDialogData) {
    const overlayConfig = this.getOverlayConfig(uiModalDialogData);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(uiModalDialogData: UiModalDialogData) {
    const positionStrategy = this.getPositionStrategy(
      uiModalDialogData.kind,
      this.overlay.position()
    );

    const overlayConfig = new OverlayConfig({
      ...DEFAULT_CONFIG,
      hasBackdrop: uiModalDialogData.hasBackdrop ?? DEFAULT_CONFIG.hasBackdrop,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private getPositionStrategy(
    kind: UiModalDialogKind,
    positionBuilder: OverlayPositionBuilder
  ) {
    if (kind === 'slide-over') {
      return positionBuilder.global().centerHorizontally().right();
    } else if (kind === 'confirm') {
      return positionBuilder.global().centerHorizontally().centerVertically();
    } else {
      throw new Error('Overlay Kind is not valid');
    }
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
