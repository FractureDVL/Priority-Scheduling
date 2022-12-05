export class Process {
    constructor(id, llegada, tiempo, prioridad) {
        this.id = id;
        this.llegada = llegada;
        this.tiempo = tiempo;
        this.prioridad = prioridad;
    }
}

export {Process as Proceso};