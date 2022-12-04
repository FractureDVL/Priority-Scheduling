let procesos = [
    {
        id: 'P1',
        llegada: 0,
        tiempo: 4,
        prioridad: 3,
        stoped: null,
        running: null,
        finished: null
    },
    {
        id: 'P3',
        llegada: 4,
        tiempo: 3,
        prioridad: 2,
        stoped: null,
        running: null,
        finished: null
    },
    {
        id: 'P5',
        llegada: 0,
        tiempo: 4,
        prioridad: 3,
        stoped: null,
        running: null,
        finished: null
    },
    {
        id: 'P0',
        llegada: 4,
        tiempo: 2,
        prioridad: 3,
        stoped: null,
        running: null,
        finished: null
    }
];
//Procesos en cola listo 
let ready = [];

//Procesos ejecutando
let running = [];

//Procesos pausados
let stoped = [];

//Procesos terminados
let finished = [];

//Busca cual es el valor con menor prioridad
const menorPrioridad = procesos.reduce((previous, current) => {
    return (previous.llegada > current.llegada && previous.prioridad > current.prioridad) ? prioritario = current: null;
});


console.log(menorPrioridad);