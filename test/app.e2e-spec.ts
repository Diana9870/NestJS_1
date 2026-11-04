import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const missingId = '00000000-0000-4000-8000-000000000000';

describe('Cinema API (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;

  beforeEach(async () => {
    // The global ValidationPipe is registered inside AppModule (APP_PIPE),
    // so the test app validates exactly like the real one.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  const createFilm = async (title = 'Дюна') =>
    (
      await http
        .post('/films')
        .send({ title, durationMinutes: 155, releaseYear: 2021 })
        .expect(201)
    ).body;
  const createHall = async (name = 'Зал 1', rows = 3, seatsPerRow = 5) =>
    (await http.post('/halls').send({ name, rows, seatsPerRow }).expect(201))
      .body;
  const inDays = (days: number, hour = 18) => {
    const date = new Date(Date.now() + days * 86_400_000);
    date.setUTCHours(hour, 0, 0, 0);
    return date.toISOString();
  };
  const createShowing = async (
    filmId: string,
    hallId: string,
    startsAt = inDays(5),
    price = 12500,
  ) =>
    (
      await http
        .post('/showings')
        .send({ filmId, hallId, startsAt, price })
        .expect(201)
    ).body;
  const ids = (body: Array<{ id: string }>) => body.map((item) => item.id);

  describe('films', () => {
    it('створює, читає, оновлює й видаляє фільм', async () => {
      await http.get('/films').expect(200, []);
      const film = await createFilm();
      expect(film.id).toEqual(expect.any(String));
      await http.get(`/films/${film.id}`).expect(200, film);
      const updated = await http
        .patch(`/films/${film.id}`)
        .send({ title: 'Дюна 2' })
        .expect(200);
      expect(updated.body).toEqual({ ...film, title: 'Дюна 2' });
      await http.delete(`/films/${film.id}`).expect(204).expect('');
      await http.get(`/films/${film.id}`).expect(404);
    });

    it('400 на відсутнє поле, неправильний тип і невалідний PATCH', async () => {
      await http.post('/films').send({ title: 'X' }).expect(400);
      await http
        .post('/films')
        .send({ title: 'X', durationMinutes: '100', releaseYear: 2020 })
        .expect(400);
      await http
        .post('/films')
        .send({ title: 'X', durationMinutes: -5, releaseYear: 2020 })
        .expect(400);
      await http
        .post('/films')
        .send({ title: 'X', durationMinutes: 90, releaseYear: -5 })
        .expect(400);
      const film = await createFilm();
      await http
        .patch(`/films/${film.id}`)
        .send({ releaseYear: 'давно' })
        .expect(400);
      await http
        .patch(`/films/${film.id}`)
        .send({ title: null, durationMinutes: null })
        .expect(400);
      await http.get(`/films/${film.id}`).expect(200, film);
    });

    it('не пропускає зайві поля до сервісу', async () => {
      const res = await http
        .post('/films')
        .send({
          title: 'X',
          durationMinutes: 90,
          releaseYear: 2000,
          id: 'hack',
          extra: 1,
        })
        .expect(201);
      expect(res.body.id).not.toBe('hack');
      expect(res.body.extra).toBeUndefined();
    });

    it('404 для невідомого id', async () => {
      await http.get(`/films/${missingId}`).expect(404);
      await http.patch(`/films/${missingId}`).send({}).expect(404);
      await http.delete(`/films/${missingId}`).expect(404);
    });

    it('409 при видаленні фільму з сеансом', async () => {
      const film = await createFilm();
      const hall = await createHall();
      await createShowing(film.id, hall.id);
      await http.delete(`/films/${film.id}`).expect(409);
      await http.get(`/films/${film.id}`).expect(200, film);
    });
  });

  describe('halls', () => {
    it('створює зал і повертає його з переліком місць', async () => {
      await http.get('/halls').expect(200, []);
      const hall = await createHall();
      const res = await http.get(`/halls/${hall.id}`).expect(200);
      expect(res.body.seats).toHaveLength(15);
      expect(res.body.seats[0]).toEqual({ row: 1, seat: 1 });
      expect(res.body.seats[14]).toEqual({ row: 3, seat: 5 });
      await http.get('/halls').expect(200, [hall]);
      await http.delete(`/halls/${hall.id}`).expect(204);
      await http.get(`/halls/${hall.id}`).expect(404);
    });

    it('400 на невалідні дані, 409 на дубль назви', async () => {
      await http.post('/halls').send({ name: 'A', rows: 3 }).expect(400);
      await http
        .post('/halls')
        .send({ name: 'A', rows: '3', seatsPerRow: 5 })
        .expect(400);
      await http
        .post('/halls')
        .send({ name: 'A', rows: 0, seatsPerRow: 5 })
        .expect(400);
      await http
        .post('/halls')
        .send({ name: 'A', rows: 2.5, seatsPerRow: 5 })
        .expect(400);
      await createHall('A');
      await http
        .post('/halls')
        .send({ name: 'A', rows: 1, seatsPerRow: 1 })
        .expect(409);
    });

    it('назва залу унікальна без урахування регістру й пробілів по краях', async () => {
      await createHall('Hall 1');
      await http
        .post('/halls')
        .send({ name: 'hall 1', rows: 1, seatsPerRow: 1 })
        .expect(409);
      await http
        .post('/halls')
        .send({ name: '  Hall 1  ', rows: 1, seatsPerRow: 1 })
        .expect(409);
      await http.get('/halls').expect((res) => {
        expect(res.body).toHaveLength(1);
      });
    });

    it('404 для невідомого залу, 409 при видаленні залу з сеансом', async () => {
      await http.get(`/halls/${missingId}`).expect(404);
      await http.delete(`/halls/${missingId}`).expect(404);
      const film = await createFilm();
      const hall = await createHall();
      await createShowing(film.id, hall.id);
      await http.delete(`/halls/${hall.id}`).expect(409);
      await http.get(`/halls/${hall.id}`).expect(200);
    });
  });

  describe('showings', () => {
    it('створює сеанс і віддає його з назвами фільму й залу', async () => {
      const film = await createFilm();
      const hall = await createHall();
      const showing = await createShowing(film.id, hall.id);
      expect(showing).toMatchObject({
        filmId: film.id,
        hallId: hall.id,
        price: 12500,
      });
      const res = await http.get(`/showings/${showing.id}`).expect(200);
      expect(res.body).toEqual({
        id: showing.id,
        filmTitle: 'Дюна',
        hallName: 'Зал 1',
        startsAt: showing.startsAt,
        price: 12500,
      });
      await http.get(`/showings/${missingId}`).expect(404);
    });

    it('400 з причиною на невалідні дані', async () => {
      const film = await createFilm();
      const hall = await createHall();
      const base = {
        filmId: film.id,
        hallId: hall.id,
        startsAt: inDays(3),
        price: 100,
      };

      const noFilm = await http
        .post('/showings')
        .send({ ...base, filmId: missingId })
        .expect(400);
      expect(noFilm.body.message).toContain(missingId);
      const noHall = await http
        .post('/showings')
        .send({ ...base, hallId: missingId })
        .expect(400);
      expect(noHall.body.message).toContain(missingId);

      await http
        .post('/showings')
        .send({ ...base, startsAt: 'завтра' })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, startsAt: '2030-02-30T10:00:00Z' })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, startsAt: '2000-01-01T10:00:00Z' })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, price: 0 })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, price: 99.5 })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, price: '100' })
        .expect(400);
      await http.post('/showings').send({ filmId: film.id }).expect(400);
      await http
        .post('/showings')
        .send({ ...base, startsAt: '20990501T120000Z' })
        .expect(400);
      await http
        .post('/showings')
        .send({ ...base, startsAt: '2099-05-01' })
        .expect(400);
      await http.get('/showings').expect(200, []);
    });

    it('фільтрує за filmId і датою та сортує за часом, потім за id', async () => {
      const film1 = await createFilm('Фільм 1');
      const film2 = await createFilm('Фільм 2');
      const hall = await createHall();
      const late = await createShowing(film1.id, hall.id, inDays(5, 20));
      const early = await createShowing(film1.id, hall.id, inDays(5, 10));
      const other = await createShowing(film2.id, hall.id, inDays(6, 10));
      const tie1 = await createShowing(film2.id, hall.id, inDays(7, 12));
      const tie2 = await createShowing(film2.id, hall.id, inDays(7, 12));

      const all = await http.get('/showings').expect(200);
      expect(all.body).toHaveLength(5);
      const times = all.body.map((s: { startsAt: string }) => s.startsAt);
      expect(times).toEqual([...times].sort());
      expect(ids(all.body).slice(3)).toEqual([tie1.id, tie2.id].sort());
      expect(all.body[0].filmTitle).toBe('Фільм 1');
      expect(all.body[0].hallName).toBe('Зал 1');

      const byFilm = await http.get(`/showings?filmId=${film1.id}`).expect(200);
      expect(ids(byFilm.body)).toEqual([early.id, late.id]);

      const day = inDays(6).slice(0, 10);
      const byDate = await http.get(`/showings?date=${day}`).expect(200);
      expect(ids(byDate.body)).toEqual([other.id]);

      const both = await http
        .get(`/showings?filmId=${film1.id}&date=${day}`)
        .expect(200);
      expect(both.body).toEqual([]);

      await http.get('/showings?date=01.05.2030').expect(400);
      await http.get('/showings?date=2030-13-45').expect(400);
    });

    it('нормалізує startsAt до UTC, а date рахує добу за UTC', async () => {
      const film = await createFilm();
      const hall = await createHall();
      // 01:00 за +03:00 це ще 22:00 попередньої доби за UTC.
      const shifted = await createShowing(
        film.id,
        hall.id,
        '2099-06-01T01:00:00+03:00',
      );
      expect(shifted.startsAt).toBe('2099-05-31T22:00:00.000Z');

      const prevDay = await http.get('/showings?date=2099-05-31').expect(200);
      expect(ids(prevDay.body)).toEqual([shifted.id]);
      const nextDay = await http.get('/showings?date=2099-06-01').expect(200);
      expect(nextDay.body).toEqual([]);
    });

    it('значення без зсуву читається як UTC', async () => {
      const film = await createFilm();
      const hall = await createHall();
      const showing = await createShowing(
        film.id,
        hall.id,
        '2099-07-01T18:00:00',
      );
      expect(showing.startsAt).toBe('2099-07-01T18:00:00.000Z');
      const res = await http.get('/showings?date=2099-07-01').expect(200);
      expect(ids(res.body)).toEqual([showing.id]);
    });

    it('сортує сеанси з різними зсувами за справжнім моментом часу', async () => {
      const film = await createFilm();
      const hall = await createHall();
      // 10:00+05:00 = 05:00Z, раніше за 08:00Z, хоча «10» більше за «08».
      const first = await createShowing(
        film.id,
        hall.id,
        '2099-08-01T10:00:00+05:00',
      );
      const second = await createShowing(
        film.id,
        hall.id,
        '2099-08-01T08:00:00Z',
      );
      const res = await http.get('/showings?date=2099-08-01').expect(200);
      expect(ids(res.body)).toEqual([first.id, second.id]);
    });

    it('показує зайнятість місць на сеансі', async () => {
      const film = await createFilm();
      const hall = await createHall();
      const showing = await createShowing(film.id, hall.id);
      const before = await http
        .get(`/showings/${showing.id}/seats`)
        .expect(200);
      expect(before.body).toHaveLength(15);
      expect(before.body.every((s: { isBooked: boolean }) => !s.isBooked)).toBe(
        true,
      );

      await http
        .post(`/showings/${showing.id}/bookings`)
        .send({ seats: [{ row: 2, seat: 3 }] })
        .expect(201);
      const after = await http.get(`/showings/${showing.id}/seats`).expect(200);
      const booked = after.body.filter(
        (s: { isBooked: boolean }) => s.isBooked,
      );
      expect(booked).toEqual([{ row: 2, seat: 3, isBooked: true }]);
      await http.get(`/showings/${missingId}/seats`).expect(404);
    });
  });

  describe('bookings', () => {
    let showingId: string;

    beforeEach(async () => {
      const film = await createFilm();
      const hall = await createHall();
      showingId = (await createShowing(film.id, hall.id, inDays(5), 12500)).id;
    });

    const book = (seats: unknown) =>
      http.post(`/showings/${showingId}/bookings`).send({ seats });

    it('створює бронювання з підсумковою ціною', async () => {
      await http.get('/bookings').expect(200, []);
      const res = await book([
        { row: 1, seat: 1 },
        { row: 1, seat: 2 },
        { row: 3, seat: 5 },
      ]).expect(201);
      expect(res.body).toMatchObject({ showingId, totalPrice: 37500 });
      expect(res.body.seats).toHaveLength(3);
      await http.get('/bookings').expect(200, [res.body]);
      await http.get(`/showings/${showingId}/bookings`).expect(200, [res.body]);
    });

    it('404 для невідомого сеансу', async () => {
      await http
        .post(`/showings/${missingId}/bookings`)
        .send({ seats: [{ row: 1, seat: 1 }] })
        .expect(404);
      await http.get(`/showings/${missingId}/bookings`).expect(404);
    });

    it('400 на невалідний масив місць', async () => {
      await book([]).expect(400);
      await book(undefined).expect(400);
      await book([{ row: 1 }]).expect(400);
      await book([null]).expect(400);
      await book([{ row: 1, seat: 'a' }]).expect(400);
      await book([{ row: 0, seat: 1 }]).expect(400);
      await book([{ row: 1, seat: -1 }]).expect(400);
      await book([{ row: 1.5, seat: 1 }]).expect(400);
      await book([
        { row: 1, seat: 1 },
        { row: 1, seat: 1 },
      ]).expect(400);
      await book([{ row: 4, seat: 1 }]).expect(400);
      await book([{ row: 1, seat: 6 }]).expect(400);
      await http.get('/bookings').expect(200, []);
    });

    it('409 при зайнятому місці й нічого не бронює', async () => {
      await book([{ row: 2, seat: 2 }]).expect(201);
      await book([
        { row: 1, seat: 1 },
        { row: 2, seat: 2 },
      ]).expect(409);
      const seats = await http.get(`/showings/${showingId}/seats`).expect(200);
      expect(
        seats.body.filter((s: { isBooked: boolean }) => s.isBooked),
      ).toHaveLength(1);
      await http.get(`/showings/${showingId}/bookings`).expect((res) => {
        expect(res.body).toHaveLength(1);
      });
    });

    it('скасування звільняє місця', async () => {
      const first = await book([{ row: 1, seat: 1 }]).expect(201);
      await book([{ row: 1, seat: 1 }]).expect(409);
      await http.delete(`/bookings/${first.body.id}`).expect(204).expect('');
      await book([{ row: 1, seat: 1 }]).expect(201);
      await http.delete(`/bookings/${missingId}`).expect(404);
      await http.delete(`/bookings/${first.body.id}`).expect(404);
    });
  });
});
