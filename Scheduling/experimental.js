//Busca cual es el valor con menor prioridad y lo envia a ejecucion
function proximoEjecutar() {
    let proximo = new Process('P1', 99999, 99999, 99999, 99999, false, false, false);
    let pos = 0;

    if (procesos.length !== 0) {
        procesos.forEach(element => {
            if (proximo.prioridad > element.prioridad) {
                proximo = element;
                pos = procesos.indexOf(element);
            }
            else if (proximo.llegada > element.llegada) {
                proximo = element;
                pos = procesos.indexOf(element);
            }
        });
        //Elimina el proceso de los procesos
        procesos[pos] = undefined;
        running.push(proximo);
        hasNext = true;
    }
}
// Ejecuta un proceso disminuyendo el valor de tiempo mediante intervalos
function ejecutarIntervalos() {
    let actual = running.pop();
    isRunning = true;
    let ejecutando = setInterval(() => {
        if (actual.tiempo > 0) {
            console.log(`${actual.id}:${actual.tiempo}`);
            actual.tiempo = actual.tiempo - 1;
            actual.procesado = actual.procesado + 1;
        } else {
            isRunning = false;
            actual.finished = true;
            finished.push(actual);
            console.log(actual);
            clearInterval(ejecutando);
        }
    }, TIMER);
}



