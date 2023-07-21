var usuarios = [];

function agregarUsuario() {
  var nombreUsuario = document.getElementById("nombreUsuario").value.trim().toLowerCase();
  if (nombreUsuario !== "") {
    if (usuarios.includes(nombreUsuario)) {
      alert("¡Ese usuario ya existe!");
    } else {
      usuarios.push(nombreUsuario);
      usuarios.sort((a, b) => a.localeCompare(b));
      actualizarListaUsuarios();
      document.getElementById("nombreUsuario").value = "";
    }
  }
}

function eliminarUsuario() {
  var usuarioSeleccionado = document.getElementById("usuarioEliminar").value.toLowerCase();
  if (usuarioSeleccionado !== "") {
    var confirmarEliminar = confirm("¿Estás seguro de eliminar al usuario " + usuarioSeleccionado + "?");
    if (confirmarEliminar) {
      usuarios = usuarios.filter(function (usuario) {
        return usuario.toLowerCase() !== usuarioSeleccionado.toLowerCase();
      });
      actualizarListaUsuarios();
      eliminarHorarioDeTabla(usuarioSeleccionado);
    }
  }
}

function eliminarHorarioDeTabla(usuario) {
  var tabla = document.getElementById("tablaHorario");
  for (var i = 0; i < tabla.rows.length; i++) {
    if (tabla.rows[i].cells[0].innerHTML.toLowerCase() === usuario.toLowerCase()) {
      tabla.deleteRow(i);
      break;
    }
  }
}

function eliminarHorario(rowIndex) {
  var tabla = document.getElementById("tablaHorario");
  var usuario = tabla.rows[rowIndex].cells[0].innerHTML.toLowerCase();
  tabla.deleteRow(rowIndex);
  eliminarHorarioDeTabla(usuario);
}

function actualizarListaUsuarios() {
  var selectUsuario = document.getElementById("usuarioEliminar");
  selectUsuario.innerHTML = "";
  usuarios.forEach(function (usuario) {
    var option = document.createElement("option");
    option.value = usuario;
    option.text = capitalizeFirstLetter(usuario);
    selectUsuario.appendChild(option);
  });
}

function agregarHorario() {
  var usuarioSeleccionado = document.getElementById("usuarioEliminar").value.toLowerCase();
  var horario = document.getElementById("horario").value;

  var tabla = document.getElementById("tablaHorario");
  var row;
  var nombreCell;
  var horarioCell;
  var eliminarButton;

  for (var i = 0; i < tabla.rows.length; i++) {
    if (tabla.rows[i].cells[0].innerHTML.toLowerCase() === usuarioSeleccionado) {
      row = tabla.rows[i];
      nombreCell = row.cells[0];
      horarioCell = row.cells[1];
      eliminarButton = row.cells[2].getElementsByTagName("button")[0];
      break;
    }
  }

  if (row) {
    horarioCell.innerHTML = horario;
  } else {
    row = tabla.insertRow(tabla.rows.length);
    nombreCell = row.insertCell(0);
    horarioCell = row.insertCell(1);

    nombreCell.innerHTML = capitalizeFirstLetter(usuarioSeleccionado);
    nombreCell.classList.add("name-cell");

    eliminarButton = document.createElement("button");
    eliminarButton.innerHTML = "Eliminar horario";
    eliminarButton.classList.add("button", "eliminar");
    eliminarButton.onclick = function () {
      eliminarHorario(row.rowIndex);
    };
    var eliminarCell = row.insertCell(2);
    eliminarCell.appendChild(eliminarButton);
  }

  horarioCell.innerHTML = horario;
  horarioCell.classList.add("horario-cell");
  horarioCell.className = "horario-cell " + getColorClass(horario);

  ordenarTablaPorHorario();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColorClass(horario) {
  var startTime = horario.split(" - ")[0];

  if (startTime === "12pm") {
    return "blue";
  } else if (startTime === "12:30pm") {
    return "yellow";
  } else if (startTime === "1pm") {
    return "green";
  } else if (startTime === "1:30pm") {
    return "turquoise";
  } else if (startTime === "2pm") {
    return "pink";
  } else if (startTime === "2:30pm") {
    return "orange";
  } else if (startTime === "3pm") {
    return "purple";
  } else if (startTime === "3:30pm") {
    return "pink";
  }
}

function hacerTablaResponsiva() {
  var tabla = document.getElementById("tablaHorario");
  var tablaContainer = document.getElementById("tablaContainer");

  tablaContainer.style.overflowX = "auto";

  if (tabla.offsetWidth > tablaContainer.offsetWidth) {
    tabla.style.width = "100%";
  } else {
    tabla.style.width = "auto";
  }
}

window.addEventListener("resize", hacerTablaResponsiva);

function ordenarTablaPorHorario() {
  var tabla = document.getElementById("tablaHorario");
  var rows = Array.from(tabla.rows).slice(1); // Exclude header row
  rows.sort(function (a, b) {
    return getHorarioValue(a.cells[1].innerText) - getHorarioValue(b.cells[1].innerText);
  });

  var tbody = tabla.querySelector("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  rows.forEach(function (row) {
    tbody.appendChild(row);
  });
}

function getHorarioValue(horario) {
  var startTime = horario.split(" - ")[0];

  if (startTime === "12pm") {
    return 1;
  } else if (startTime === "12:30pm") {
    return 2;
  } else if (startTime === "1pm") {
    return 3;
  } else if (startTime === "1:30pm") {
    return 4;
  } else if (startTime === "2pm") {
    return 5;
  } else if (startTime === "2:30pm") {
    return 6;
  } else if (startTime === "3pm") {
    return 7;
  } else if (startTime === "3:30pm") {
    return 8;
  }
}

function ordenarTablaPorHorario() {
  var tabla = document.getElementById("tablaHorario");
  var rows = Array.from(tabla.rows).slice(1); // Exclude header row
  rows.sort(function (a, b) {
    var horarioValueA = getHorarioValue(a.cells[1].innerText);
    var horarioValueB = getHorarioValue(b.cells[1].innerText);

    if (horarioValueA !== horarioValueB) {
      return horarioValueA - horarioValueB;
    } else {
      return a.cells[0].innerText.localeCompare(b.cells[0].innerText);
    }
  });

  var tbody = tabla.querySelector("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  rows.forEach(function (row) {
    tbody.appendChild(row);
  });
}

function guardarHorarioEnFirebase() {
  var tabla = document.getElementById("tablaHorario");
  var horarios = {};

  // Recorrer la tabla y obtener los datos de horarios
  for (var i = 1; i < tabla.rows.length; i++) {
    var nombreUsuario = tabla.rows[i].cells[0].textContent.trim().toLowerCase();
    var horario = tabla.rows[i].cells[1].textContent.trim();

    if (nombreUsuario && horario) {
      horarios[nombreUsuario] = horario;
    }
  }

  // Guardar los horarios en Firebase Realtime Database
  firebase.database().ref("usuarios").set(horarios)
    .then(function() {
      console.log("Horarios guardados exitosamente en Firebase.");
    })
    .catch(function(error) {
      console.error("Error al guardar los horarios en Firebase: ", error);
    });
}
