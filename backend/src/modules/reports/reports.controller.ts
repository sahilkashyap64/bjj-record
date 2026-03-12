import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('weekly')
  async getWeeklyReport(@Req() request: any, @Query('week_start') weekStart: string) {
    return this.reportsService.getWeeklyReport(request.user.id, weekStart);
  }

  @Get('monthly')
  async getMonthlyReport(@Req() request: any, @Query('month') month: string) {
    return this.reportsService.getMonthlyReport(request.user.id, month);
  }
}
