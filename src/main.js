import { buscarMapas } from "./api.js";
import { prepararMapas, filtrarMapas, contarDificultades } from "./logica.js";
import { mostrarEstado, pintarMapas } from "./render.js";

const formulario = document.querySelector("#buscador");
const consulta = document.querySelector("#consulta");
const modo = document.querySelector("#modo");
const controles = document.querySelector("#controles");
let mapas = [];
let origen = "";

function actualizarVista() {
  const visibles = filtrarMapas(mapas, modo.value);
  pintarMapas(visibles, contarDificultades(visibles));
  mostrarEstado(visibles.length > 0
    ? `Resultados de ${origen}. La descarga incluye todas las dificultades del set.`
    : "Sin resultados para esta búsqueda y modo. Prueba otro término o Todos los modos.");
}

async function buscar() {
  if (controles.disabled) return;
  const termino = consulta.value.trim();
  if (!termino) {
    mostrarEstado("Escribe una canción, artista o creador.", true);
    return;
  }
  // Una búsqueda cada vez evita que una respuesta antigua sustituya a la nueva.
  controles.disabled = true;
  mapas = [];
  pintarMapas([], 0);
  mostrarEstado("Buscando mapas… Un momento, estamos conectando con el servidor.");
  try {
    const resultado = await buscarMapas(termino);
    mapas = prepararMapas(resultado.datos);
    origen = resultado.origen;
    actualizarVista();
  } catch (error) {
    mostrarEstado(`No se pudo completar la búsqueda. ${error.message} Comprueba tu conexión y pulsa Buscar mapas para reintentar.`, true);
  } finally {
    controles.disabled = false;
  }
}

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  buscar();
});
modo.addEventListener("change", actualizarVista);
buscar();
