import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Technique } from '../../entities/technique.entity';

@Injectable()
export class TechniquesService {
  constructor(
    @InjectRepository(Technique)
    private techniqueRepository: Repository<Technique>,
  ) {}

  async create(
    userId: string,
    data: {
      name: string;
      category: string;
      description?: string;
      custom?: boolean;
    },
  ): Promise<Technique> {
    const technique = this.techniqueRepository.create({
      user_id: userId,
      ...data,
    });
    return this.techniqueRepository.save(technique);
  }

  async findMany(userId: string, category?: string): Promise<Technique[]> {
    const query = this.techniqueRepository.createQueryBuilder('t');
    query.where('t.user_id = :userId', { userId });
    if (category) {
      query.orWhere('t.category = :category', { category });
    }
    return query.orderBy('t.category', 'ASC').addOrderBy('t.name', 'ASC').getMany();
  }

  async findById(techniqueId: string, userId: string): Promise<Technique | null> {
    return this.techniqueRepository.findOne({
      where: { id: techniqueId, user_id: userId },
    });
  }
}
