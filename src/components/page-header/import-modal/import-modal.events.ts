export const importSruEventName = 'import-sru';

export interface ImportSruEventPayload {
  manifest: string;
  data: string;
}

export class ImportSruEvent extends CustomEvent<ImportSruEventPayload> {
  constructor(payload: ImportSruEventPayload) {
    super(importSruEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
