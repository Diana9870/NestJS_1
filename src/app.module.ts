import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { BookingsModule } from './bookings/bookings.module';
import { FilmsModule } from './films/films.module';
import { HallsModule } from './halls/halls.module';
import { ShowingsModule } from './showings/showings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FilmsModule,
    HallsModule,
    ShowingsModule,
    BookingsModule,
  ],
  providers: [
    {
      // Global ValidationPipe. Registered here (not only in main.ts) so that
      // it is active for any app built from AppModule, tests included.
      // whitelist: properties without a DTO decorator are stripped, so fields
      // that are not in a DTO never reach a service.
      // transform: bodies and queries become DTO class instances.
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
