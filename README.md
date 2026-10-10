# Aerobeat

M2 · Async Odyssey — Web Development I — @Mendo.

Buscador de mapas de osu! con estética Frutiger Aero: busca una canción,
filtra los sets por modo de juego y descarga su archivo `.osz`.
JavaScript puro, HTML y CSS. Vite es la única dependencia de desarrollo.

## Cómo ejecutarlo

Necesitas Node.js 22.12 o posterior y npm. Desde esta carpeta:

```bash
npm ci
npm run dev
```

Abre la dirección que indique Vite. No abras `index.html` con doble clic:
los módulos ES necesitan servirse por HTTP.

```bash
npm run build
npm run preview
```

El primer comando genera `dist/` con rutas relativas; el segundo sirve esa compilación.
Ni `node_modules/` ni `dist/` se suben a GitHub. Sí se sube `package-lock.json`.

## Cómo usarlo

1. Al entrar se busca «nevada» como ejemplo real.
2. Escribe una canción, artista o creador y pulsa Buscar mapas o Intro.
3. El selector filtra localmente los primeros 24 resultados recibidos, no todo el catálogo.
4. Descargar .osz abre la descarga del set completo. Abre el archivo con osu! para instalarlo.
5. Ver en osu! abre la ficha oficial. Este proyecto no solicita cuentas ni claves.

Un **set** agrupa varias dificultades. El filtro conserva los sets que contienen al menos
una dificultad del modo elegido; el contador suma todas las dificultades de esos sets.
El servicio puede devolver menos de 24 resultados. No hay paginación.

## Estructura y rúbrica

| Archivo | Responsabilidad | Contenido del temario |
| --- | --- | --- |
| `src/main.js` | Eventos, estado y coordinación | U1: variables, funciones, DOM y eventos. U2: módulos y try/catch/finally |
| `src/api.js` | Fetch, validación de respuesta, caché y URL de descarga | U2: async/await, fetch, Error, JSON, localStorage y URLSearchParams |
| `src/logica.js` | Preparar datos, filtrar y contar | U1: tipos, condicionales y objetos. U2: map, filter, some y reduce |
| `src/render.js` | Mostrar mensajes y crear tarjetas | U1: querySelector, createElement, appendChild, textContent y classList |
| `src/style.css` | Toda la presentación adaptable | HTML/CSS, conocimientos previos de U1 |

`map` convierte los objetos de la API en objetos pequeños con nombres en castellano.
`filter` descarta IDs inválidos y aplica el modo seleccionado.
`some` comprueba si un set contiene el modo pedido.
`reduce` suma las dificultades antes de pintarlas. `forEach` solo inserta las tarjetas en el DOM.
`Array.isArray` y `Number.isInteger` son comprobaciones nativas del tipo de los datos recibidos.

Durante una consulta se muestra la carga y se deshabilita el formulario para evitar
peticiones solapadas. `finally` siempre lo habilita de nuevo. El `catch` muestra el error
y permite reintentar con el mismo botón. Una lista vacía muestra un mensaje específico.
Los títulos, artistas y creadores entran mediante `textContent`: el `innerHTML` de las
tarjetas es una plantilla fija sin texto externo. Las portadas tienen un fondo de color
si no cargan; sus URLs se construyen únicamente con IDs numéricos válidos.

## API y caché

- Búsqueda: `https://mirror.hinamizawa.ai/api/v2/search?q=nevada&amount=24`.
- Descarga: `https://mirror.hinamizawa.ai/api/v1/hinai/d/476587`.
- Documentación: https://mirror.hinamizawa.ai/docs/beatmap-search y https://mirror.hinamizawa.ai/docs/beatmap-download.
- Portadas: `https://assets.ppy.sh/beatmaps/ID/covers/cover.jpg`.

La idea original proponía osu.direct. Durante la preparación devolvió un desafío de
Cloudflare con HTTP 403. Se eligió hinai, un mirror compatible, para conservar la idea
sin añadir un proxy, backend, SDK ni autenticación. Su búsqueda respondió con
`Access-Control-Allow-Origin: *` y la descarga de prueba no pidió login.

El bonus guarda cada búsqueda no vacía en `localStorage` usando una clave
`aerobeat-v1:consulta`. Repetirla evita otro fetch, incluso tras recargar.
El mensaje distingue API y caché. Si el JSON está corrupto o el almacenamiento no
está disponible, se consulta la red. Si está lleno, se muestran igualmente los datos.
La caché no caduca: para actualizar una búsqueda, elimina su clave desde
DevTools → Application → Local Storage. No se guardan resultados vacíos porque
el proveedor también puede responder `[]` cuando fallan sus fuentes.

## Uso de IA

Herramienta: ChatGPT / Codex. Sergio aportó el enunciado, los PDF del temario, los
repositorios de referencia, la idea de osu! y la dirección visual Frutiger Aero.
La IA redactó parte de el código y los estilos, también hizo las comprobaciones
técnicas indicadas abajo.

Extractos reales del encargo:

> «Busca repositorios que contengan elementos de CSS estilo "frutiger aero"»

> «Como podría acortar mas el código implementado en "logica.js"»

Antes de entregar, el alumno debe ejecutar el proyecto, revisar este texto y comprobar
que sabe explicar cada función. La implementación y los commits iniciales son de Codex;
el historial no pretende representar sesiones de trabajo manual del alumno.

## Autopsia

Estas son las dos decisiones principales de la implementación propuesta con IA;
el alumno debe valorarlas y hacerlas suyas antes de defender la entrega.

1. **Filtrar los 24 resultados en el cliente.** Permite usar `filter` con una finalidad
   visible y cambiar de modo sin más peticiones. Se descartó filtrar y paginar todo en
   el servidor para mantener poco estado y poco código. Coste: un modo puede quedar
   vacío aunque existan más mapas de ese modo fuera de la primera página; la interfaz
   indica el alcance del filtro.
2. **Caché sencilla sin caducidad y formulario bloqueado durante la búsqueda.** Se
   descartaron temporizadores de caducidad y cancelación de peticiones para mantener
   el flujo fácil de explicar. Coste: pueden verse metadatos antiguos y hay que esperar
   al servidor antes de cambiar de búsqueda. Los errores de almacenamiento no impiden
   usar la API; `finally` restaura el formulario cuando la petición termina o falla.

## Verificación

Comprobado por Codex durante la preparación:

- `npm run build`: compilación correcta con Vite 8.3.4.
- API real: respuesta JSON, cabecera CORS y descarga de un `.osz` sin credenciales.
- Pruebas temporales externas al proyecto, con DOM simulado: caché, almacenamiento
  bloqueado/lleno, errores 404/429/500, fallo de red, JSON inválido, respuesta no-array,
  vacíos, datos incompletos, filtros, suma, texto potencialmente malicioso, carga,
  bloqueo de consultas simultáneas y recuperación tras error.

Las pruebas de DOM usaron jsdom fuera de esta carpeta; no añade dependencias a la app.
No se ha realizado una inspección visual en un navegador en este entorno.
El buscador y las descargas dependen de la disponibilidad de servicios externos.
Una descarga se abre como enlace, por lo que sus fallos los muestra el servidor en
la nueva pestaña. Los fallos de búsqueda sí se muestran dentro de la aplicación.

Antes de entregar: probar en el navegador, revisar móvil y escritorio, descargar un
mapa, repetir una búsqueda y comprobar en Network que la caché evita la petición.
Para probar el error de red, activar Offline y buscar un término nuevo no cacheado.

## Referencias visuales

Inspiración: la galería de https://osu.ppy.sh/beatmapsets y el cristal, azul/verde y
brillos de https://github.com/maxik34/Project_7,
https://github.com/TheAgencyMGE/aero-dock y
https://github.com/GVPV12/aqua-frutiger-aero-blog.
El diseño, el disco y los brillos se dibujan en CSS; no se copian sus assets ni plantillas.
Las portadas pertenecen a los mapas y se sirven desde el CDN de osu!.
Proyecto académico no oficial, sin afiliación con osu! ni hinai.

## Entrega en GitHub

El ZIP conserva `.git` con cinco commits de fases reales y sin remotos configurados.
Extrae la carpeta completa y comprueba `git log --oneline`.
Crea un repositorio público vacío en GitHub, sin añadir un README desde GitHub.
Desde esta carpeta, añade la URL real del repositorio que acabas de crear:

```bash
git remote add origin URL_REAL_DE_TU_REPOSITORIO
git push -u origin main
```

También puedes añadir esta carpeta como repositorio local en GitHub Desktop y publicarla
desmarcando «Keep this code private». No uses la subida de archivos del navegador:
no conserva este historial. Comprueba la URL en incógnito y entrégala en la Arena
seleccionando **M2**, con tu alias **@Mendo**. Esta preparación no publica ni entrega por ti.
