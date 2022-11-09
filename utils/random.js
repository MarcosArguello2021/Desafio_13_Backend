const numeroRandom = () => {
    return Math.floor(Math.random() * (100 - 1) + 1)
}

const arrayRandom = (cantidad) => {
    const arr = []
    for (let i = 0; i <= cantidad; i++) arr.push(numeroRandom())
    return arr
}

const generarNumeros = (cant) => {
    console.log(cant)
    const arr = arrayRandom(cant)
    const obj = {}
    arr.forEach(num => obj[num] = obj[num] ? ++obj[num] : 1)
    return obj
}

process.on('exit', () => {
    console.log(`Proceso finalizado`)
})

process.on('message', cantidad => {
    console.log(`Comenzando cracion de objeto`)
    const obj = generarNumeros(cantidad)
    process.send(obj)
    console.log(`Objeto creado y enviado`)
    process.exit()
})