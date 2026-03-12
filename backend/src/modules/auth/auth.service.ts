import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createOrUpdateUser(email: string, displayName?: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        display_name: displayName || email,
      });
      user = await this.userRepository.save(user);
    } else if (displayName && !user.display_name) {
      user.display_name = displayName;
      user = await this.userRepository.save(user);
    }

    return user;
  }

  generateToken(userId: string): string {
    return this.jwtService.sign({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
