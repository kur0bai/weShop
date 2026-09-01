# VulnStore Backend

Backend mock en Express que sirve los endpoints consumidos por la app
VulnStore (`vulnstore-expo/src/services/api.ts`). Uso educativo — no
implementa procesamiento de pago real ni persistencia en base de datos
(todo en memoria).

## Endpoints

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/health` | — | `{ status: "ok" }` |
| GET | `/products` | — | `Product[]` |
| POST | `/auth/login` | `{ email, password }` (password = MD5 del cliente) | `{ token }` |
| POST | `/checkout` | `{ cart, card }` | `{ orderId }` |

Todos los endpoints de negocio (`/auth`, `/products`, `/checkout`) requieren
el header `X-Api-Key`, con el mismo valor que está hardcodeado en el
cliente — es intencional para que el flujo end-to-end reproduzca la
vulnerabilidad del cliente (ver `docs/VULNERABILITIES.md` en el proyecto
de la app).

### Usuarios de prueba

| Email | Password (texto plano, el cliente la manda ya en MD5) | Rol |
|---|---|---|
| cliente@vulnstore.test | cliente123 | customer |
| admin@vulnstore.test | admin123 | admin |

## Correr local (sin Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

## Correr con Docker

```bash
docker compose up --build
```

O manualmente:

```bash
docker build -t vulnstore-backend .
docker run -p 3000:3000 \
  -e JWT_SECRET=vulnstore-dev-secret-change-me \
  -e API_KEY=vs_live_9f8a7d6c5b4e3f2a1d0c \
  vulnstore-backend
```

## Conectar la app

En `vulnstore-expo/src/services/api.ts`, `BASE_URL` apunta a
`https://api.vulnstore.example.com` (placeholder). Para desarrollo local:

- Emulador Android: usa `http://10.0.2.2:3000`
- Simulador iOS: usa `http://localhost:3000`
- Dispositivo físico: usa la IP de tu máquina en la red local, ej.
  `http://192.168.x.x:3000`
