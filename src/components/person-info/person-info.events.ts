import { PersonInfo } from '@/models/K4';

export const personInfoChangedEventName = 'person-info-changed';

export interface PersonInfoChangedEventPayload extends PersonInfo {
  page: number;
}

export class PersonInfoChangedEvent extends CustomEvent<PersonInfoChangedEventPayload> {
  constructor(payload: PersonInfoChangedEventPayload) {
    super(personInfoChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
