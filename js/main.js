// Variables

const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritBtn = document.querySelector("#vaciar-carrito")
const listaVinos = document.querySelector("#lista-vinos");
let artCarrito = [] ;

cargarEventlisteners()
function cargarEventlisteners (){
    listaVinos.addEventListener("click", agregar_vino);

    //Eliminar cosas del carrito

    carrito.addEventListener("click", eliminarVino)

    document.addEventListener('DOMContentLoaded' , () => {
        artCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHtml();
    })

    vaciarCarritBtn.addEventListener('click', () => { 

        artCarrito = []; //reseteo el arreglo
        limpiarHtml();
        storage1();
    })
}

//Funciones

function agregar_vino(e){
    e.preventDefault();
    if(e.target.classList.contains("agregar-carrito")){
        vinoSeleccionado = e.target.parentElement.parentElement
        leerDatosVino(vinoSeleccionado)
    }
}

function eliminarVino (e){
    if (e.target.classList.contains('borrar-vino')){
        const vinoId =  e.target.getAttribute('data-id');
        const existe = artCarrito.some(vino =>(vino.id === vinoId && vino.cantidad > 1));
        
        artCarrito = existe 
        ? artCarrito.map(vino => vino.id === vinoId ? { ...vino, cantidad: vino.cantidad - 1 } : vino)
        : artCarrito.filter(vino => vino.id !== vinoId);

        carritoHtml();
    }
}


function leerDatosVino(vino){
     //Objeto
    infoVino = {
        imagen: vino.querySelector('img').src,
        bodegaMarca: vino.querySelector('h4').textContent,
        precio: vino.querySelector('.precio').textContent,
        id: vino.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    const existe = artCarrito.some(vino => vino.id === infoVino.id);
    artCarrito = existe 
    ? artCarrito.map(vino => vino.id === infoVino.id ? { ...vino, cantidad: vino.cantidad + 1 } : vino)
    : [...artCarrito, infoVino];
    console.log(artCarrito)
    carritoHtml()
}



function carritoHtml () {

    limpiarHtml();

    artCarrito.forEach( vino => {
        const {imagen, bodegaMarca, cantidad, precio, id} = vino;
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>
            <img src= "${imagen}" width= "50"></img>
        </td>
        
        <td>${bodegaMarca}</td>
        <td>${cantidad}</td>
        <td>${precio}</td>
        <td>
            <a href= "#" class= "borrar-vino" data-id= "${id}">X</a>
        </td>

        `;

        listaCarrito.appendChild(row)
    });

    storage1();

}

function storage1 (){
    localStorage.setItem('carrito', JSON.stringify(artCarrito));
}

function limpiarHtml(){

    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild)
    }
}

fetch("https://dolarapi.com/v1/dolares")
  .then(response => response.json()) 
  .then(data => {
    
    const container = document.getElementById('card-container');
    
    data.forEach(dolar => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${dolar.nombre}</h2>
        <p>Compra: ${dolar.compra}</p>
        <p>Venta: ${dolar.venta}</p>
        <p>Fecha: ${dolar.fecha}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });