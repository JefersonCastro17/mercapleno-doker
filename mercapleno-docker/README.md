# Mercapleno Docker

Este entorno levanta solo backend y frontend en Docker.

La base de datos vive en XAMPP, fuera de Docker, y el dump compartido del proyecto es [mercapleno_real.sql](./mercapleno_real.sql).

## Configuracion esperada

- XAMPP con MySQL encendido
- Base de datos `mercapleno` en XAMPP
- Credenciales por defecto de este repo:
  - host Docker: `host.docker.internal`
  - host local: `localhost`
  - puerto: `3306`
  - usuario: `root`
  - password: vacio

Si tu XAMPP usa otra clave o puerto, cambia:

- `../mercapleno-backend/.env.docker`
- `../mercapleno-backend/.env`

## BD real compartida

El archivo [mercapleno_real.sql](./mercapleno_real.sql) ya quedo ajustado para el backend actual.

Incluye la estructura real y los datos reales que compartiste, mas las columnas de segundo factor que el login necesita hoy:

- `login_two_factor_code`
- `login_two_factor_expires`

## Como cargar la BD en esta PC o en otra

1. Abre XAMPP y enciende MySQL.
2. Abre `http://localhost/phpmyadmin`.
3. Crea la base de datos `mercapleno` si no existe.
4. Importa [mercapleno_real.sql](./mercapleno_real.sql) dentro de la base `mercapleno`.
5. Desde esta carpeta ejecuta:

```powershell
docker compose down --remove-orphans
docker compose up --build -d
```

## Alternativa por linea de comandos

Si prefieres importar por consola con XAMPP:

```powershell
C:\xampp\mysql\bin\mysql.exe -uroot mercapleno < .\mercapleno_real.sql
```

Si `root` tiene clave:

```powershell
C:\xampp\mysql\bin\mysql.exe -uroot -p mercapleno < .\mercapleno_real.sql
```

## Que levanta Docker

- Backend en `http://localhost:4000`
- Frontend en `http://localhost:5173`

## Flujo recomendado para otras PCs

1. Instalar XAMPP
2. Encender MySQL
3. Importar [mercapleno_real.sql](./mercapleno_real.sql) en la base `mercapleno`
4. Ajustar `.env` y `.env.docker` si cambian puerto o clave
5. Ejecutar `docker compose up --build -d`
