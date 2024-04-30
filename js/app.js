import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiChGn7fWplfjHB8XM7Ltk0t3kwaIveKw",
  authDomain: "mrcdata-c2765.firebaseapp.com",
  projectId: "mrcdata-c2765",
  storageBucket: "mrcdata-c2765.appspot.com",
  messagingSenderId: "1089274380848",
  appId: "1:1089274380848:web:8527a62fca9a44b1c0e3f5",
  measurementId: "G-T5P4E4V3FC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let productos = [];
let productosFiltrados = [];
const productosPorPagina = 3;

async function fetchDataFromFirebase() {
  try {
    // Mostrar loader
    document.getElementById("loader").style.display = "flex";
    document.getElementById("loader").style.justifyContent = "center";
    document.getElementById("loader").style.alignItems = "center";

    const querySnapshot = await getDocs(collection(db, "mrcData"));
    productos = querySnapshot.docs.map((doc) => doc.data());
    productosFiltrados = productos.filter((producto) =>
      producto.categoria.id.includes("REPUESTOS")
    );

    const totalPaginas = Math.ceil(
      productosFiltrados.length / productosPorPagina
    );
    generarBotonesPaginacion(totalPaginas);

    cargarProductos(productosFiltrados, 1);

    // Ocultar loader
    document.getElementById("loader").style.display = "none";
  } catch (error) {
    console.error(error);
  }
}

fetchDataFromFirebase();

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categorias");

function cargarProductos(productosElegidos, pagina) {
  contenedorProductos.innerHTML = "";

  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosElegidos.slice(inicio, fin);

  let imagenesCargadas = 0;
  const totalImagenes = productosPagina.length;

  productosPagina.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("col-md-4");
    div.classList.add("animate__animated");
    div.classList.add("animate__zoomIn");

    div.innerHTML = `
      <div class="p-3">
          <div class="box-article">
          <p class="title">${producto.titulo}</p>
          <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen">
          <div class="d-flex justify-content-between mt-2">
              <div class="comandos-box">
              <a href="https://wa.me/5493813425806/?text=Hola Moto Repuestos Cordoba, consulto por el repuesto ${producto.titulo}" target="_blank">
                  <button class="btn btn-outline-primary producto-consultar">CONSULTAR</button>
              </a>
              </div>
          </div>
          </div>
      </div>
      `;
    contenedorProductos.appendChild(div);

    // Agregar evento load a cada imagen
    const imagen = div.querySelector(".producto-imagen");
    imagen.addEventListener("load", () => {
      imagenesCargadas++;
      // Si todas las imágenes se han cargado, ocultar el loader
      if (imagenesCargadas === totalImagenes) {
        document.getElementById("loader").style.display = "none";
      }
    });
  });

  if (productosPagina.length < productosPorPagina) {
    if (pagina === 1 || productosElegidos.length <= productosPorPagina) {
      document.getElementById("paginacion").style.display = "none";
    } else {
      document.getElementById("paginacion").style.display = "block";
    }
  } else {
    document.getElementById("paginacion").style.display = "block";
  }
}

function generarBotonesPaginacion(totalPaginas) {
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.addEventListener("click", () => {
      cargarProductos(productosFiltrados, i);
      document
        .querySelectorAll("#paginacion button")
        .forEach((btn) => btn.classList.remove("activeBtn"));
      boton.classList.add("activeBtn");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    if (i === 1) {
      boton.classList.add("activeBtn");
    }

    paginacion.appendChild(boton);
  }
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    const categoriaSeleccionada = e.currentTarget.id;
    productosFiltrados =
      categoriaSeleccionada !== "todos"
        ? productos.filter(
            (producto) =>
              producto.categoria.id.includes(categoriaSeleccionada) ||
              producto.categoria.id.includes("todos")
          )
        : productos.filter((producto) =>
            producto.categoria.id.includes("REPUESTOS")
          );

    generarBotonesPaginacion(
      Math.ceil(productosFiltrados.length / productosPorPagina)
    );
    cargarProductos(productosFiltrados, 1);
  });
});

const formulario = document.querySelector("#formulario");
const botonBuscar = document.querySelector("#boton-buscar");

const filtrar = (event) => {
  event.preventDefault();

  const texto = formulario.value.toLowerCase();
  const palabrasClave = texto
    .split(" ")
    .filter((palabra) => palabra.length > 0);

  const productosFiltrados = productos.filter((producto) => {
    const nombre = producto.titulo.toLowerCase();

    return (
      palabrasClave.every((palabra) => nombre.includes(palabra)) &&
      producto.categoria.id.includes("REPUESTOS")
    );
  });

  const resultadoBusqueda = document.getElementById("resultado-busqueda");
  resultadoBusqueda.innerHTML = ""; // Limpiar el mensaje de búsqueda

  botonesCategorias.forEach((boton) => boton.classList.remove("active"));

  if (productosFiltrados.length === 0) {
    mostrarMensajeNoEncontrado();
  } else {
    contenedorProductos.style.display = "block"; // Mostrar el contenedor de productos
    cargarProductos(productosFiltrados, 1);
  }
};

formulario.addEventListener("submit", filtrar);
botonBuscar.addEventListener("click", filtrar);

function mostrarMensajeNoEncontrado() {
  const resultadoBusqueda = document.getElementById("resultado-busqueda");
  resultadoBusqueda.innerHTML = "<p>Artículo no encontrado</p>";
  contenedorProductos.style.display = "none";
}
