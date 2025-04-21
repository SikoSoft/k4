import { MetaInfo } from '@/models/K4';

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
