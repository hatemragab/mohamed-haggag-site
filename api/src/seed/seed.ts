/**
 * Seed script: loads ALL prototype content into MongoDB.
 *   pnpm seed   (from /api or repo root)
 *
 * Content collections (categories, lessons, plans, testimonials, site content)
 * are replaced wholesale. Users are preserved — only the admin is upserted.
 */
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { CategorySchema } from '../categories/category.schema';
import { LessonSchema } from '../lessons/lesson.schema';
import { PlanSchema } from '../plans/plan.schema';
import { SiteContentSchema } from '../site-content/site-content.schema';
import { TestimonialSchema } from '../testimonials/testimonial.schema';
import { UserSchema } from '../users/user.schema';
import {
  ADMIN_USER,
  CATEGORIES,
  genLessons,
  PLANS,
  SITE_CONTENT,
  TESTIMONIALS,
} from './seed-data';

async function main() {
  const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27018/haggag';
  await mongoose.connect(uri);
  console.log(`✔ connected to ${uri}`);

  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Lesson = mongoose.model('Lesson', LessonSchema);
  const Plan = mongoose.model('Plan', PlanSchema);
  const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
  const SiteContent = mongoose.model('SiteContent', SiteContentSchema);

  // --- admin user (upsert; students are never touched) ---
  // Production: set ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD env vars.
  const adminUsername = process.env.ADMIN_USERNAME ?? ADMIN_USER.username;
  const adminEmail = process.env.ADMIN_EMAIL ?? ADMIN_USER.email;
  const adminPassword = process.env.ADMIN_PASSWORD ?? ADMIN_USER.password;
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.updateOne(
    { username: adminUsername },
    {
      $set: {
        name: ADMIN_USER.name,
        email: adminEmail,
        passwordHash,
        role: 'admin',
        status: 'active',
        unlockedAll: true,
      },
      $setOnInsert: {
        unlockedCategories: [],
        progress: [],
        continueWatching: [],
      },
    },
    { upsert: true },
  );
  console.log(`✔ admin user (${adminUsername})`);
  if (adminPassword === ADMIN_USER.password)
    console.warn(
      '⚠ admin uses the DEFAULT password — set ADMIN_PASSWORD and re-seed before going live',
    );

  // --- categories + generated lessons ---
  await Category.deleteMany({});
  await Lesson.deleteMany({});
  let lessonCount = 0;
  for (const cat of CATEGORIES) {
    const doc = await Category.create(cat);
    const groups = cat.groups
      ? cat.groups.map((g) => ({
          key: g.key,
          levels: g.levels,
        }))
      : [{ key: null, levels: cat.levels }];
    for (const group of groups) {
      for (const level of group.levels) {
        const subKey = group.key ? `${group.key}-${level.key}` : level.key;
        const lessons = genLessons(cat.slug, subKey, level.title);
        await Lesson.insertMany(
          lessons.map((l) => ({
            ...l,
            category: doc._id,
            groupKey: group.key,
            levelKey: level.key,
          })),
        );
        lessonCount += lessons.length;
      }
    }
  }
  console.log(`✔ ${CATEGORIES.length} categories, ${lessonCount} lessons`);

  // --- plans / testimonials / site content ---
  await Plan.deleteMany({});
  await Plan.insertMany(PLANS);
  console.log(`✔ ${PLANS.length} plans`);

  await Testimonial.deleteMany({});
  await Testimonial.insertMany(TESTIMONIALS);
  console.log(`✔ ${TESTIMONIALS.length} testimonials`);

  await SiteContent.deleteMany({});
  await SiteContent.create(SITE_CONTENT);
  console.log(
    '✔ site content (hero, instructor, why, learn, steps, faq, contact, terms)',
  );

  await mongoose.disconnect();
  console.log('✔ seed complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
