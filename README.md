# El Telégrafo de Los Charrúas

Sitio del diario digital. Next.js (App Router) + Prisma sobre PostgreSQL (Neon), desplegado en Netlify.

## Puesta en marcha

```bash
npm install
npx prisma db push   # crea o actualiza las tablas en la base de datos
npm run dev          # http://localhost:3000
```

## Variables de entorno

Se definen en un archivo `.env` local y en el panel de Netlify (Site configuration → Environment variables).

| Variable | Obligatoria | Para qué sirve |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Conexión a PostgreSQL (Neon). |
| `ADMIN_PASSWORD` | Sí | Contraseña del panel `/admin`. Usá una larga y que no se repita en otro lado. |
| `SESSION_SECRET` | No | Texto aleatorio para firmar la sesión del panel. Si falta, la firma se deriva de `ADMIN_PASSWORD`. |

Cambiar `ADMIN_PASSWORD` (o `SESSION_SECRET`) cierra todas las sesiones abiertas del panel.

## Panel de administración

`/admin` permite gestionar:

- **Notas**: redactar, publicar y borrar.
- **Autores**: alta y baja.
- **Publicidad**: cargar anuncios (imagen con enlace o código HTML), elegir su ubicación, pausarlos, editarlos y borrarlos.
- **Mensajes**: lo que los lectores envían desde "Escribir a la redacción" y "Cartas de lectores". La tabla `Message` se crea sola la primera vez (ver `lib/mensajes.ts`).

### Ubicaciones de publicidad

| Ubicación | Dónde aparece | Medida recomendada |
| --- | --- | --- |
| Banner superior | Arriba del contenido en portada, secciones y notas | 970 × 250 o 728 × 90 px |
| Lateral de portada | Columna derecha de la portada | 300 × 250 o 300 × 600 px |
| Dentro de la nota | Al final del cuerpo de cada noticia | 728 × 90 px |

Si hay varios anuncios activos en una misma ubicación se muestran todos, uno debajo del otro. Las ubicaciones se definen en `lib/ads.ts` y se muestran con el componente `components/AdSlot.tsx`.

## Diseño

Colores y tipografías se definen en `app/globals.css` (bloque `@theme`) y `app/layout.tsx`. Las secciones del diario y su orden están en `lib/secciones.ts`. La cabecera lleva el nombre del diario en código Morse (`components/Morse.tsx`).

## Seguridad

- La sesión del panel es una cookie firmada (`lib/session.ts`); no se puede fabricar sin el secreto del servidor.
- Toda server action del panel empieza con `requireAdmin()` (`lib/auth.ts`). El middleware solo redirige páginas: no alcanza para proteger las acciones. **Cualquier acción nueva del panel tiene que llamar a `requireAdmin()`.**
- El HTML de las notas y de los anuncios se limpia con `lib/sanitize.ts` antes de guardarse y de mostrarse.
