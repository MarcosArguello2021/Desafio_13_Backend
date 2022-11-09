const socket = io.connect();
const { denormalize, normalize, schema } = normalizr;

const authorSchema = new schema.Entity('authors', {}, { idAttribute: 'id' })
const messageSchema = new schema.Entity('mensaje', { author: authorSchema })

const chat = new schema.Entity('chat', {
    author: authorSchema,
    text: [messageSchema]
}, { idAttribute: "id" })

const chatSchema = new schema.Array(chat);

const normalizeData = (data) => {
    const normalizedMessages = normalize(data, [chatSchema]);
    console.log("Array con chats normalizados: ", normalizedMessages)
    return normalizedMessages;
}

const denormalizeData = (data) => {
    const dataDenormalizada = denormalize(data.result, chatSchema, data.entities)
    return dataDenormalizada;
}

socket.on('lista_productos', productos => {
    document.getElementById('lista').innerHTML = ''
    productos.forEach(producto => {
        document.getElementById('lista').innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>${producto.price}</td>
            <td><img src="${producto.thumbnail}" height="70px"></td>
        </tr>
        `
    })
})

socket.on('lista_chat', chat => {
    

    const dataNormalizada = normalizeData(chat);
    console.log("Tamaño objeto normalizado: ", JSON.stringify(dataNormalizada).length)
    console.log("Tamaño objeto original: ", JSON.stringify(chat).length);


    document.getElementById('chat').innerHTML = ''
    chat.forEach(mensaje => {
        document.getElementById('chat').innerHTML += `
            <div style="width:100vw">
                <img src="${mensaje.author.avatar}" height="30px"/>
                <span style="color: brown;">&nbsp[${mensaje.author.alias}]</span>
                <span class="fst-italic" style="color: green;">&nbsp: ${mensaje.mensaje}</span>
            </div>
        `
    })
    const porcentajeDeCompresion = ((JSON.stringify(dataNormalizada).length * 100) / JSON.stringify(chat).length).toFixed(2)
    console.log(`El porcentaje de compresión es del ${porcentajeDeCompresion}%`)
    document.getElementById("formLegend").innerText = `Centro de Mensajes (Compresión: ${porcentajeDeCompresion}%)`
})


const buttonChat = document.getElementById("enviar")

buttonChat?.addEventListener("click", () => {

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (regex.test(document.getElementById("email").value)) {
        const data = {
            author: {
                id: document.getElementById("email").value,
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                edad: document.getElementById("edad").value,
                alias: document.getElementById("alias").value,
                avatar: document.getElementById("avatar").value,

            },
            mensaje: document.getElementById("mensaje").value
        }

        document.getElementById('mensaje').value = ''
        socket.emit('cliente_nuevo_mensaje_chat', data)
    } else {
        document.getElementById('email').innerText = 'inserte un email valido'
        document.getElementById('mensaje').value = ''
    }
})

