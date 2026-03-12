import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; displayName?: string }) {
    const user = await this.authService.createOrUpdateUser(
      body.email,
      body.displayName,
    );
    const token = this.authService.generateToken(user.id);

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: any) {
    const user = request.user;
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
    };
  }
}
