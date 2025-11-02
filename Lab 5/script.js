let estudiantes = [];

function actualizarContador() {
  const c = estudiantes.length;
  document.getElementById("counter").textContent = c + (c === 1 ? " estudiante" : " estudiantes");
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("email").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("carrera").value = "";
}

function renderTabla() {
  const tbody = document.getElementById("tablaEstudiantes");
  if (estudiantes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No hay resultados</td></tr>`;
    actualizarContador();
    return;
  }

  const filas = estudiantes.map((est, i) => {
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(est.nombre)}</td>
        <td>${escapeHtml(est.apellido)}</td>
        <td>${escapeHtml(est.email)}</td>
        <td>${est.edad}</td>
        <td>${escapeHtml(est.carrera)}</td>
        <td><button class="delete-btn" data-index="${i}">Eliminar</button></td>
      </tr>
    `;
  }).join("");

  tbody.innerHTML = filas;
  actualizarContador();

  tbody.querySelectorAll("button.delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"));
      eliminar(idx);
    });
  });
}

function eliminar(i) {
  if (i >= 0 && i < estudiantes.length) {
    estudiantes.splice(i, 1);
    renderTabla();
  }
}

function borrarTodo() {
  if (!confirm("¿Seguro que deseas borrar todos los estudiantes?")) return;
  estudiantes = [];
  renderTabla();
}

function esEmailValido(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function onAgregarClick() {
  const nombreVal   = document.getElementById("nombre").value.trim();
  const apellidoVal = document.getElementById("apellido").value.trim();
  const emailVal    = document.getElementById("email").value.trim();
  const edadRaw     = document.getElementById("edad").value;
  const edadVal     = parseInt(edadRaw, 10);
  const carreraVal  = document.getElementById("carrera").value;

  if (!nombreVal || !apellidoVal || !emailVal || !edadRaw || !carreraVal)
    return alert("Todos los campos son obligatorios");

  if (!esEmailValido(emailVal))
    return alert("Correo inválido");

  if (isNaN(edadVal) || edadVal < 18 || edadVal > 100)
    return alert("Edad debe ser entre 18 y 100");

  estudiantes.push({
    nombre: nombreVal,
    apellido: apellidoVal,
    email: emailVal,
    edad: edadVal,
    carrera: carreraVal
  });

  limpiarFormulario();
  renderTabla();

  document.getElementById("nombre").focus();
}

function init() {
  const btnAgregar = document.getElementById("btnAgregar");
  const btnLimpiar = document.querySelector(".card .actions .btn-gray"); 
  const btnBorrarTodo = document.querySelector('button.btn-gray[onclick="borrarTodo()"]') || document.querySelectorAll('button.btn-gray')[1];

  if (btnAgregar) btnAgregar.addEventListener("click", onAgregarClick);
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFormulario);
  if (!btnBorrarTodo) {
    document.querySelectorAll("button.btn-gray").forEach(b => {
      if (b.textContent.trim().toLowerCase() === "borrar todo") btnBorrarTodo = b;
    });
  }
  if (btnBorrarTodo) btnBorrarTodo.addEventListener("click", borrarTodo);

  renderTabla(); 
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
