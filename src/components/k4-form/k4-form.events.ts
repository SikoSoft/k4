export const deletePageEventName = 'delete-page';

export interface DeletePageEventPayload {
  page: number;
}

export class DeletePageEvent extends CustomEvent<DeletePageEventPayload> {
  constructor(payload: DeletePageEventPayload) {
    super(deletePageEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
