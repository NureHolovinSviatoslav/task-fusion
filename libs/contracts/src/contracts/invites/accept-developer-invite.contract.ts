import { Errorable } from '@taskfusion-microservices/types';
import {
  GENERAL_EXCHANGE_NAME,
  INVITES_QUEUE_NAME,
} from '@taskfusion-microservices/constants';
import { IsInt } from 'class-validator';

export namespace AcceptDeveloperInviteContract {
  export const exchange = GENERAL_EXCHANGE_NAME;

  export const routingKey = `accept-developer-invite`;

  export const queue = `${INVITES_QUEUE_NAME}.${routingKey}`;

  export type Response = Errorable<{
    success: boolean;
  }>;

  export class Request {
    @IsInt()
    inviteId: number;
  }

  export class Dto extends Request {
    developerUserId: number;
  }
}
