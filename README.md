# casino-frontend

SPA Angular 17 (standalone components) del **Casino Online** —
Experiencia 2 de la asignatura **Introducción a Herramientas DevOps (ISY1101)**.

> ⚠️ **Este repositorio NO incluye `Dockerfile`, `docker-compose.yml`
> ni workflows de GitHub Actions.** Esos artefactos forman parte del
> entregable de la **Evaluación Parcial 2** y deben construirlos los
> estudiantes.

---

## Stack

- Angular 17 (standalone components, signals, lazy routes)
- TypeScript 5.4
- HTTP interceptor para JWT
- Guard de ruta para zonas protegidas
- Build de producción con la nueva `application` builder de Angular 17

---

## Estructura

```
casino-frontend/
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── environments/
│   │   ├── environment.ts          ← dev (apiBaseUrl localhost:3000)
│   │   └── environment.prod.ts     ← cambiar a la IP/dominio del backend EC2
│   └── app/
│       ├── app.component.ts        ← shell con <router-outlet>
│       ├── app.routes.ts           ← rutas con lazy-loading
│       ├── models/casino.models.ts
│       ├── services/
│       │   ├── auth.service.ts     ← login/registro/logout (signals)
│       │   └── casino.service.ts   ← juegos, perfil, historial
│       ├── interceptors/auth.interceptor.ts
│       ├── guards/auth.guard.ts
│       └── components/
│           ├── header/
│           ├── login/   register/
│           ├── lobby/
│           ├── slots/   roulette/   blackjack/
│           ├── profile/  history/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── .dockerignore
└── .gitignore
```

---

## Funcionalidades

### Autenticación
- Login y registro con email/usuario y contraseña.
- Token JWT guardado en `localStorage` y enviado por interceptor
  HTTP en cada petición (`Authorization: Bearer ...`).
- Guard `authGuard` que redirige a `/login` si no hay sesión.
- 401 → cierra sesión automáticamente.

### Lobby
- Lista los juegos activos del catálogo (`GET /api/juegos`).
- Muestra saldo en vivo, sincronizado con el backend.

### Tragamonedas (slots)
- 3 rodillos animados.
- Apuesta entre $10 y $500.
- Pago en función del símbolo: 50× para 7️⃣, 25× para 💎, etc.

### Ruleta europea
- Tablero con todos los números (0–36) coloreados.
- Tipos de apuesta: número (35:1), color (1:1), par/impar (1:1), docena (2:1).
- Permite acumular varias apuestas antes de girar.

### Blackjack
- Mano contra la banca, banca pide hasta 17.
- Acciones: pedir, plantarse, doblar.
- Sesión persistida en BD (cartas y mazo en JSONB).
- Pago 3:2 al blackjack natural.

### Perfil e historial
- Datos del usuario y saldo actual.
- Botón de "depósito demo" para recargar saldo.
- Listado paginado de transacciones (apuestas y premios) con saldo posterior.

---

## Variables de entorno y configuración

`src/environments/environment.prod.ts` viene con `apiBaseUrl: ''`
(cadena vacía). Esto es **intencional**: en producción el JS del
navegador hace llamadas a **rutas relativas** (`/api/...`) que
aterrizan en el mismo Nginx que sirvió el HTML, y ese Nginx las
reenvía al backend mediante un **reverse proxy** (`location /api/`
→ `proxy_pass http://${BACKEND_HOST}:3000/api/`).

> **¿Por qué reverse proxy?** Porque el `Security Group` del backend
> solo permite tráfico desde el `Security Group` del frontend. Si el
> navegador del usuario llamara directo al backend, lo bloquearía.
> Con el reverse proxy el navegador solo habla con el frontend.

`environment.ts` (modo desarrollo local) sí apunta a
`http://localhost:3000` para que `ng serve` funcione contra un
backend Node corriendo aparte.

---

## Cómo correr en local (sin Docker)

Requisito: backend del casino corriendo en `http://localhost:3000`
(ver repo `casino-backend`).

```bash
npm install
npm start
# Frontend en http://localhost:4200
```

---

## Lo que ustedes deben construir (EP2)

1. **`Dockerfile` multi-stage** Angular → Nginx
   - Stage `builder`: `node:20-alpine`, `npm ci`, `npm run build`.
   - Stage `runtime`: `nginx:alpine`, copiar `dist/casino-frontend/browser`
     a `/usr/share/nginx/html`, configurar fallback SPA.
2. Configurar el `docker-compose.yml` global con los servicios
   `db`, `casino-backend` y `casino-frontend`, definiendo:
   - red bridge interna,
   - puerto 80 expuesto al host (o 8080),
   - dependencia `depends_on: backend` (o `condition: service_started`).
3. Workflow `.github/workflows/deploy.yml` (push a rama `deploy`):
   `build → push (Docker Hub o ECR) → deploy en EC2 vía SSH`.

Lean la pauta oficial (`EP2_Instrucciones y Pauta_Encargo_Estudiante.pdf`)
para los criterios completos.

---

## Repositorio del backend

[`casino-backend`](../casino-backend)
