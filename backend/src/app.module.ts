import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import { configProvider } from './app.config.provider';
import { OrderModule } from './order/order.module';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = new URL(config.getOrThrow<string>('DATABASE_URL'));

        return {
          type: config.getOrThrow<'postgres'>('DATABASE_DRIVER'),
          host: dbUrl.hostname,
          port: Number(dbUrl.port || 5432),
          database: dbUrl.pathname.replace(/^\//, ''),
          username: config.getOrThrow<string>('DATABASE_USERNAME'),
          password: config.getOrThrow<string>('DATABASE_PASSWORD'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      serveStaticOptions: {
        index: false,
      },
    }),
    OrderModule,
    FilmsModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
