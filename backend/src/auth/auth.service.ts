import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email уже занят');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
    });

    const token = this.jwtService.sign({ sub: user.id });
    return { access_token: token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Неверный email или пароль');

    const token = this.jwtService.sign({ sub: user.id });
    return { access_token: token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async loginByVk(vkId: string) {
    let user = await this.usersService.findByVkId(vkId);
    if (!user) {
      user = await this.usersService.create({
        name: `vk_${vkId}`,
        email: `vk_${vkId}@vk.local`,
        password: '',
        vk_id: vkId,
      });
    }
    const token = this.jwtService.sign({ sub: user.id });
    return { access_token: token };
  }
}
