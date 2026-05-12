import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вход' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('vk')
  @HttpCode(200)
  @ApiOperation({ summary: 'Авторизация через VK ID' })
  vk(@Body() body: { vk_id: string }) {
    return this.authService.loginByVk(body.vk_id);
  }
}
