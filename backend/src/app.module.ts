import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  User,
  SessionLog,
  Round,
  RoundAction,
  Partner,
  Technique,
  Injury,
} from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PartnersModule } from './modules/partners/partners.module';
import { TechniquesModule } from './modules/techniques/techniques.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SyncModule } from './modules/sync/sync.module';
import { InjuriesModule } from './modules/injuries/injuries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'bjj_record'),
        entities: [User, SessionLog, Round, RoundAction, Partner, Technique, Injury],
        synchronize: false,
        logging: false,
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'dev-secret'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    AuthModule,
    SessionsModule,
    PartnersModule,
    TechniquesModule,
    ReportsModule,
    SyncModule,
    InjuriesModule,
  ],
})
export class AppModule {}
