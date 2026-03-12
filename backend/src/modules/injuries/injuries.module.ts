import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Injury } from '../../entities/injury.entity';
import { InjuriesService } from './injuries.service';
import { InjuriesController } from './injuries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Injury])],
  controllers: [InjuriesController],
  providers: [InjuriesService],
})
export class InjuriesModule {}
