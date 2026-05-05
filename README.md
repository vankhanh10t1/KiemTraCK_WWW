
# Final Exam - Tao Van Khanh (22714961)

Brief: Spring Boot + React project for final exam.

Contents
- `16_taovankhanh_22714961/` — backend (Spring Boot, Maven)
- `frontend/` — frontend (Vite + React)

Prerequisites
- Java 17+ and Maven (or use bundled `mvnw`/`mvnw.cmd`)
- Node 16+ and npm/yarn for the frontend

Database
- See `16_taovankhanh_22714961/database.sql` to create required schema and sample data.

Run backend (development)
On Windows (from project root):

```powershell
cd 16_taovankhanh_22714961
.\mvnw.cmd spring-boot:run
```

Or with installed Maven:

```bash
cd 16_taovankhanh_22714961
mvn spring-boot:run
```

Build backend jar

```bash
cd 16_taovankhanh_22714961
.\mvnw.cmd -DskipTests package
# artifact in target/
```

Run frontend (development)

```bash
cd frontend
npm install
npm run dev
```

Build frontend for production

```bash
cd frontend
npm install
npm run build
```

Git / Deploy
- Initialize a new repository locally (if not already): `git init`
- Add remote and push: `git remote add origin <REMOTE_URL>` then `git push -u origin main`

Notes
- This repo was re-initialized. If you want me to create a GitHub repository and push the code, tell me the desired repo name and whether it should be public or private (or provide a remote URL). I can create the remote if you have `gh` CLI authenticated, or you can provide the remote URL and credentials.

---
If you want, I can now initialize git locally and commit all files, then create the remote and push — tell me how you'd like the remote created.
