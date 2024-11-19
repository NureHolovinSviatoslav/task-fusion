import { Errorable } from '@taskfusion-microservices/types';
import { GENERAL_EXCHANGE_NAME } from '@taskfusion-microservices/constants';
import { TASKS_USERS_QUEUE_NAME } from '@taskfusion-microservices/constants';
import { IsInt } from 'class-validator';
import { TasksUsersEntity } from '@taskfusion-microservices/entities';

export namespace FindTaskUserRelation {
  export const exchange = GENERAL_EXCHANGE_NAME;

  export const routingKey = `find-task-user-relation`;

  export const queue = `${TASKS_USERS_QUEUE_NAME}.${routingKey}`;

  export type Response = Errorable<TasksUsersEntity | null>;

  export class Request {
    @IsInt()
    taskId: number;

    @IsInt()
    userId: number;
  }

  export class Dto extends Request {}
}
