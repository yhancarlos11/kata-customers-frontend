# Kata Customers Frontend (Angular)

Frontend para el reto de ciclo de vida de ambientes (DEV y PROD simulado).

Permite:

- Ver informacion de ambiente del backend
- Registrar usuario y hacer login (JWT)
- Crear cliente
- Listar clientes

## Requisitos

- Node.js 20+
- Backend Spring Boot disponible en:
	- DEV: http://localhost:8080
	- PROD simulado: http://localhost:9090

## Instalacion

```bash
npm install
```

## Ejecutar frontend en modo DEV

```bash
npm run start:dev
```

- Frontend: http://localhost:4200
- Proxy API: /api -> http://localhost:8080
- Nombre app frontend: customers-frontend-dev
- Log frontend: Frontend ejecutando en DEV

## Ejecutar frontend en modo PROD (simulado)

```bash
npm run start:prod
```

- Frontend: http://localhost:4201
- Proxy API: /api -> http://localhost:9090
- Nombre app frontend: customers-frontend-prod
- Log frontend: Frontend ejecutando en PROD

## Build

```bash
npm run build:prod
```

Salida: dist/

## Flujo de prueba sugerido para la demo

1. Levantar backend en DEV y luego frontend con `npm run start:dev`.
2. Registrar usuario, iniciar sesion, crear cliente y listar clientes.
3. Levantar backend en PROD simulado y luego frontend con `npm run start:prod`.
4. Mostrar cambios en perfil, puerto y mensaje de ambiente desde la UI.
