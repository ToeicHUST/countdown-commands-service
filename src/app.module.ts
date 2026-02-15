import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, ErrorHandlerFilter } from '@toeichust/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TargetModule } from './modules/target/target.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',

          url: configService.get(
            'MICROSERVICES_COUNTDOWN_COMMANDS_SERVICE_DATABASE_URL',
          ),

          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,

          logging:
            configService.get<string>('NODE_ENV') === 'development'
              ? true
              : false,

          // synchronize:
          //   configService.get<string>('NODE_ENV') === 'production'
          //     ? false
          //     : true,
          synchronize: true,

          ssl: configService.get<string>('NODE_ENV') === 'test' ? false : true,
          extra: {
            ssl:
              configService.get<string>('NODE_ENV') === 'test'
                ? false
                : { rejectUnauthorized: false },
            max: 1,
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),

    TargetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorHandlerFilter,
    },
  ],
})
export class AppModule {}
