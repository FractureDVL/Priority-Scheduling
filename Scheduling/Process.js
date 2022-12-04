const procesos = [];

class Process {
    constructor(id, llegada, tiempo, prioridad) {
        this.id = id;
        this.llegada = llegada;
        this.tiempo = tiempo;
        this.prioridad = prioridad;
    }
}

function addProcess(proceso){
    procesos.push(proceso);
}

//const P1 = new Proceso("P1", 0 , 20 , 1);

export {addProcess, procesos};