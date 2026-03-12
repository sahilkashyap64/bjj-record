import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/partners')
@UseGuards(JwtAuthGuard)
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Post()
  async create(@Req() request: any, @Body() body: any) {
    return this.partnersService.create(request.user.id, body);
  }

  @Get()
  async findMany(@Req() request: any) {
    return this.partnersService.findMany(request.user.id);
  }

  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const partner = await this.partnersService.findById(id, request.user.id);
    if (!partner) {
      throw new ForbiddenException();
    }
    return partner;
  }

  @Patch(':id')
  async update(@Req() request: any, @Param('id') id: string, @Body() body: any) {
    const partner = await this.partnersService.findById(id, request.user.id);
    if (!partner) {
      throw new ForbiddenException();
    }
    return this.partnersService.update(id, request.user.id, body);
  }
}
