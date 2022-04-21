const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto');
formAgregarProducto.addEventListener('submit',  e => {
    e.preventDefault();
    let name = document.getElementById('nombre').value;
    let price = document.getElementById('precio').value;
    let thumbnail = document.getElementById('foto').value;
    let producto = { name: name, price: price, thumbnail: thumbnail };
    console.log(producto)
    socket.emit('newProduct', producto);
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('foto').value = '';
}) 

socket.on('productos', async productos => {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = await makeHtmlTable(productos);
});


function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
    .then(respuesta => respuesta.text())
    .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
    }

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault();
    let email = inputUsername.value;
    let msg = inputMensaje.value;
    let text = { email: email, msg: msg};
    socket.emit('text', text);
})

socket.on('mensajes', async mensajes => {
    const divMensajes = document.getElementById('mensajes');
    divMensajes.innerHTML = await makeHtmlList(mensajes)
}) 

function makeHtmlList(mensajes) {
    return fetch('plantillas/lista-mensajes.hbs')
        .then(respuesta => respuesta.text())
            .then(plantilla => {
                const template = Handlebars.compile(plantilla);
                const html = template ({ mensajes })
                return html
            });
}

function check() {
  if (inputUsername.value != '' && inputUsername.checkValidity()) {
    btnEnviar.disabled = false;
  } else {
    btnEnviar.disabled = true;
  }
}
inputUsername.addEventListener('input', check);