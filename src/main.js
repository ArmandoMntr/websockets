const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('mensajes.txt')
//--------------------------------------------
// configuro el socket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    // carga inicial de productos
    let productos = await productosApi.all()    
    socket.emit('productos', productos)
    // actualizacion de productos
    socket.on('newProduct', async producto => {
        const update = await productosApi.save(producto);
        let productos = await productosApi.all();
        io.sockets.emit('productos', productos);
    });
    // carga inicial de mensajes
    let mensajes = await mensajesApi.getAll();
    // console.log(mensajes)
    socket.emit('mensajes', mensajes);
    // actualizacion de mensajes
    socket.on('text', async text => {
        let mensajes = await mensajesApi.getAll();
        await mensajesApi.save(text);
        io.sockets.emit('mensajes', mensajes);
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'));

app.get('/', (request, response) => {
    response.sendFile('index.html', { root: __dirname })
});
//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))