export const infoProcess = (req, res) => {
    const info = {
        "Argumentos de entrada": process.argv,
        "Nombre de la plataforma (sistema operativo)": process.platform, 
        "Versión de node.js": process.version, 
        "Memoria total reservada": process.memoryUsage(),
        "Path de ejecución": process.execPath,
        "Process id": process.pid,
        "Carpeta del proyecto": process.cwd()
    }
    res.send(info)
}