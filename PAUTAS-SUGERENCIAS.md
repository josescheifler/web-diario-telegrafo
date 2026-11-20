# Pautas de las notas automáticas

Todas las mañanas una tarea programada busca noticias, redacta notas propias y las agrega a
`contenido/sugerencias.json`. El sitio las publica solas en cuanto se actualiza (ver
`lib/sugerencias.ts`), firmadas por "Redacción El Telégrafo" y con la fuente al pie. Como
nadie las revisa antes de salir, estas pautas son estrictas: ante la duda, una nota menos.

## Qué se busca cada día

Ocho notas, de hechos publicados en las últimas 36 horas, elegidas con la línea editorial del
diario (ver más abajo):

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

**País, Política, Economía y Mundo:** primero Página/12, Clarín y La Nación; después Infobae,
Perfil, Ámbito, El Cronista, agencias (Noticias Argentinas, AFP, EFE, Reuters, AP) y fuentes
oficiales (INDEC, BCRA, Boletín Oficial, gobiernos nacional y provincial, Poder Judicial).

**Entre Ríos y Sociedad:** Elonce, Análisis Digital, El Entre Ríos, Uno Entre Ríos, El Diario,
además de los nacionales cuando el tema es de alcance general.

**La Región Digital no se cita nunca**: ni en el texto ni al pie. Se usa como fuente de
información, se reescribe por completo y en `fuentes` va con `"citar": false`. Las demás
fuentes sí se citan.

Para Política y Economía, si es posible, confirmar el dato con una segunda fuente o con la fuente
oficial. Una cifra que aparece en un solo medio se atribuye a ese medio.

## Línea editorial

El Telégrafo tiene una mirada nacional y popular, peronista. Esa vara decide **qué se publica**
y **qué se destaca**:

- Se priorizan los temas que hacen a la vida de los trabajadores y las familias: salarios,
  empleo, jubilados, precios y bolsillo, producción, industria nacional y economías regionales,
  educación y salud públicas, obra pública, derechos sociales, soberanía y federalismo
  (los reclamos de Entre Ríos y de los municipios frente a la Nación).
- Ante varios hechos posibles para una sección, se elige el que más le importa a esa mirada y al
  lector de Los Charrúas. Se puede dejar de lado una noticia que no aporta nada desde ahí.
- En cada nota se destaca el impacto concreto sobre la gente y se incluyen las voces de
  gremios, organizaciones, intendentes y dirigentes del campo nacional y popular cuando aparecen
  en las fuentes.

La línea editorial nunca cambia los hechos:

- Lo que pasó se cuenta como pasó, con las cifras de la fuente. No se inventa, no se exagera y
  no se saca un dato de contexto para que diga otra cosa.
- Las críticas y las opiniones se atribuyen a quien las dijo ("según la CGT", "para el
  intendente"); la redacción no opina con su propia voz.
- No se insulta ni se acusa de delitos a nadie que no tenga una causa judicial. Si la fuente
  trae la respuesta del gobierno o de la parte cuestionada, se menciona.

## Cómo se escribe

- **Texto propio.** Se lee la nota original y se escribe de nuevo, con otras palabras y otro
  orden. Nunca se copian oraciones ni se sigue la estructura del original. Se permite como mucho
  una cita textual corta (menos de 15 palabras) de algo que dijo una persona en público, entre
  comillas y con su nombre.
- **Atribución.** En el texto se dice de dónde sale cada dato ("según informó Página/12",
  "de acuerdo con el INDEC"), salvo La Región Digital, que no se nombra. Las fuentes van además en
  `fuentes`; el sitio agrega al pie las que se citan.
- **Solo hechos.** Sin opinión, sin adjetivos de valor, sin especular sobre lo que va a pasar.
  Nada que no esté en las fuentes: ni datos, ni cifras, ni citas, ni contexto inventado.
- **Policiales y tribunales.** No se nombra a personas particulares acusadas, detenidas, víctimas
  ni testigos; nunca a menores. Se usa "presunto" hasta que haya condena. Sin detalles morbosos.
- **No se cubren** suicidios, rumores, denuncias sin respaldo de una fuente identificable,
  contenido patrocinado ni notas de opinión ajenas.
- **Estilo.** Castellano rioplatense en tercera persona. Título informativo, en minúscula salvo la
  primera palabra y los nombres propios, sin signos de exclamación, de 40 a 110 caracteres. Bajada
  de una o dos oraciones que agregue información al título. Cuerpo de 250 a 450 palabras en 4 a 7
  párrafos; se puede usar un subtítulo `<h2>`.
- **Fotos.** Nunca se usan fotos de otros medios ni de agencias, aunque se cite la fuente: tienen
  dueño. Cada nota lleva, si se consigue, una **foto ilustrativa** de un banco de imágenes de uso
  libre, relacionada con el tema (un campo, una escuela, billetes, una fábrica, una ruta):
  1. Buscar con WebSearch limitado a `pexels.com` y `unsplash.com` (o Wikimedia Commons para
     lugares concretos, como una ciudad o un edificio), con palabras en inglés si hace falta.
  2. Abrir la página de la foto con WebFetch y confirmar que es gratuita (en Unsplash, que **no**
     sea "Unsplash+") y el nombre del autor. En Wikimedia, que la licencia sea libre.
  3. Usar el enlace directo a la imagen (`https://images.pexels.com/...`,
     `https://images.unsplash.com/...` o `https://upload.wikimedia.org/...`), en JPG.
  4. Crédito: `Nombre del autor / Pexels`, `Nombre del autor / Unsplash` o, en Wikimedia,
     autor, "Wikimedia Commons" y licencia. El sitio lo muestra como "Foto ilustrativa".
  - **Nunca figuras públicas ni personas reconocibles** que puedan confundirse con las de la
    noticia: personas solo si no se les ve la cara o no son el centro (manos, de espaldas, una
    multitud a lo lejos).
  - La foto no puede contradecir la nota (nada de nieve en una nota de sequía).
  - Si no hay una buena, la nota sale sin foto y el sitio muestra la placa de la sección.
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
      "fuentes": [{ "medio": "La Región Digital", "url": "https://regiondigital.com.ar/…", "citar": false }],
      "foto": { "url": "https://images.pexels.com/…", "credito": "Nombre del autor / Pexels" }
    }
  ]
}
```

- `id`: `AAAA-MM-DD-seccion-n`, en minúsculas y sin tildes (`2026-11-20-politica-1`). Es también
  la dirección de la nota en el sitio (`/nota/2026-11-20-politica-1`), así que no se cambia nunca.
- `fecha`: el día de la tanda, en hora argentina.
- `cuerpo`: solo `<p>`, `<strong>`, `<em>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<li>`,
  `<blockquote>`, `<br>` y `<a href="https://…">`, sin otros atributos. Al menos 3 párrafos.
- `fuentes`: de 1 a 5, con el nombre del medio y el enlace a la nota original. `"citar": false`
  para La Región Digital (no aparece en el sitio); el resto se cita.
- `foto` (opcional): solo de `images.pexels.com`, `images.unsplash.com` o
  `upload.wikimedia.org`, con el crédito. El sitio lo muestra al pie de la nota y en la imagen
  para Instagram como "Foto ilustrativa".
- Las notas nuevas se agregan al principio. Se borran las de más de 10 días.
- El sitio solo publica notas de los últimos 3 días.

Antes de subir, correr `npm run validar-sugerencias` (o `node scripts/validar-sugerencias.mjs`,
que no necesita instalar nada). Si da error, se corrige; nunca se sube un archivo con errores.
