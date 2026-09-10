import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { UsersRepository } from './infrastructure/persistence/users.repository';
import { AuthGuard, OptionalAuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('jwt.expiresIn') || '7d';
        return {
          secret:
            config.get<string>('jwt.secret') ||
            'dev-ledgerly-jwt-secret-change-me',
          signOptions: {
            expiresIn: expiresIn as `${number}d` | `${number}h` | `${number}m` | number,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, AuthGuard, OptionalAuthGuard],
  exports: [AuthService, JwtModule, AuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
