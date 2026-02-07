import { NestFactory } from '@nestjs/core';
import { logAppBootstrap, setupSwagger, VaultService } from '@toeichust/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api`);

  const vaultService = app.get(VaultService);

  setupSwagger(app);

  const port =
    vaultService.get<number>('MICROSERVICES_COUNTDOWN_COMMANDS_SERVICE_PORT') ||
    3000;
  await app.listen(port);

  console.log('='.repeat(100));

  logAppBootstrap(app);

  console.log('='.repeat(100));
}
bootstrap();
