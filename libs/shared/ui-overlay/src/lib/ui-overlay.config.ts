export interface UiOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: UiOverlayData;
}

export interface UiOverlayData {
  heading: string;
  text: string;
}
