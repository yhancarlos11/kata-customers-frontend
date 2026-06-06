# Kata Customers Frontend (Angular)

Frontend para el reto de ciclo de vida de ambientes (DEV y PROD simulado).

## Arquitectura

- Arquitectura por componentes y rutas:
	- `app/`: shell principal (header + navegacion + router outlet).
	- `app/pages/auth-page`: acceso (login/registro).
	- `app/pages/customer-create-page`: creacion de clientes.
	- `app/pages/customer-list-page`: listado, edicion y eliminacion.
	- `app/services`: servicios HTTP (auth y customer).
- Seguridad frontend:
	- Token JWT en `localStorage` (`kata.jwt`).
	- Interceptor para firmar requests protegidos (`/api/customers`).
- UX:
	- Estilos responsive.
	- Modal de confirmacion para eliminar clientes.

## Frameworks y librerias

- Angular 20 (standalone components)
- TypeScript 5
- RxJS
- Karma + Jasmine (unit testing)

## Requisitos

- Node.js 20+
- Backend Spring Boot disponible en:
	- DEV: http://localhost:8080
	- PROD simulado: http://localhost:9090

## Instalacion

```bash
npm install
```

## Comandos importantes

## Ejecutar frontend en modo DEV

```bash
npm run start:dev
```

- Frontend: http://localhost:4200
- Proxy API: /api -> http://localhost:8080
- Nombre app frontend: customers-frontend-dev

## Ejecutar frontend en modo PROD (simulado)

```bash
npm run start:prod
```

- Frontend: http://localhost:4201
- Proxy API: /api -> http://localhost:9090
- Nombre app frontend: customers-frontend-prod

## Ejecutar pruebas unitarias

```bash
npm test -- --watch=false
```

## Build DEV

```bash
npm run build:dev
```

## Build PROD

```bash
npm run build:prod
```

Salida:

- `dist/kata-customers-frontend`

## Flujo de prueba sugerido para la demo

1. Levantar backend en DEV y luego frontend con `npm run start:dev`.
2. Registrar usuario, iniciar sesion, crear cliente y listar clientes.
3. Levantar backend en PROD simulado y luego frontend con `npm run start:prod`.
4. Mostrar cambios en perfil, puerto y mensaje de ambiente desde la UI.
