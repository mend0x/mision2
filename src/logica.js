function texto(valor, alternativa) {
  return typeof valor === "string" && valor.trim() ? valor : alternativa;
}

export function prepararMapas(datos) {
  // Descartamos IDs inválidos antes de construir enlaces e imágenes.
  return datos
    .filter(mapa => Number.isInteger(mapa?.id) && mapa.id > 0)
    .map(mapa => ({
      id: mapa.id,
      titulo: texto(mapa.title, "Sin título"),
      artista: texto(mapa.artist, "Artista desconocido"),
      creador: texto(mapa.creator, "Creador desconocido"),
      dificultades: Array.isArray(mapa.beatmaps)
        ? mapa.beatmaps.filter(dificultad => typeof dificultad?.mode === "string") : [],
      descargable: mapa.availability?.download_disabled !== true
    }));
}

export function filtrarMapas(mapas, modo) {
  return mapas.filter(mapa => modo === "todos" ||
    mapa.dificultades.some(dificultad => dificultad.mode === modo));
}

export function contarDificultades(mapas) {
  return mapas.reduce((total, mapa) => total + mapa.dificultades.length, 0);
}
