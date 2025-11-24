function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

(() => {
  const App = (() => {

    const html = {
      nombre:   document.querySelector("#nombre"),
      apellido: document.querySelector("#apellido"),
      email:    document.querySelector("#email"),
      edad:     document.querySelector("#edad"),
      carrera:  document.querySelector("#carrera"),
      btnAgregar: document.querySelector("#btnAgregar"),
      btnLimpiar: document.querySelector(".actions .btn-gray"),
      btnBorrarTodo: document.querySelector('button.btn-gray[onclick="borrarTodo()"]'),
      tbody: document.querySelector("#tablaEstudiantes"),
      counter: document.querySelector("#counter")
    };

    let estudiantes = [];

    const templates = {
      row: (est, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(est.nombre)}</td>
          <td>${escapeHtml(est.apellido)}</td>
          <td>${escapeHtml(est.email)}</td>
          <td>${est.edad}</td>
          <td>${escapeHtml(est.carrera)}</td>
          <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
        </tr>
      `,
      empty: () => `<tr><td colspan="7">No hay resultados</td></tr>`,
      counter: (n) => `${n} ${n === 1 ? "estudiante" : "estudiantes"}`
    };

    const utils = {
      limpiarFormulario() {
        html.nombre.value = "";
        html.apellido.value = "";
        html.email.value = "";
        html.edad.value = "";
        html.carrera.value = "";
      },

      emailValido(email) {
        return typeof email === "string" && email.includes("@") && email.includes(".");
      },

      attachDeleteButtons() {
        const buttons = html.tbody.querySelectorAll(".delete-btn");
        buttons.forEach(btn =>
          btn.addEventListener("click", handlers.onDeleteClick)
        );
      },

      renderTabla() {
        if (estudiantes.length === 0) {
          html.tbody.innerHTML = templates.empty();
        } else {
          html.tbody.innerHTML = estudiantes
            .map((est, i) => templates.row(est, i))
            .join("");
        }
        utils.attachDeleteButtons();
        html.counter.textContent = templates.counter(estudiantes.length);
      }
    };

  
    const handlers = {
      onAgregarClick() {
        const nombre = html.nombre.value.trim();
        const apellido = html.apellido.value.trim();
        const email = html.email.value.trim();
        const edadRaw = html.edad.value;
        const edad = parseInt(edadRaw, 10);
        const carrera = html.carrera.value;

        if (!nombre || !apellido || !email || !edadRaw || !carrera)
          return alert("Todos los campos son obligatorios");

        if (!utils.emailValido(email))
          return alert("Correo inválido");

        if (isNaN(edad) || edad < 18 || edad > 100)
          return alert("Edad debe ser entre 18 y 100");

        estudiantes.push({ nombre, apellido, email, edad, carrera });

        utils.limpiarFormulario();
        utils.renderTabla();
      },

      onDeleteClick(e) {
        const idx = parseInt(e.target.dataset.index);
        estudiantes.splice(idx, 1);
        utils.renderTabla();
      },

      onBorrarTodoClick() {
        if (!confirm("¿Seguro que deseas borrar todos los estudiantes?")) return;
        estudiantes = [];
        utils.renderTabla();
      }
    };

    return {
      init() {
        html.btnAgregar.addEventListener("click", handlers.onAgregarClick);
        html.btnLimpiar.addEventListener("click", utils.limpiarFormulario);
        html.btnBorrarTodo.addEventListener("click", handlers.onBorrarTodoClick);

        utils.renderTabla();
      }
    };
 
  })(); 

  App.init();

})(); 
