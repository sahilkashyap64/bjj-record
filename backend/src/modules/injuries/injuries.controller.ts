import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { InjuriesService } from './injuries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/injuries')
@UseGuards(JwtAuthGuard)
export class InjuriesController {
  constructor(private injuriesService: InjuriesService) {}

  @Post()
  async create(@Req() request: any, @Body() body: any) {
    return this.injuriesService.create(request.user.id, body);
  }

  @Get()
  async findMany(@Req() request: any) {
    return this.injuriesService.findMany(request.user.id);
  }

  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const injury = await this.injuriesService.findById(id, request.user.id);
    if (!injury) {
      throw new ForbiddenException();
    }
    return injury;
  }

  @Patch(':id')
  async update(@Req() request: any, @Param('id') id: string, @Body() body: any) {
    const injury = await this.injuriesService.findById(id, request.user.id);
    if (!injury) {
      throw new ForbiddenException();
    }
    return this.injuriesService.update(id, request.user.id, body);
  }
}
