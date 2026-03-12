import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technique } from '../../entities/technique.entity';
import { TechniquesService } from './techniques.service';
import { TechniquesController } from './techniques.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technique])],
  controllers: [TechniquesController],
  providers: [TechniquesService],
  exports: [TechniquesService],
})
export class TechniquesModule {}
