// Inicializar Firebase con tu configuración
var firebaseConfig = {
    // Reemplaza con los detalles de tu configuración de Firebase
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Referencia a la base de datos
  var database = firebase.database();
  
  // Referencia a la tabla de usuarios
  var usuariosRef = database.ref("usuarios");
  
  // Esperar a que se cargue el DOM antes de obtener los datos
  document.addEventListener("DOMContentLoaded", function () {
    cargarHorarioDesdeFirebase();
  });
  
  // Función para cargar el horario desde Firebase y mostrarlo en la tabla
  function cargarHorarioDesdeFirebase() {
    usuariosRef.once("value")
      .then(function (snapshot) {
        // Limpiar la tabla
        var tbody = document.getElementById("tbodyHorario");
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
  
        // Recorrer los datos y agregarlos a la tabla
        snapshot.forEach(function (usuarioSnapshot) {
          var usuario = usuarioSnapshot.key;
          var horario = usuarioSnapshot.val();
  
          var row = document.createElement("tr");
          var nombreCell = document.createElement("td");
          var horarioCell = document.createElement("td");
  
          nombreCell.textContent = capitalizeFirstLetter(usuario);
          nombreCell.classList.add("name-cell");
  
          horarioCell.textContent = horario;
          horarioCell.classList.add("horario-cell", getColorClass(horario));
  
          row.appendChild(nombreCell);
          row.appendChild(horarioCell);
          tbody.appendChild(row);
        });
      })
      .catch(function (error) {
        console.error("Error al cargar el horario desde Firebase: ", error);
      });
  }
  
  // Las funciones capitalizeFirstLetter y getColorClass son las mismas que en script.js
  // ... (copiar y pegar desde script.js)
  
  // Esta función asegura que el primer carácter de una cadena esté en mayúscula
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  