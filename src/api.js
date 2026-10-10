const API = "https://mirror.hinamizawa.ai";

export async function buscarMapas(consulta) {
  const clave = `aerobeat-v1:${consulta}`;
  // La caché es opcional: un fallo del almacenamiento no impide buscar.
  try {
    const guardados = JSON.parse(localStorage.getItem(clave));
    if (Array.isArray(guardados)) {
      return { datos: guardados, origen: "caché local" };
    }
  } catch {
    // JSON corrupto o almacenamiento bloqueado: consultamos la API.
  }

  const parametros = new URLSearchParams({ q: consulta, amount: "24" });
  const respuesta = await fetch(`${API}/api/v2/search?${parametros}`);
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con HTTP ${respuesta.status}.`);
  }
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) {
    throw new Error("La API no ha devuelto una lista de mapas.");
  }

  try {
    // No guardamos vacíos: el proveedor también devuelve [] ante ciertas caídas.
    if (datos.length > 0) localStorage.setItem(clave, JSON.stringify(datos));
  } catch {
    // Si no queda espacio, los resultados siguen funcionando sin caché.
  }
  return { datos, origen: "API hinai" };
}

export function enlaceDescarga(id) {
  return `https://beatconnect.io/b/${id}`;
}
