# 🚀 تطبيق MERN Stack CRUD البسيط والجاهز للاستعمال

تطبيق متكامل وبسيط لبناء وإدارة المهام والملاحظات باستخدام بيئة **MERN (MongoDB, Express, React, Node.js)**، مصمم بواجهة زجاجية عصرية (Glassmorphic UI) وداعماً لجميع عمليات **CRUD** الأربعة الأساسية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Backend:** Node.js, Express.js, Mongoose (MongoDB ORM), CORS, Dotenv
- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS Design System
- **Database:** MongoDB (مع دعم التخزين الاحتياطي التلقائي In-Memory mode ليعمل فوراً دون الحاجة لتشغيل MongoDB محلياً).

---

## ⚡ العمليات المدعومة (CRUD Operations)

| العملية | المسار (Endpoint) | الوصف |
| :--- | :--- | :--- |
| **GET** | `GET /api/tasks` | جلب وقراءة جميع المهام مع دعم البحث والفلترة حسب التصنيف والأولوية |
| **GET** | `GET /api/tasks/:id` | جلب مهمة واحدة عبر المعرف |
| **POST** | `POST /api/tasks` | إنشاء وإضافة مهمة جديدة |
| **PUT** | `PUT /api/tasks/:id` | تحديث وتعديل مهمة موجودة أو تغيير حالتها (مكتملة/غير مكتملة) |
| **DELETE** | `DELETE /api/tasks/:id` | حذف مهمة بشكل نهائي |

---

## 📁 هيكلية المشروع

```text
├── backend/
│   ├── config/db.js          # اتصال MongoDB مع حماية التراجعي In-Memory
│   ├── controllers/taskController.js # منطق معالجة POST, GET, PUT, DELETE
│   ├── models/Task.js        # Mongoose Schema للمهام
│   ├── routes/taskRoutes.js  # تعريف مسارات الـ API
│   ├── server.js             # تشغيل سيرفر Express على المنفذ 5000
│   └── .env                  # متغيرات البيئة
├── frontend/
│   ├── src/
│   │   ├── components/       # المكونات (Navbar, StatsHeader, TaskCard, TaskModal, Toast)
│   │   ├── services/api.js   # الربط بالسيرفر من خلال fetch
│   │   ├── App.jsx           # المكون الرئيسي للتحكم في الحالة
│   │   └── index.css         # تنسيقات المشروع
│   └── vite.config.js        # منفذ التشغيل 3000 مع Proxy لـ /api
└── package.json              # السكريبتات الموحدة
```

---

## 🚀 طريقة التشغيل والبدء

### 1️⃣ تشغيل السيرفر الخلفي (Backend)
افتح موجه الأوامر وفي مجلد `backend`:
```bash
cd backend
npm install
npm run dev
```
سيتم تشغيل سيرفر Express على **http://localhost:5000**.

### 2️⃣ تشغيل الواجهة الأمامية (Frontend)
في نافذة تيرمينال جديدة وفي مجلد `frontend`:
```bash
cd frontend
npm install
npm run dev
```
افتح المتصفح على **http://localhost:3000**.

---

## 🗄️ إعداد قاعدة البيانات MongoDB (اختياري)

- يعمل التطبيق تلقائياً في وضع **In-Memory** عند عدم توفر قاعدة بيانات MongoDB محلياً لتجربة التطبيق فوراً.
- لربط قاعدة بيانات MongoDB حقيقية، تأكد من تشغيل خادم MongoDB محلياً أو قم بتعديل رابط `MONGODB_URI` في ملف `backend/.env`:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/mern_crud_db
  ```
  أو رابط MongoDB Atlas السحابي:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern_crud_db
  ```
