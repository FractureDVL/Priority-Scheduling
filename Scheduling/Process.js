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
    new Process('P1', 2, 7, 1, 0, false, false, false), // 2
    new Process('P2', 0, 7, 1, 0, false, false, false), // 1
    new Process('P3', 6, 3, 3, 0, false, false, false), // 4
    new Process('P4', 4, 7, 3, 0, false, false, false), // 5
    new Process('P5', 6, 3, 4, 0, false, false, false)  // 3
];
//P2,P1,P5,P3,P4;

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

//Ordenamiento 1.Prioridad, luego 2.llegada (Por buburja)
function bubbleSort(procesos, tamanio) {
    if (tamanio == 1) return;
    let contador = 0;
    for (let i = 0; i < tamanio - 1; i++) {
        if (procesos[i].prioridad > procesos[i + 1].prioridad) {
            let temp = procesos[i];
            procesos[i] = procesos[i + 1];
            procesos[i + 1] = temp;
            contador++;
        } else if (procesos[i].llegada > procesos[i + 1].llegada) {
            let temp = procesos[i];
            procesos[i] = procesos[i + 1];
            procesos[i + 1] = temp;
            contador++;
        }
    }
    if (contador == 0) {
        return;
    }
    bubbleSort(procesos, tamanio - 1);
}

//Ejecuta un proceso disminuyendo el valor de tiempo iterativo
function ejecutarRecursivo(_actual) {
    if (_actual.tiempo > 0) {
        console.log(`${_actual.id}:${_actual.tiempo}`);
        _actual.tiempo = _actual.tiempo - 1;
        _actual.procesado = _actual.procesado + 1;
        ejecutarRecursivo(_actual);
    } else {
        _actual.finished = true;
        console.log(_actual);
        console.log(`Proceso terminado: ${_actual.id}`);
        finished.push(_actual);
    }
}

//Algoritmo de planeacion por prioridad
function priorityScheduling() {
    if (procesos.length === 0) {
        return console.log(`Terminados :)`);
    } else if (procesos.length > 0) {
        if (running.length === 0) {
            proximoEjecutar();
            priorityScheduling();
        } else if (running.length > 0) {
            let actual = running.pop();
            if (actual.finished === false) {
                ejecutarRecursivo(actual);
                priorityScheduling();
            }
            else priorityScheduling();
        }
    };
}

//--Start Codigo Main--
console.log('Ejecutando procesos:');
// priorityScheduling();
// proximoEjecutar();
// let actual = running.pop();
// ejecutarRecursivo(actual);
// console.log(procesos);

bubbleSort(procesos, procesos.length);
console.log(procesos);