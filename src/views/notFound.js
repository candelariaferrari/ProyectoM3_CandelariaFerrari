//  Ruta 404: cualquier URL que no matchea las rutas conocidas

export function renderNotFound() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="notFound">
      <h1>404</h1>
      <p>No encontramos esta página.</p>
      <a class="btn-chat" href="/home">Volver a Home</a>
    </div>
  `;
}