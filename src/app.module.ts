import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, VaultModule, VaultService } from '@toeichust/common';
import { ErrorHandlerFilter } from './common/filters/error-handler.filter';
import { TargetModule } from './modules/target/target.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VaultModule,
    AuthModule,

    TypeOrmModule.forRootAsync({
      inject: [VaultService],
      useFactory: (vaultService: VaultService) => {
        return {
          type: 'postgres',
          host: vaultService.get<string>('MICROSERVICES_DB_HOST'),
          port:
            parseInt(vaultService.get<string>('MICROSERVICES_DB_PORT'), 10) ||
            5432,
          username: vaultService.get<string>('MICROSERVICES_DB_USERNAME'),
          password: vaultService.get<string>('MICROSERVICES_DB_PASSWORD'),
          database: vaultService.get<string>('MICROSERVICES_DB_DATABASE'),
          schema:
            vaultService.get<string>(
              'MICROSERVICES_COUNTDOWN_COMMANDS_SERVICE_DB_SCHEMA',
            ) || 'public',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],

          logging:
            vaultService.get<string>('MICROSERVICES_DB_DATABASE') ===
            'development'
              ? true
              : false,
          synchronize:
            vaultService.get<string>('MICROSERVICES_DB_DATABASE') ===
            'production'
              ? false
              : true,

          extra: {
            max: 1, // Cực kỳ quan trọng cho Serverless
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),

    TargetModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandlerFilter,
    },
  ],
})
export class AppModule {}
