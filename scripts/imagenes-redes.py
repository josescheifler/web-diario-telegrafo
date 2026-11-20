"""Arma las imágenes para Instagram y Facebook de las notas automáticas de un día.

Uso: python scripts/imagenes-redes.py [AAAA-MM-DD] [--sin-foto RUTA]

Lee contenido/sugerencias.json y deja public/redes/<id>.jpg (1080 × 1350, JPG): la foto
ilustrativa de fondo, un degradé oscuro abajo y el título, la sección, el crédito de la foto,
el filete en Morse y el nombre del diario. Lo corre la acción "Imágenes para redes" de GitHub,
porque necesita bajar las fotos de los bancos (Pexels, Unsplash, Wikimedia).
Las imágenes quedan públicas en raw.githubusercontent.com y en el sitio (/redes/<id>.jpg).
"""

import io
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = RAIZ / "assets" / "fuentes"
SALIDA = RAIZ / "public" / "redes"

ANCHO, ALTO = 1080, 1350
MARGEN = 80
TINTA = (8, 20, 36)
ORO = (211, 173, 62)
BLANCO = (255, 255, 255)

SECCIONES = {
    "LOCAL": "Local", "REGIONAL": "Entre Ríos", "PAIS": "País", "MUNDO": "Mundo",
    "POLITICA": "Política", "ECONOMIA": "Economía", "SOCIEDAD": "Sociedad",
}
CODIGO = {
    "A": ".-", "E": ".", "F": "..-.", "G": "--.", "L": ".-..", "O": "---", "R": ".-.", "T": "-",
}


def fuente(nombre: str, tam: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FUENTES / nombre), tam)


def version_liviana(url: str) -> str:
    """Pide la foto en 1080 px de ancho: el original pesa varios MB."""
    u = urllib.parse.urlsplit(url)
    if u.hostname == "images.pexels.com":
        return urllib.parse.urlunsplit((u.scheme, u.netloc, u.path, "auto=compress&cs=tinysrgb&w=1080&fm=jpg", ""))
    if u.hostname == "images.unsplash.com":
        q = dict(urllib.parse.parse_qsl(u.query))
        q.update({"w": "1080", "q": "80", "fm": "jpg"})
        return urllib.parse.urlunsplit((u.scheme, u.netloc, u.path, urllib.parse.urlencode(q), ""))
    if u.hostname == "upload.wikimedia.org" and "/thumb/" not in u.path:
        partes = u.path.split("/")
        archivo = partes[-1]
        if len(partes) >= 6:
            ruta = "/".join(partes[:3] + ["thumb"] + partes[3:-1] + [archivo, f"1080px-{archivo}"])
            return urllib.parse.urlunsplit((u.scheme, u.netloc, ruta, "", ""))
    return url


def bajar_foto(url: str) -> Image.Image | None:
    for candidata in (version_liviana(url), url):
        try:
            pedido = urllib.request.Request(candidata, headers={"User-Agent": "ElTelegrafo/1.0 (imagenes para redes)"})
            with urllib.request.urlopen(pedido, timeout=30) as r:
                return Image.open(io.BytesIO(r.read())).convert("RGB")
        except Exception as error:  # noqa: BLE001 - si falla, se prueba la otra versión o se sigue sin foto
            print(f"  no se pudo bajar {candidata}: {error}")
    return None


def cubrir(foto: Image.Image) -> Image.Image:
    """Recorta y escala la foto para que cubra todo el fondo (como object-fit: cover)."""
    escala = max(ANCHO / foto.width, ALTO / foto.height)
    foto = foto.resize((round(foto.width * escala), round(foto.height * escala)), Image.LANCZOS)
    x = (foto.width - ANCHO) // 2
    y = (foto.height - ALTO) // 2
    return foto.crop((x, y, x + ANCHO, y + ALTO))


def degrade() -> Image.Image:
    """Capa oscura: suave arriba, casi opaca abajo, para que se lea el texto."""
    puntos = [(0.0, 0.35), (0.22, 0.10), (0.48, 0.55), (0.70, 0.93), (1.0, 1.0)]
    capa = Image.new("RGBA", (ANCHO, ALTO))
    d = ImageDraw.Draw(capa)
    for y in range(ALTO):
        t = y / (ALTO - 1)
        for (t0, a0), (t1, a1) in zip(puntos, puntos[1:]):
            if t0 <= t <= t1:
                a = a0 + (a1 - a0) * (t - t0) / (t1 - t0)
                break
        d.line([(0, y), (ANCHO, y)], fill=(*TINTA, round(a * 255)))
    return capa


def partir(texto: str, letra: ImageFont.FreeTypeFont, ancho: int) -> list[str]:
    lineas, actual = [], ""
    for palabra in texto.split():
        prueba = f"{actual} {palabra}".strip()
        if letra.getlength(prueba) <= ancho or not actual:
            actual = prueba
        else:
            lineas.append(actual)
            actual = palabra
    if actual:
        lineas.append(actual)
    return lineas


def recortar(texto: str, maximo: int) -> str:
    if len(texto) <= maximo:
        return texto
    return texto[:maximo].rsplit(" ", 1)[0] + "…"


def filete_morse(d: ImageDraw.ImageDraw, x0: int, y0: int, ancho: int) -> int:
    """'EL TELEGRAFO' en Morse, en puntos y rayas dorados. Devuelve el alto."""
    signos = []
    for p, palabra in enumerate("EL TELEGRAFO".split()):
        for l, letra in enumerate(palabra):
            for s, signo in enumerate(CODIGO[letra]):
                antes = 1 if s > 0 else 3 if l > 0 else 7 if p > 0 else 0
                signos.append((3 if signo == "-" else 1, antes))
    unidades = sum(largo + antes for largo, antes in signos)
    punto = ancho // unidades
    x = x0
    for largo, antes in signos:
        x += antes * punto
        d.rounded_rectangle([x, y0, x + largo * punto, y0 + punto], radius=punto / 2, fill=ORO)
        x += largo * punto
    return punto


def armar(nota: dict, foto: Image.Image | None) -> Image.Image:
    lienzo = Image.new("RGBA", (ANCHO, ALTO), (*TINTA, 255))
    if foto:
        lienzo.paste(cubrir(foto), (0, 0))
        lienzo.alpha_composite(degrade())
    d = ImageDraw.Draw(lienzo)

    bodoni = lambda t: fuente("bodoni-moda-latin-500-normal.woff", t)  # noqa: E731
    ancho_texto = ANCHO - 2 * MARGEN
    titulo = recortar(nota["titulo"], 150)
    largo = len(titulo)

    # De abajo hacia arriba: nombre del diario, filete, crédito, título y sección
    y = ALTO - 64
    nombre, sub = bodoni(52), fuente("bodoni-moda-latin-500-italic.woff", 34)
    d.text((MARGEN, y), "El Telégrafo", font=nombre, fill=BLANCO, anchor="ls")
    d.text((ANCHO - MARGEN, y), "de Los Charrúas", font=sub, fill=ORO, anchor="rs")
    y -= 52 + 30
    punto = 8
    filete_morse(d, MARGEN, y - punto, ancho_texto)
    y -= punto

    credito = (nota.get("foto") or {}).get("credito") if foto else None
    if credito:
        y -= 22
        d.text((MARGEN, y), f"Foto ilustrativa: {recortar(credito, 80)}", font=fuente("archivo-latin-500-normal.woff", 20),
               fill=(255, 255, 255, 153), anchor="ls")
        y -= 20

    if foto:
        tam = 84 if largo <= 60 else 70 if largo <= 100 else 58
        letra = bodoni(tam)
        lineas = partir(titulo, letra, ancho_texto)
        alto_linea = round(tam * 1.04)
        y -= 48
        for i, linea in enumerate(reversed(lineas)):
            d.text((MARGEN, y - i * alto_linea), linea, font=letra, fill=BLANCO, anchor="ls")
        y -= (len(lineas) - 1) * alto_linea + tam + 22
        d.text((MARGEN, y), SECCIONES.get(nota["seccion"], nota["seccion"]), font=fuente("archivo-latin-600-normal.woff", 32),
               fill=ORO, anchor="ls")
    else:
        # Sin foto: título y bajada centrados en el espacio libre sobre el pie
        tam = 96 if largo <= 60 else 80 if largo <= 100 else 66
        letra, chica = bodoni(tam), fuente("archivo-latin-500-normal.woff", 34)
        lineas = partir(titulo, letra, ancho_texto)
        bajada = partir(recortar(nota["bajada"], 200), chica, ancho_texto)
        alto_t, alto_b = round(tam * 1.04), round(34 * 1.4)
        total = 32 + 22 + len(lineas) * alto_t + 40 + len(bajada) * alto_b
        cy = (y - 40 - total) // 2
        d.text((MARGEN, cy + 32), SECCIONES.get(nota["seccion"], nota["seccion"]), font=fuente("archivo-latin-600-normal.woff", 32),
               fill=ORO, anchor="ls")
        cy += 32 + 22
        for linea in lineas:
            cy += alto_t
            d.text((MARGEN, cy), linea, font=letra, fill=BLANCO, anchor="ls")
        cy += 40
        for linea in bajada:
            cy += alto_b
            d.text((MARGEN, cy), linea, font=chica, fill=(255, 255, 255, 184), anchor="ls")

    return lienzo.convert("RGB")


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    hoy = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    fecha = args[0] if args else hoy
    sin_foto = "--sin-foto" in sys.argv  # para probar el diseño sin bajar fotos
    datos = json.loads((RAIZ / "contenido" / "sugerencias.json").read_text(encoding="utf-8"))
    notas = [n for n in datos["notas"] if n["fecha"] == fecha]
    SALIDA.mkdir(parents=True, exist_ok=True)
    for nota in notas:
        print(nota["id"])
        foto = None
        if nota.get("foto") and not sin_foto:
            foto = bajar_foto(nota["foto"]["url"])
        elif sin_foto and len(sys.argv) > 2 and Path(sys.argv[-1]).is_file():
            foto = Image.open(sys.argv[-1]).convert("RGB")
        armar(nota, foto).save(SALIDA / f"{nota['id']}.jpg", "JPEG", quality=90, optimize=True, progressive=False)
    print(f"Listo: {len(notas)} imágenes en public/redes/")


if __name__ == "__main__":
    main()
