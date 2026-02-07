import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

export async function main(
  module: any,
  moduleBuilder?: (builder: TestingModuleBuilder) => void,
) {
  let builder = Test.createTestingModule({
    imports: [module],
  });

  if (moduleBuilder) {
    moduleBuilder(builder);
  }

  const moduleFixture: TestingModule = await builder.compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();

  (global as any).app = app;
  return app;
}