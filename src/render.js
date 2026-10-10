import { enlaceDescarga } from "./api.js";

const resultados = document.querySelector("#resultados");
const resumen = document.querySelector("#resumen");
const estado = document.querySelector("#estado");

export function mostrarEstado(mensaje, error = false) {
  estado.textContent = mensaje;
  estado.classList.toggle("error", error);
}

export function pintarMapas(mapas, totalDificultades) {
  resultados.textContent = "";
  resumen.textContent = `${mapas.length} sets · ${totalDificultades} dificultades`;
  mapas.forEach(mapa => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");
    // Solo HTML fijo. Los textos de la API se insertan debajo con textContent.
    tarjeta.innerHTML = `
      <div class="portada" aria-hidden="true"></div>
      <div class="ficha">
        <p class="artista"></p><h3></h3><p class="creador"></p>
        <p class="dificultades"></p>
        <div class="acciones">
          <a class="descarga" target="_blank" rel="noopener noreferrer">Descargar .osz</a>
          <a class="original" target="_blank" rel="noopener noreferrer">Ver en osu! ↗</a>
        </div>
      </div>`;
    tarjeta.querySelector(".portada").style.backgroundImage =
      `url(https://assets.ppy.sh/beatmaps/${mapa.id}/covers/cover.jpg)`;
    tarjeta.querySelector("h3").textContent = mapa.titulo;
    tarjeta.querySelector(".artista").textContent = mapa.artista;
    tarjeta.querySelector(".creador").textContent = `Creado por ${mapa.creador}`;
    tarjeta.querySelector(".dificultades").textContent = `${mapa.dificultades.length} dificultades en el set`;
    tarjeta.querySelector(".original").href = `https://osu.ppy.sh/beatmapsets/${mapa.id}`;
    const descarga = tarjeta.querySelector(".descarga");
    if (mapa.descargable) {
      descarga.href = enlaceDescarga(mapa.id);
    } else {
      descarga.textContent = "Descarga no disponible";
      descarga.classList.add("no-disponible");
    }
    resultados.appendChild(tarjeta);
  });
}
