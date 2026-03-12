import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { TechniquesService } from './techniques.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/techniques')
@UseGuards(JwtAuthGuard)
export class TechniquesController {
  constructor(private techniquesService: TechniquesService) {}

  @Post()
  async create(@Req() request: any, @Body() body: any) {
    return this.techniquesService.create(request.user.id, body);
  }

  @Get()
  async findMany(@Req() request: any, @Query('category') category?: string) {
    return this.techniquesService.findMany(request.user.id, category);
  }

  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const technique = await this.techniquesService.findById(id, request.user.id);
    if (!technique) {
      throw new ForbiddenException();
    }
    return technique;
  }
}
