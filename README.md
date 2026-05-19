# HRPlatform Backend

API REST construida con NestJS + PostgreSQL para HRPlatform (Zavix Brands & Almacenes DC).

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Login con email y password |
| GET | /api/auth/me | Usuario actual (requiere token) |
| GET | /api/employees | Lista de colaboradores |
| POST | /api/employees | Crear colaborador |
| POST | /api/employees/bulk | Carga masiva |
| PUT | /api/employees/:id | Actualizar colaborador |
| GET | /api/vacations | Solicitudes de ausencias |
| POST | /api/vacations | Nueva solicitud |
| PUT | /api/vacations/:id/approve | Aprobar solicitud |
| PUT | /api/vacations/:id/reject | Rechazar solicitud |
| GET | /api/announcements | Lista de comunicados |
| POST | /api/announcements | Crear comunicado |
| GET | /api/onboarding | Colaboradores en onboarding |
| PUT | /api/onboarding/:id/task | Marcar tarea del checklist |
| GET | /api/evaluations | Lista de evaluaciones |
| POST | /api/evaluations | Crear evaluación |

## Deploy en Railway

1. Crear cuenta en railway.app con GitHub
2. New Project → Deploy from GitHub repo
3. Seleccionar este repositorio
4. Agregar servicio PostgreSQL
5. Agregar variables de entorno:
   - DATABASE_URL (Railway la genera automáticamente)
   - JWT_SECRET=hrplatform_super_secret_2025
6. Deploy automático

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores.
