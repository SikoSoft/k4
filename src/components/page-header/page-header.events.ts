export const formResetEventName = 'form-reset';

export type FormResetEventPayload = Record<string, never>;

export class FormResetEvent extends CustomEvent<FormResetEventPayload> {
  constructor(payload: FormResetEventPayload) {
    super(formResetEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}

export const downloadBundleEventName = 'download-bundle';

export type DownloadBundleEventPayload = Record<string, never>;

export class DownloadBundleEvent extends CustomEvent<DownloadBundleEventPayload> {
  constructor(payload: DownloadBundleEventPayload) {
    super(downloadBundleEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
