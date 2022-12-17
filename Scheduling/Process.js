class Process {
    constructor(id, llegada, tiempo, prioridad, procesado, stoped, running, finished) {
        this.id = id;
        this.llegada = llegada;
        this.tiempo = tiempo;
        this.prioridad = prioridad;
        this.procesado = procesado;
        this.stoped = stoped;
        this.running = running;
        this.finished = finished;
    }
}

let procesos = [
    //id, llegada, tiempo, prioridad, procesado, stoped, running, finished
    new Process('P1', 2, 7, 5, 0, false, false, false), // 4
    new Process('P2', 1, 7, 4, 0, false, false, false), // 3
    new Process('P3', 6, 3, 5, 0, false, false, false), // 2
    new Process('P4', 0, 7, 4, 0, false, false, false), // 1
    new Process('P5', 6, 3, 3, 0, false, false, false)  // 5
];
//P5,P4,P2,P1,P3;

//Procesos ejecutando
let running = [];
//Procesos pausados
let stoped = [];
//Procesos terminados
let finished = [];

//Variables globales para el proceso de ejecucion
let TIMER = 1000;
let isRunning = false;
let hasNext = false;
let current = null;
//swaps
let swaps = [];
//Ordenamiento 1.Prioridad, luego 2.llegada (Por buburja)
function bubbleSort(procesos, tamanio) {
    if (tamanio == 1) return;
    let contador = 0;
    for (let i = 0; i < tamanio - 1; i++) {
        if (procesos[i].prioridad > procesos[i + 1].prioridad) {
            let temp = procesos[i];
            procesos[i] = procesos[i + 1];
            procesos[i + 1] = temp;
            swaps.push([procesos[i].id, procesos[i + 1].id, i, i + 1]);
            contador++;
        } else if (procesos[i].llegada > procesos[i + 1].llegada && procesos[i].prioridad === procesos[i + 1].prioridad) {
            let temp = procesos[i];
            procesos[i] = procesos[i + 1];
            procesos[i + 1] = temp;
            swaps.push([procesos[i].id, procesos[i + 1].id, i, i + 1]);
            contador++;
        }
    }
    if (contador == 0) {
        return;
    }
    bubbleSort(procesos, tamanio - 1);
}

//Demora la ejecucion de la siguiente isntruccion por x tiempo
let wait = (ms) => {
    const start = Date.now();

    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

//Ejecuta un proceso disminuyendo el valor de tiempo recursivo
function ejecutarRecursivo(_actual) {
    if (_actual.tiempo > 0) {
        wait(1000);
        console.log(`${_actual.id}:${_actual.tiempo}`);
        _actual.tiempo = _actual.tiempo - 1;
        _actual.procesado = _actual.procesado + 1;
        ejecutarRecursivo(_actual);
    } else {
        _actual.finished = true;
        console.log(`Proceso terminado: ${_actual.id}`);
        finished.push(_actual);
        hasNext = false;
    }
}

//Envia a ejectuar un proceso en la pila
function proximoEjecutar() {
    running.push(procesos.shift());
    hasNext = true;
}

//Algoritmo de planeacion por prioridad
function priorityScheduling() {
    if (procesos.length > 0 || hasNext) {
        if (running.length === 0 && !hasNext) {
            proximoEjecutar();
            priorityScheduling();
        } else if (hasNext) {
            current = running.pop();
            ejecutarRecursivo(current);
            console.log(current);
            priorityScheduling();
        }
    } else if (procesos.length === 0 && !hasNext) {
        return console.log(`Terminados :)`);
    }
}

//--Start Codigo Main--
// console.log('Ejecutando procesos:');
bubbleSort(procesos, procesos.length);
priorityScheduling();

finished.forEach(element => {
   console.log(element);
});

