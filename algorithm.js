'use strict';

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
    new Process('P1', 0, 7, 1, 0, false, false, false),
    new Process('P2', 1, 7, 0, 0, false, false, false),
    new Process('P3', 6, 3, 4, 0, false, false, false),
    new Process('P4', 4, 7, 5, 0, false, false, false),
    new Process('P5', 6, 3, 3, 0, false, false, false)
];

//Procesos ejecutando
let running = [];
//Procesos pausados
let stoped = [];
//Procesos terminados
let finished = [];

//Define la velocidad con la que se ejecuta un proceso
let timer = 1000;
let isRunning = false;

//Busca cual es el valor con menor prioridad y lo envia a ejecucion
async function proximoEjecutar() {
    let proximo = procesos[0];
    let pos = 0;
    procesos.forEach(element => {
        if (proximo.prioridad > element.prioridad && element.finished === false) {
            proximo = element;
            pos = procesos.indexOf(element);
        }
        else if (proximo.llegada > element.llegada && element.finished === false) {
            proximo = element;
            pos = procesos.indexOf(element);
        }
    });
    procesos.splice(pos, pos);
    running.push(proximo);
}

//Ejecuta un proceso disminuyendo el valor de tiempo
async function ejecutar() {
    let actual = running.pop();
    isRunning = true;
    let ejecutando = setInterval(() => {
        if (actual.tiempo > 0) {
            console.log(`${actual.id}:${actual.tiempo}`);
            actual.tiempo =  actual.tiempo - 1;
            actual.procesado = actual.procesado + 1;
        } else {
            isRunning = false;
            actual.finished = true;
            finished.push(actual);
            console.log(actual);
            clearInterval(ejecutando);
        }
    }, timer);
    return '';
}

//Algoritmo de planeacion por prioridad
async function priorityScheduling() {
    if (procesos.length != 0) {
        if (running.length <= 0 && !isRunning) {
            let response = proximoEjecutar(procesos);
            priorityScheduling();
        } else {
            let response = await ejecutar(running);
            priorityScheduling();
        }

    }
    return console.log(`Terminados :)`);
}

//--Start Codigo Main--
console.log('Ejecutando procesos:');
// priorityScheduling();
proximoEjecutar(procesos);
ejecutar(running);
// console.log(procesos);