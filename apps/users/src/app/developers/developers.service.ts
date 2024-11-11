import {
  RabbitRPC,
  MessageHandlerErrorBehavior,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CheckDeveloperContract,
  CheckDeveloperEmailContract,
  CreateDeveloperContract,
} from '@taskfusion-microservices/contracts';
import { DeveloperEntity, UserType } from '@taskfusion-microservices/entities';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(DeveloperEntity)
    private readonly developerRepository: Repository<DeveloperEntity>,
    private readonly usersService: UsersService
  ) {}

  @RabbitRPC({
    exchange: CreateDeveloperContract.exchange,
    routingKey: CreateDeveloperContract.routingKey,
    queue: CreateDeveloperContract.queue,
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    errorHandler: defaultNackErrorHandler,
    allowNonJsonMessages: true,
    name: 'create-developer',
  })
  async createDeveloper(
    dto: CreateDeveloperContract.Request
  ): Promise<CreateDeveloperContract.Response> {
    const developer = this.developerRepository.create();

    await this.developerRepository.save(developer);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      userType: UserType.DEVELOPER,
      telegramId: dto.telegramId,
      description: dto.description,
      name: dto.name,
      developer,
    });

    await this.updateDeveloper(developer.id, {
      user,
    });

    const { accessToken, refreshToken } =
      await this.usersService.generateTokens({
        id: user.id,
        email: user.email,
        userType: user.userType,
      });

    await this.usersService.updateUser(user.id, {
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @RabbitRPC({
    exchange: CheckDeveloperContract.exchange,
    routingKey: CheckDeveloperContract.routingKey,
    queue: CheckDeveloperContract.queue,
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    errorHandler: defaultNackErrorHandler,
    allowNonJsonMessages: true,
    name: 'check-developer',
  })
  async checkDeveloper(
    dto: CheckDeveloperContract.Request
  ): Promise<CheckDeveloperContract.Response> {
    const developer = await this.developerRepository.findOne({
      where: {
        id: dto.developerId,
      },
    });

    return {
      exists: Boolean(developer),
    };
  }

  @RabbitRPC({
    exchange: CheckDeveloperEmailContract.exchange,
    routingKey: CheckDeveloperEmailContract.routingKey,
    queue: CheckDeveloperEmailContract.queue,
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    errorHandler: defaultNackErrorHandler,
    allowNonJsonMessages: true,
    name: 'check-developer-email',
  })
  async checkDeveloperEmail(
    dto: CheckDeveloperEmailContract.Request
  ): Promise<CheckDeveloperEmailContract.Response> {
    const { email } = dto;

    const developerUser = await this.usersService.getUserByEmail({
      email,
    });

    if (!developerUser) {
      throw new NotFoundException('User not found');
    }

    if (developerUser.userType !== UserType.DEVELOPER) {
      throw new BadRequestException('User is not a project manager');
    }

    return {
      exists: true,
    };
  }

  async updateDeveloper(
    developerId: number,
    developerParams: DeepPartial<DeveloperEntity>
  ) {
    const developer = await this.developerRepository.update(
      { id: developerId },
      developerParams
    );

    return developer;
  }
}
