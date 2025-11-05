# نشر Pixellab Web على Vercel

هذا الملف يحتوي على تعليمات نشر التطبيق على منصة Vercel.

## المتطلبات

- حساب على [Vercel](https://vercel.com)
- Git و GitHub (أو GitLab/Bitbucket)
- Node.js >= 18.0.0
- pnpm >= 8.0.0

## خطوات النشر

### 1. دفع المشروع إلى GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. ربط المشروع بـ Vercel

**الطريقة الأولى: عبر واجهة Vercel**

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. انقر على "Add New" ثم اختر "Project"
3. اختر مستودع GitHub الخاص بك
4. اختر `pixellab-web`
5. في إعدادات البناء:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

6. أضف متغيرات البيئة إذا لزم الأمر:
   - `VITE_APP_TITLE`: عنوان التطبيق
   - `VITE_APP_LOGO`: رابط الشعار
   - `VITE_ANALYTICS_ENDPOINT`: (اختياري)
   - `VITE_ANALYTICS_WEBSITE_ID`: (اختياري)

7. انقر على "Deploy"

**الطريقة الثانية: عبر Vercel CLI**

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# لنشر الإنتاج مباشرة
vercel --prod
```

### 3. التحقق من النشر

بعد انتهاء عملية البناء:
- سيحصل المشروع على رابط Vercel مؤقت (مثل `pixellab-web-xxx.vercel.app`)
- يمكنك ربط نطاق مخصص في إعدادات Vercel

## إعدادات Vercel المهمة

### ملف vercel.json

تم إنشاء ملف `vercel.json` بالفعل مع الإعدادات التالية:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

### متغيرات البيئة

يمكن تعيين متغيرات البيئة من خلال:

1. **Vercel Dashboard**:
   - Project Settings → Environment Variables
   - أضف المتغيرات المطلوبة

2. **ملف .env.local** (للتطوير المحلي فقط):
   ```
   VITE_APP_TITLE=Pixellab Web
   VITE_APP_LOGO=/logo.png
   ```

## نصائح الأداء

### تحسين البناء

- **Caching**: Vercel يخزن مؤقتاً تلقائياً الملفات الثابتة
- **Edge Functions**: يمكن استخدام Edge Middleware للتحسينات الإضافية
- **Image Optimization**: استخدم Vercel Image Optimization للصور

### تحسين الوقت التشغيلي

- تطبيق Pixellab Web ثابت (Static) بالكامل
- لا توجد حاجة لخادم Node.js
- يتم تقديم الملفات مباشرة من CDN

## استكشاف الأخطاء

### مشكلة: فشل البناء

**الحل**:
```bash
# تحقق من الأخطاء محلياً
pnpm build

# تحقق من إصدار Node.js
node --version

# تحقق من إصدار pnpm
pnpm --version
```

### مشكلة: الصفحة البيضاء بعد النشر

**الحل**:
- تحقق من متغيرات البيئة
- امسح ذاكرة التخزين المؤقت للمتصفح (Ctrl+Shift+Delete)
- تحقق من وحدة التحكم (DevTools) للأخطاء

### مشكلة: الصور لا تظهر

**الحل**:
- تأكد من أن الصور موجودة في مجلد `public`
- استخدم المسارات النسبية الصحيحة
- تحقق من إعدادات CORS إذا كانت الصور من مصدر خارجي

## الصيانة والتحديثات

### تحديث التطبيق

```bash
# اسحب أحدث التغييرات
git pull origin main

# ستتم إعادة البناء والنشر تلقائياً على Vercel
```

### المراقبة

- استخدم **Vercel Analytics** لمراقبة الأداء
- استخدم **Vercel Logs** لمراجعة السجلات
- راقب استخدام البناء (Build Usage)

## نطاقات مخصصة

### إضافة نطاق مخصص

1. اذهب إلى Project Settings
2. انقر على "Domains"
3. أضف النطاق الخاص بك
4. اتبع تعليمات DNS

### شهادة SSL

- Vercel توفر شهادات SSL مجانية تلقائياً
- يتم التجديد تلقائياً

## الدعم والمساعدة

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)
- [GitHub Issues](https://github.com/yourusername/pixellab-web/issues)

---

**ملاحظة**: تأكد من تحديث رابط المستودع في التعليمات أعلاه بالرابط الفعلي لمشروعك على GitHub.
