/**
 * E2E for THE core business rule: a locked lesson's youtubeId must never be
 * returned to anyone who hasn't unlocked it — not in catalogs, not in watch.
 *
 * Runs against a real MongoDB (docker) using a dedicated database that is
 * dropped before and after the run.
 */
process.env.MONGO_URI = 'mongodb://127.0.0.1:27018/haggag_e2e';
process.env.JWT_ACCESS_SECRET = 'e2e-access-secret';
process.env.JWT_REFRESH_SECRET = 'e2e-refresh-secret';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Category, CategoryDocument } from '../src/categories/category.schema';
import { Lesson, LessonDocument } from '../src/lessons/lesson.schema';
import { Plan, PlanDocument } from '../src/plans/plan.schema';

const SECRET_YT = 'LOCKEDyt001'; // 11 chars — the id that must never leak
const FREE_YT = 'FREEyt00001';

interface WatchRes {
  youtubeId: string;
}
interface OrderRes {
  id: string;
  status: string;
}
interface AdminOrderRow {
  status: string;
  student: string;
}
interface LessonRow {
  id: string;
  youtubeId: string;
}

describe('Lesson access rule (e2e)', () => {
  let app: INestApplication;
  let conn: Connection;
  let categoryId: string;
  let categorySlug: string;
  let freeLessonId: string;
  let lockedLessonId: string;
  let studentCookies: string[];

  const agent = () =>
    request(app.getHttpServer() as Parameters<typeof request>[0]);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    conn = app.get<Connection>(getConnectionToken());
    await conn.dropDatabase();

    const categories = app.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );
    const lessons = app.get<Model<LessonDocument>>(getModelToken(Lesson.name));
    const plans = app.get<Model<PlanDocument>>(getModelToken(Plan.name));

    const cat = await categories.create({
      slug: 'e2e-cat',
      title: 'مسار الاختبار',
      level: 'تأسيسي',
      order: 1,
      levels: [{ key: 'lvl1', title: 'المستوى الأول', note: '' }],
    });
    categoryId = cat._id.toString();
    categorySlug = cat.slug;

    const free = await lessons.create({
      category: cat._id,
      groupKey: null,
      levelKey: 'lvl1',
      title: 'درس مجاني',
      youtubeId: FREE_YT,
      durationMinutes: 10,
      free: true,
      order: 1,
    });
    const locked = await lessons.create({
      category: cat._id,
      groupKey: null,
      levelKey: 'lvl1',
      title: 'درس مغلق',
      youtubeId: SECRET_YT,
      durationMinutes: 20,
      free: false,
      order: 2,
    });
    freeLessonId = free._id.toString();
    lockedLessonId = locked._id.toString();

    await plans.create({
      key: 'single',
      name: 'دورة واحدة',
      prices: { AED: 149, EGP: 1990, USD: 39 },
      order: 1,
    });
  });

  afterAll(async () => {
    await conn.dropDatabase();
    await app.close();
  });

  it('public category detail never contains any youtubeId', async () => {
    const res = await agent().get(`/categories/${categorySlug}`).expect(200);
    const body = JSON.stringify(res.body);
    expect(body).not.toContain(SECRET_YT);
    expect(body).not.toContain(FREE_YT);
    expect(body).not.toContain('youtubeId');
  });

  it('public lesson context never contains any youtubeId', async () => {
    const res = await agent()
      .get(`/lessons/${lockedLessonId}/context`)
      .expect(200);
    const body = JSON.stringify(res.body);
    expect(body).not.toContain(SECRET_YT);
    expect(body).not.toContain('youtubeId');
  });

  it('anonymous user can watch the free lesson', async () => {
    const res = await agent().get(`/lessons/${freeLessonId}/watch`).expect(200);
    expect((res.body as WatchRes).youtubeId).toBe(FREE_YT);
  });

  it('anonymous user cannot watch the locked lesson', async () => {
    const res = await agent().get(`/lessons/${lockedLessonId}/watch`);
    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).not.toContain(SECRET_YT);
  });

  it('a registered (non-paying) student cannot watch the locked lesson', async () => {
    const reg = await agent()
      .post('/auth/register')
      .send({
        name: 'طالب الاختبار',
        email: 'e2e-student@test.com',
        password: 'secret123',
      })
      .expect(201);
    studentCookies = reg.get('Set-Cookie') ?? [];
    expect(studentCookies.length).toBeGreaterThan(0);

    const res = await agent()
      .get(`/lessons/${lockedLessonId}/watch`)
      .set('Cookie', studentCookies);
    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).not.toContain(SECRET_YT);
  });

  it('after mock checkout the student can watch the locked lesson', async () => {
    const order = await agent()
      .post('/orders')
      .set('Cookie', studentCookies)
      .send({
        planKey: 'single',
        categoryId,
        currency: 'AED',
        provider: 'stripe',
      })
      .expect(201);
    const orderBody = order.body as OrderRes;
    expect(orderBody.status).toBe('pending');

    const paid = await agent()
      .post(`/orders/${orderBody.id}/pay`)
      .set('Cookie', studentCookies)
      .expect(201);
    expect((paid.body as OrderRes).status).toBe('paid');

    const res = await agent()
      .get(`/lessons/${lockedLessonId}/watch`)
      .set('Cookie', studentCookies)
      .expect(200);
    expect((res.body as WatchRes).youtubeId).toBe(SECRET_YT);
  });

  it('the paid order shows up in the admin payments list', async () => {
    // the seeded admin does not exist in this clean DB — create one directly
    const users = conn.collection('users');
    const bcrypt = await import('bcryptjs');
    await users.insertOne({
      name: 'أدمن الاختبار',
      email: 'e2e-admin@test.com',
      username: 'e2e-admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'admin',
      status: 'active',
      unlockedAll: true,
      unlockedCategories: [],
      progress: [],
      continueWatching: [],
    });
    const login = await agent()
      .post('/auth/admin/login')
      .send({ identifier: 'e2e-admin', password: 'admin123' })
      .expect(201);
    const adminCookies = login.get('Set-Cookie') ?? [];

    const orders = await agent()
      .get('/orders')
      .set('Cookie', adminCookies)
      .expect(200);
    const rows = orders.body as AdminOrderRow[];
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('paid');
    expect(rows[0].student).toBe('طالب الاختبار');
  });

  it('a student cannot access admin endpoints', async () => {
    await agent()
      .get('/admin/overview')
      .set('Cookie', studentCookies)
      .expect(403);
  });

  // Regression guard: Mongoose 9 stopped casting string ids on ref paths —
  // these endpoints filter by category/user from query/body strings.
  it('admin lesson listing + reorder and student order history work', async () => {
    const login = await agent()
      .post('/auth/admin/login')
      .send({ identifier: 'e2e-admin', password: 'admin123' })
      .expect(201);
    const adminCookies = login.get('Set-Cookie') ?? [];

    const list = await agent()
      .get(`/lessons?categoryId=${categoryId}&levelKey=lvl1`)
      .set('Cookie', adminCookies)
      .expect(200);
    const lessonRows = list.body as LessonRow[];
    expect(lessonRows).toHaveLength(2);
    expect(lessonRows[0].youtubeId).toBe(FREE_YT);

    const reversed = [lockedLessonId, freeLessonId];
    const reordered = await agent()
      .patch('/lessons/reorder')
      .set('Cookie', adminCookies)
      .send({ categoryId, levelKey: 'lvl1', orderedIds: reversed })
      .expect(200);
    expect((reordered.body as LessonRow[]).map((l) => l.id)).toEqual(reversed);

    const mine = await agent()
      .get('/orders/mine')
      .set('Cookie', studentCookies)
      .expect(200);
    const mineRows = mine.body as OrderRes[];
    expect(mineRows).toHaveLength(1);
    expect(mineRows[0].status).toBe('paid');
  });
});
