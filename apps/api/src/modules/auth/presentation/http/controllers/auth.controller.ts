import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import {
  LoginDto,
  RegisterDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
} from '../dto/auth.dto';
import { AuthGuard, type AuthedRequest } from '../../../../../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthedRequest) {
    return this.auth.me(req.user!.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  updateProfile(@Req() req: AuthedRequest, @Body() body: UpdateProfileDto) {
    return this.auth.updateProfile(req.user!.id, body);
  }

  @Patch('me/preferences')
  @UseGuards(AuthGuard)
  updatePreferences(@Req() req: AuthedRequest, @Body() body: UpdatePreferencesDto) {
    return this.auth.updatePreferences(req.user!.id, body);
  }
}
