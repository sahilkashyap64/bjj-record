import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('push')
  async push(@Req() request: any, @Body() body: { changes: any[] }) {
    return this.syncService.pushChanges(request.user.id, body.changes);
  }

  @Get('pull')
  async pull(@Req() request: any, @Query('since') since?: string) {
    return this.syncService.pullChanges(request.user.id, since);
  }
}
