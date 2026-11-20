# Pautas de las notas automáticas

Todas las mañanas una tarea programada busca noticias, redacta notas propias y las agrega a
`contenido/sugerencias.json`. El sitio las publica solas en cuanto se actualiza (ver
`lib/sugerencias.ts`), firmadas por "Redacción El Telégrafo" y con la fuente al pie. Como
nadie las revisa antes de salir, estas pautas son estrictas: ante la duda, una nota menos.

## Qué se busca cada día

Ocho notas, de hechos publicados en las últimas 36 horas:

| Sección (`seccion`) | Cantidad | Qué cubre |
| --- | --- | --- |
| `LOCAL` | 2 | Los Charrúas y su zona: La Criolla, Colonia Yuquerí, Estación Yuquerí, Los Charrúas rural. Si no hay dos hechos de la localidad, la segunda puede ser de la zona rural del departamento Concordia. |
| `REGIONAL` | 1 | Entre Ríos: Concordia, Paraná y el resto de la provincia. |
| `PAIS` | 1 | Argentina. |
| `MUNDO` | 1 | Internacional. |
| `POLITICA` | 1 | Política provincial o nacional. |
| `ECONOMIA` | 1 | Economía, precios, empleo, producción. Mejor si tiene impacto en Entre Ríos. |
| `SOCIEDAD` | 1 | Educación, salud, cultura, comunidad, servicios, clima. |

Si para una sección no hay una noticia confirmada y de interés, **no se escribe**. Nunca se
rellena.

## Dónde buscar

**Local** (en este orden):

1. La Región Digital: https://regiondigital.com.ar/category/los-charruas/ y https://regiondigital.com.ar/category/la-criolla/
2. Diario News Media: https://diarionewsmedia.com/category/local/
3. Diario La Gacela: https://www.diariolagacela.com.ar/
4. Municipalidad de Los Charrúas: https://www.loscharruas.gob.ar/
5. Medios de Concordia y de la provincia que publiquen sobre la zona: El Heraldo, Diario Junio, Elonce, Análisis Digital.

**Resto de las secciones:** medios entrerrianos (Elonce, Análisis Digital, El Entre Ríos, Uno
Entre Ríos, El Diario), nacionales (La Nación, Clarín, Infobae, Página/12, Perfil, Ámbito, El
Cronista), agencias (Noticias Argentinas, AFP, EFE, Reuters, AP) y fuentes oficiales (INDEC,
BCRA, Boletín Oficial, gobiernos nacional y provincial, Poder Judicial).

Para Política y Economía, si es posible, confirmar el dato con una segunda fuente o con la fuente
oficial. Una cifra que aparece en un solo medio se atribuye a ese medio.

## Cómo se escribe

- **Texto propio.** Se lee la nota original y se escribe de nuevo, con otras palabras y otro
  orden. Nunca se copian oraciones ni se sigue la estructura del original. Se permite como mucho
  una cita textual corta (menos de 15 palabras) de algo que dijo una persona en público, entre
  comillas y con su nombre.
- **Atribución.** En el texto se dice de dónde sale cada dato ("según informó La Región Digital",
  "de acuerdo con el INDEC"). Las fuentes van además en `fuentes`; el sitio las agrega al pie.
- **Solo hechos.** Sin opinión, sin adjetivos de valor, sin especular sobre lo que va a pasar.
  Nada que no esté en las fuentes: ni datos, ni cifras, ni citas, ni contexto inventado.
- **Neutralidad política.** Cuando hay un conflicto, se cuenta la posición de cada parte que
  aparece en las fuentes. No se promociona a ningún partido, dirigente ni espacio.
- **Policiales y tribunales.** No se nombra a personas particulares acusadas, detenidas, víctimas
  ni testigos; nunca a menores. Se usa "presunto" hasta que haya condena. Sin detalles morbosos.
- **No se cubren** suicidios, rumores, denuncias sin respaldo de una fuente identificable,
  contenido patrocinado ni notas de opinión ajenas.
- **Estilo.** Castellano rioplatense en tercera persona. Título informativo, en minúscula salvo la
  primera palabra y los nombres propios, sin signos de exclamación, de 40 a 110 caracteres. Bajada
  de una o dos oraciones que agregue información al título. Cuerpo de 250 a 450 palabras en 4 a 7
  párrafos; se puede usar un subtítulo `<h2>`.
- **Sin fotos.** No se copian imágenes de otros medios. Las notas salen sin foto (el sitio muestra
  una placa con el nombre de la sección).
- **Sin repetir.** Antes de escribir, revisar los títulos de los últimos días en el archivo: no
  se publica dos veces el mismo hecho, salvo que haya una novedad real.

## Formato del archivo

`contenido/sugerencias.json`:

```json
{
  "notas": [
    {
      "id": "2026-11-20-local-1",
      "fecha": "2026-11-20",
      "seccion": "LOCAL",
      "titulo": "…",
      "bajada": "…",
      "cuerpo": "<p>…</p><p>…</p><h2>…</h2><p>…</p>",
      "fuentes": [{ "medio": "La Región Digital", "url": "https://regiondigital.com.ar/…" }]
    }
  ]
}
```

- `id`: `AAAA-MM-DD-seccion-n`, en minúsculas y sin tildes (`2026-11-20-politica-1`). Es también
  la dirección de la nota en el sitio (`/nota/2026-11-20-politica-1`), así que no se cambia nunca.
- `fecha`: el día de la tanda, en hora argentina.
- `cuerpo`: solo `<p>`, `<strong>`, `<em>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<li>`,
  `<blockquote>`, `<br>` y `<a href="https://…">`, sin otros atributos. Al menos 3 párrafos.
- `fuentes`: de 1 a 5, con el nombre del medio y el enlace a la nota original.
- Las notas nuevas se agregan al principio. Se borran las de más de 10 días.
- El sitio solo publica notas de los últimos 3 días.

Antes de subir, correr `npm run validar-sugerencias` (o `node scripts/validar-sugerencias.mjs`,
que no necesita instalar nada). Si da error, se corrige; nunca se sube un archivo con errores.
