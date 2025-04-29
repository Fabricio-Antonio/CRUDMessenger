import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIGS = 'MY_DYNAMIC_CONFIGS';

@Module({})
export class MyDynamicModule {
  static register(myModuleConfigs: MyDynamicModuleConfigs): DynamicModule {
    console.log('MyDynamicModule', myModuleConfigs);
    return {
      module: MyDynamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIGS,
          useValue: myModuleConfigs,
        },
      ],
      controllers: [],
      exports: [MY_DYNAMIC_CONFIGS],
    };
  }
}
