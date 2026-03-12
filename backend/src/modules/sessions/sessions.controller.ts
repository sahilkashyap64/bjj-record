import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSessionDto, UpdateSessionDto } from './dto';

@Controller('v1/sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  async create(@Req() request: any, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(request.user.id, dto);
  }

  @Get()
  async findMany(
    @Req() request: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    return this.sessionsService.findMany(request.user.id, {
      from,
      to,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const session = await this.sessionsService.findById(id, request.user.id);
    if (!session) {
      throw new ForbiddenException();
    }
    return session;
  }

  @Put(':id')
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ) {
    const session = await this.sessionsService.findById(id, request.user.id);
    if (!session) {
      throw new ForbiddenException();
    }
    return this.sessionsService.update(id, request.user.id, dto);
  }

  @Delete(':id')
  async delete(@Req() request: any, @Param('id') id: string) {
    const session = await this.sessionsService.findById(id, request.user.id);
    if (!session) {
      throw new ForbiddenException();
    }
    await this.sessionsService.delete(id, request.user.id);
    return { success: true };
  }
}
