import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MapService } from './map/map.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MapService],
})
export class AppModule {}
