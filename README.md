# 🎓 Student Management System

A full-stack web application for managing student records in a 4-year, 8-semester academic program. It includes JWT authentication, a year → semester → subject structure, multi-subject enrolment, and a dashboard with live enrolment statistics.

![Java](https://img.shields.io/badge/Java-17+-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18%2F19-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)

---

## 📸 Screenshots

| Login | Dashboard |
|---|---|
| ![Login](docs/login.png) | ![Dashboard](docs/dashboard.png) |

| Subject breakdown | Add student |
|---|---|
| ![Subjects](docs/subjects.png) | ![Form](docs/add-student.png) |

---

## ✨ Features

### Authentication
- Admin login with **JWT** (stateless, 24-hour expiry by default)
- Protected routes on the frontend and a secured API on the backend
- Automatic redirect to login when the session expires
- Show/hide password toggle and inline form errors

### Student management
- Create, view, update and delete students
- **Multi-subject enrolment:** a student can take several subjects, all from **one semester only**
- Unique **email** and **roll number** enforced by the server
- Delete confirmation dialog

### Academic structure
- **4 years × 2 semesters × 8 subjects = 64 subjects**
- Dependent selection: Year → Semester → Subjects (a checklist of that semester's 8 subjects)
- Changing the year or semester clears incompatible subjects
- The subject list lives in one backend file and is served to the frontend through an API, so the two never drift apart

### Dashboard
- One card per year showing total students and the Semester 1 / Semester 2 split
- Click a year to see how many students are enrolled in **each subject**
- Click a subject tile to filter the table to it
- Search by name, email, subject or roll number
- Filters for year, semester and subject (with a Clear button)
- Sortable columns and pagination
- Loading skeletons, empty states and toast notifications

### Validation (both layers)
| Layer | Checks |
|---|---|
| **React** | Required fields, name characters, email format, age 5–100, positive roll number, year/semester/subject selection, subjects belong to the chosen semester. Errors appear after a field is touched or on submit. |
| **Spring Boot** | The same rules via Bean Validation (`@Valid`), plus duplicate checks and curriculum checks. Returns per-field errors, so direct API calls cannot bypass the form. |

---

## 🧰 Tech stack

| Area | Technology |
|---|---|
| Backend | Java, Spring Boot, Spring Web, Spring Data JPA, Spring Security, Bean Validation, Lombok |
| Auth | JSON Web Tokens (jjwt 0.12) |
| Database | MySQL 8 |
| Frontend | React (Vite), React Router, Axios, Tailwind CSS v4, lucide-react, react-hot-toast |

---

## 📁 Project structure

```
student-management/
├── backend/
│   └── src/main/java/com/example/crudStringBootDemo/
│       ├── controller/    StudentController, AuthController, CurriculumController
│       ├── dto/           LoginRequest
│       ├── entity/        Student
│       ├── exception/     GlobalExceptionHandler, DuplicateFieldException, InvalidFieldException
│       ├── repository/    StudentRepository
│       ├── security/      SecurityConfig, JwtService, JwtAuthFilter
│       ├── service/       StudentService
│       └── util/          Curriculum (the 64-subject list)
├── frontend/
│   └── src/
│       ├── api/           http (axios + interceptors), authApi, studentApi, curriculumApi
│       ├── context/       AuthContext
│       ├── components/    Navbar, YearCard, SubjectBreakdown, StudentTable,
│       │                  StudentFormModal, FormInput, FormSelect, Pagination,
│       │                  ConfirmDialog, ProtectedRoute
│       ├── pages/         LoginPage, DashboardPage
│       └── utils/         constants, validators
├── docs/                  Screenshots
└── README.md
```

---

## 🚀 Getting started

### Prerequisites
- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8+**
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/AungKoKoLatt18/student-management.git
cd student-management
```

### 2. Set up the database

```sql
CREATE DATABASE student_crud_db;
```

Do **not** create the tables manually. Hibernate creates them on first start (`ddl-auto=update`).

### 3. Run the backend

```bash
cd backend
```

Copy the example config and fill in your values:

```bash
# macOS / Linux
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Windows (PowerShell)
copy src\main\resources\application.properties.example src\main\resources\application.properties
```

Edit `application.properties`:

| Property | Description |
|---|---|
| `spring.datasource.username` / `password` | Your MySQL credentials |
| `app.admin.username` / `app.admin.password` | The login you will use in the app |
| `app.jwt.secret` | Random string of **32+ characters** |
| `app.jwt.expiration-ms` | Token lifetime (default `86400000` = 24 h) |

Start the server:

```bash
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API runs on **http://localhost:8080**.

### 4. Run the frontend

```bash
cd frontend
cp .env.example .env          # Windows: copy .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** and sign in with the admin credentials from your `application.properties`.

---

## 🔌 API reference

All endpoints except `/api/auth/**` require the header:

```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Returns `{ token, username }`. `401` on bad credentials |

### Students

| Method | Endpoint | Description | Success |
|---|---|---|---|
| POST | `/api/students/create` | Create a student | `201` |
| GET | `/api/students/get/{id}` | Get one student | `200` / `404` |
| GET | `/api/students/getAll` | List all students | `200` |
| PUT | `/api/students/update/{id}` | Update a student | `200` / `404` |
| DELETE | `/api/students/delete/{id}` | Delete a student | `204` / `404` |

### Curriculum

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/curriculum` | Returns `{ year: { semester: [subjects] } }` |

### Example request body

```json
{
  "name": "Jane Doe",
  "age": 20,
  "email": "jane@example.com",
  "rollNo": 101,
  "year": 2,
  "semester": 1,
  "subjects": ["Operating Systems", "Java Programming", "DBMS Lab"]
}
```

### Error responses

| Status | Meaning | Body |
|---|---|---|
| `400` | Validation failed (including subjects not in the chosen semester) | `{ "message": "...", "errors": { "field": "reason" } }` |
| `401` | Missing, invalid or expired token | empty |
| `409` | Duplicate email or roll number | `{ "message": "...", "errors": { "email": "..." } }` |

---

## 🔐 Security notes

- Secrets (`application.properties`, `.env`) are git-ignored. Only the `.example` templates are committed.
- JWT is stored in `localStorage` for simplicity. For a public production app, prefer httpOnly cookies.
- The admin account is read from configuration, which is suitable for a demo or internal tool. For multiple users, add a `User` entity with BCrypt-hashed passwords.
- CORS currently allows `localhost` origins only. Change it in `SecurityConfig.java` before deploying.

---

## 🛠️ Customising the curriculum

Edit `backend/.../util/Curriculum.java` and restart the backend. The frontend loads the list from `/api/curriculum`, so no frontend change is needed. Keep exactly 8 subjects per semester.

> Renaming a subject does not update students already saved under the old name.

---

## 🩹 Troubleshooting

| Problem | Fix |
|---|---|
| `Field 'id' doesn't have a default value` (500) | The table was created manually without `AUTO_INCREMENT`. Drop `student_subjects` and `student`, then restart so Hibernate recreates them |
| `WeakKeyException` on startup | `app.jwt.secret` is shorter than 32 characters |
| CORS error in the browser | Backend not restarted, or the frontend runs on a non-`localhost` host |
| Every request returns 401 | Token expired (log in again), or `VITE_API_URL` is wrong. It should end with `/api` |
| `.env` changes have no effect | Restart `npm run dev` |
| Styles missing | Check `@import "tailwindcss";` in `index.css` and the Tailwind plugin in `vite.config.js` |

---

## 🗺️ Roadmap

- [ ] User table with registration and BCrypt passwords
- [ ] Role-based access (admin / viewer)
- [ ] Charts view (students per year)
- [ ] Export filtered list to Excel / CSV
- [ ] Admin screen to manage subjects without editing code
- [ ] Dark mode
- [ ] Docker Compose for one-command setup
- [ ] Unit and integration tests

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. Add a `LICENSE` file to the repository if you keep this section.

---