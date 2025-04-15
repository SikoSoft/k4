export const personInfoChangedEventName = 'person-info-changed';

export interface PersonInfoChangedEventPayload {
  name: string;
  personNumber: string;
  city: string;
  postCode: string;
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
