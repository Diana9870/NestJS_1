import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmsModule } from './films/films.module';
import { HallsModule } from './halls/halls.module';
import { ShowingsModule } from './showings/showings.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [FilmsModule, HallsModule, ShowingsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
