import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../infrastructure/persistence/users.repository';
import type { AuthUser, JwtPayload } from '../../../../common/types/auth-user';
import type { LoginDto, RegisterDto } from '../../presentation/http/dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly users: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  private toAuthUser(row: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
  }): AuthUser {
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
    };
  }

  private signToken(user: AuthUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
    return this.jwt.sign(payload);
  }

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: AuthUser }> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const row = await this.users.create({
      email: dto.email,
      passwordHash,
      fullName: dto.name,
    });

    const user = this.toAuthUser(row);
    return { accessToken: this.signToken(user), user };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
    const row = await this.users.findByEmail(dto.email);
    if (!row) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const ok = await bcrypt.compare(dto.password, row.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = this.toAuthUser(row);
    return { accessToken: this.signToken(user), user };
  }

  async me(userId: string): Promise<AuthUser> {
    const row = await this.users.findById(userId);
    if (!row) {
      throw new UnauthorizedException('User not found');
    }
    return this.toAuthUser(row);
  }
}
