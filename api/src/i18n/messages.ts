/**
 * API message catalog. Every user-facing exception / validation message lives
 * here keyed by a short camelCase name; services & DTOs throw the KEY, and the
 * global I18nExceptionFilter swaps it for the right language at response time.
 *
 * Arabic is the DEFAULT language. The `ar` text below is byte-identical to the
 * literals it replaced, so existing behaviour (and the e2e suite) is unchanged
 * when no/unknown Accept-Language is sent.
 *
 * Unknown keys (e.g. class-validator's built-in English defaults) pass through
 * untouched — see `translate()`.
 */

export type Locale = 'ar' | 'en';
export const DEFAULT_LOCALE: Locale = 'ar';

interface Entry {
  ar: string;
  en: string;
}

export const MESSAGES = {
  // ── auth / session ──────────────────────────────────────────────
  emailTaken: {
    ar: 'هذا البريد الإلكتروني مسجّل بالفعل',
    en: 'This email is already registered',
  },
  invalidCredentials: {
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    en: 'Incorrect email or password',
  },
  invalidAdminCredentials: {
    ar: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    en: 'Incorrect username or password',
  },
  accountSuspended: {
    ar: 'هذا الحساب موقوف — تواصل مع الإدارة',
    en: 'This account is suspended — please contact support',
  },
  noSession: {
    ar: 'لا توجد جلسة',
    en: 'No active session',
  },
  sessionExpired: {
    ar: 'انتهت الجلسة — سجّل الدخول مجدداً',
    en: 'Your session has expired — please sign in again',
  },
  loginRequired: {
    ar: 'يجب تسجيل الدخول',
    en: 'You must be signed in',
  },
  forbidden: {
    ar: 'غير مصرّح لك بهذا الإجراء',
    en: 'You are not authorized to perform this action',
  },

  // ── students / admin ────────────────────────────────────────────
  studentNotFound: {
    ar: 'الطالب غير موجود',
    en: 'Student not found',
  },
  cannotDeleteAccount: {
    ar: 'لا يمكن حذف هذا الحساب',
    en: 'This account cannot be deleted',
  },
  cannotModifyAccount: {
    ar: 'لا يمكن تعديل حالة هذا الحساب',
    en: 'This account status cannot be changed',
  },
  userNotFound: {
    ar: 'المستخدم غير موجود',
    en: 'User not found',
  },

  // ── catalog ─────────────────────────────────────────────────────
  categoryNotFound: {
    ar: 'القسم غير موجود',
    en: 'Category not found',
  },
  levelNotFound: {
    ar: 'المستوى غير موجود',
    en: 'Level not found',
  },
  groupNotFound: {
    ar: 'المجموعة غير موجودة',
    en: 'Group not found',
  },
  lessonNotFound: {
    ar: 'الدرس غير موجود',
    en: 'Lesson not found',
  },
  lessonLoginRequired: {
    ar: 'سجّل الدخول وافتح المسار لمشاهدة هذا الدرس',
    en: 'Sign in and unlock this track to watch this lesson',
  },
  lessonLocked: {
    ar: 'هذا الدرس مغلق — افتح المسار لمشاهدته',
    en: 'This lesson is locked — unlock the track to watch it',
  },
  invalidYoutubeId: {
    ar: 'لم يتم التعرّف على مُعرّف يوتيوب صحيح — تأكد من الرابط',
    en: 'Could not detect a valid YouTube ID — check the link',
  },
  reorderMismatch: {
    ar: 'قائمة الترتيب غير مطابقة لدروس المستوى',
    en: "The order list does not match this level's lessons",
  },

  // ── orders / payments ───────────────────────────────────────────
  orderNotFound: {
    ar: 'الطلب غير موجود',
    en: 'Order not found',
  },
  selectCategory: {
    ar: 'اختر المسار المراد شراؤه',
    en: 'Choose the track you want to purchase',
  },
  orderNotYours: {
    ar: 'هذا الطلب لا يخصّك',
    en: 'This order does not belong to you',
  },
  orderNotPayable: {
    ar: 'لا يمكن دفع هذا الطلب',
    en: 'This order cannot be paid',
  },
  paymentFailed: {
    ar: 'فشلت عملية الدفع — حاول مجدداً',
    en: 'Payment failed — please try again',
  },
  planNotFound: {
    ar: 'الباقة غير موجودة',
    en: 'Plan not found',
  },

  // ── misc ────────────────────────────────────────────────────────
  testimonialNotFound: {
    ar: 'التقييم غير موجود',
    en: 'Testimonial not found',
  },
  siteContentMissing: {
    ar: 'محتوى الموقع غير مُهيّأ — شغّل pnpm seed أولاً',
    en: 'Site content is not initialized — run pnpm seed first',
  },

  // ── validation (class-validator messages) ───────────────────────
  nameMin: {
    ar: 'يرجى إدخال الاسم كاملاً',
    en: 'Please enter your full name',
  },
  email: {
    ar: 'بريد إلكتروني غير صحيح',
    en: 'Invalid email address',
  },
  passwordMin: {
    ar: 'كلمة المرور ٦ أحرف على الأقل',
    en: 'Password must be at least 6 characters',
  },
  passwordRequired: {
    ar: 'أدخل كلمة المرور',
    en: 'Enter your password',
  },
  usernameRequired: {
    ar: 'أدخل اسم المستخدم',
    en: 'Enter your username',
  },
  categoryNameRequired: {
    ar: 'أدخل اسم القسم',
    en: 'Enter the category name',
  },
  levelNameRequired: {
    ar: 'أدخل اسم المستوى',
    en: 'Enter the level name',
  },
  lessonTitleRequired: {
    ar: 'أدخل عنوان الدرس',
    en: 'Enter the lesson title',
  },
  durationMin: {
    ar: 'المدة دقيقة واحدة على الأقل',
    en: 'Duration must be at least one minute',
  },
  nameRequired: {
    ar: 'أدخل الاسم',
    en: 'Enter the name',
  },
  testimonialTextRequired: {
    ar: 'أدخل نص التقييم',
    en: 'Enter the testimonial text',
  },
  yourNameRequired: {
    ar: 'أدخل اسمك',
    en: 'Enter your name',
  },
  messageRequired: {
    ar: 'اكتب رسالتك',
    en: 'Write your message',
  },
  contactLinkInvalid: {
    ar: 'رابط غير صالح — يجب أن يبدأ بـ http أو https',
    en: 'Invalid link — it must start with http or https',
  },
} satisfies Record<string, Entry>;

export type MsgKey = keyof typeof MESSAGES;

/** Typed key registry — `MK.emailTaken === 'emailTaken'` — for typo-safe throws. */
export const MK = Object.fromEntries(
  Object.keys(MESSAGES).map((k) => [k, k]),
) as { [K in MsgKey]: K };

/** Map an Accept-Language / ?lang value to a supported locale (default: ar). */
export function resolveLocale(input?: string | null): Locale {
  if (!input) return DEFAULT_LOCALE;
  return input.trim().toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE;
}

/** Translate a message key; unknown strings (non-keys) pass through unchanged. */
export function translate(message: string, locale: Locale): string {
  const entry = (MESSAGES as Record<string, Entry>)[message];
  if (entry) return entry[locale];
  // Nested-DTO validation messages arrive as "<property path>.<key>" (the
  // ValidationPipe prefixes the path). Translate the key, drop the path.
  const tail = message.slice(message.lastIndexOf('.') + 1);
  const tailEntry = (MESSAGES as Record<string, Entry>)[tail];
  return tailEntry ? tailEntry[locale] : message;
}
