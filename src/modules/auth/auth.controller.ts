import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDto, RegisterUserDto } from './dto';
import { AuthGuard } from 'src/common/guards';
import { User } from 'src/common';
import type { CurrentUser } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body);
  }

  @Get('roles')
  getRoles() {
    return this.authService.getRoles();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@User() user: CurrentUser) {
    return this.authService.profile(user);
  }
}
