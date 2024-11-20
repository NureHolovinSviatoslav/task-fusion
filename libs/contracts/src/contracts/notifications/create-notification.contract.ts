import {
  GENERAL_EXCHANGE_NAME,
  NOTIFICATIONS_QUEUE_NAME,
} from '@taskfusion-microservices/constants';

export namespace CreateNotificationContract {
  export const exchange = GENERAL_EXCHANGE_NAME;

  export const routingKey = `create-notification-contract`;

  export const queue = `${NOTIFICATIONS_QUEUE_NAME}.${routingKey}`;

  export class Request {}

  export class Dto extends Request {
    title: string;
    redirectUrl: string;
    userId: number;
  }
}
