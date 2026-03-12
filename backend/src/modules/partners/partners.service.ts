import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../../entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async create(
    userId: string,
    data: {
      pseudonym: string;
      real_name?: string;
      belt_level?: string;
      average_weight?: number;
    },
  ): Promise<Partner> {
    const partner = this.partnerRepository.create({
      user_id: userId,
      ...data,
    });
    return this.partnerRepository.save(partner);
  }

  async findMany(userId: string): Promise<Partner[]> {
    return this.partnerRepository.find({
      where: { user_id: userId, status: 'active' },
      order: { created_at: 'DESC' },
    });
  }

  async findById(partnerId: string, userId: string): Promise<Partner | null> {
    return this.partnerRepository.findOne({
      where: { id: partnerId, user_id: userId },
    });
  }

  async update(partnerId: string, userId: string, data: any): Promise<Partner> {
    await this.partnerRepository.update(
      { id: partnerId, user_id: userId },
      data,
    );
    return this.findById(partnerId, userId);
  }
}
