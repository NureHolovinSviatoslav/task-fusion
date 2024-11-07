import { Errorable } from '@taskfusion-microservices/types';
import {
  GENERAL_EXCHANGE_NAME,
  USERS_QUEUE_NAME,
} from '@taskfusion-microservices/constants';
import { UserEntity } from '@taskfusion-microservices/entities';

export namespace GetUserByEmailContract {
  export const exchange = GENERAL_EXCHANGE_NAME;

  export const routingKey = `get-user-by-email`;

  export const queue = `${USERS_QUEUE_NAME}.${routingKey}`;

  export type Response = Errorable<UserEntity>;

  export class Request {
    email: string;
  }
}