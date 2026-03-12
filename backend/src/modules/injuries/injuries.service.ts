import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injury } from '../../entities/injury.entity';

@Injectable()
export class InjuriesService {
  constructor(
    @InjectRepository(Injury)
    private injuryRepository: Repository<Injury>,
  ) {}

  async create(userId: string, data: any): Promise<Injury> {
    const injury = this.injuryRepository.create({
      user_id: userId,
      ...data,
    });
    return this.injuryRepository.save(injury);
  }

  async findMany(userId: string): Promise<Injury[]> {
    return this.injuryRepository.find({
      where: { user_id: userId },
      order: { occurred_date: 'DESC' },
    });
  }

  async findById(injuryId: string, userId: string): Promise<Injury | null> {
    return this.injuryRepository.findOne({
      where: { id: injuryId, user_id: userId },
    });
  }

  async update(injuryId: string, userId: string, data: any): Promise<Injury> {
    await this.injuryRepository.update(
      { id: injuryId, user_id: userId },
      data,
    );
    return this.findById(injuryId, userId);
  }
}
