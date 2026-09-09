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
        const dbUrl = new URL(
          config.get<string>('DATABASE_URL') ||
            'postgres://prac:prac123@localhost:5432/prac',
        );

        return {
          type: 'postgres' as const,
          host: dbUrl.hostname,
          port: parseInt(dbUrl.port || '5432', 10),
          database: dbUrl.pathname.slice(1),
          username: decodeURIComponent(dbUrl.username),
          password: decodeURIComponent(dbUrl.password),
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
