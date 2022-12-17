class Proceso {
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

const app = Vue.createApp({
    data() {
        return {
            //Procesos del usuario
            procesosView: [
                //id, llegada, tiempo, prioridad, procesado, stoped, running, finished
                // new Proceso('P1', 2, 7, 5, 0, false, false, false), // 4
                // new Proceso('P2', 1, 7, 4, 0, false, false, false), // 3
                // new Proceso('P3', 6, 3, 5, 0, false, false, false), // 2
                // new Proceso('P4', 0, 7, 4, 0, false, false, false), // 1
                // new Proceso('P5', 6, 3, 3, 0, false, false, false)  // 5
            ],
            editing: false,
            show: false,
            //Procesos ordernados en sort
            procesosBack: [
                // new Proceso('P1', 2, 7, 5, 0, false, false, false), // 4
                // new Proceso('P2', 1, 7, 4, 0, false, false, false), // 3
                // new Proceso('P3', 6, 3, 5, 0, false, false, false), // 2
                // new Proceso('P4', 0, 7, 4, 0, false, false, false), // 1
                // new Proceso('P5', 6, 3, 3, 0, false, false, false)  // 5
            ],
            //Procesos ejecutando
            running: [],
            //Procesos pausados
            stoped: [],
            //Procesos terminados
            finished: [],
            //Save swaps
            swaps: [],
            //Save data for show in the chart
            chartDataFormat: [],
            TIMER: 500,
            tiempoTotal: 0,
            isRunning: false,
            hasNext: false,
            //current
            current: null,
            isSorted: false,
            chart: null,
            categoriesProcess: []
        }
    },
    mounted() {
        this.chart = Highcharts.chart('container', {
            chart: {
                type: 'xrange',
                className: 'ganttChart',
                backgroundColor: "#263159",
                borderRadius: 5,
                padding: 20
            },
            title: {
                text: 'Procesos finalizados',
                style: {
                    color: "#ffff",
                    fontSize: 30
                }
            },
            credits: {
                enabled: false,
                href: 'https://github.com/FractureDVL/Priority-Scheduling',
                text: 'FractureDVL',
                style: {
                    color: '#ffff',
                    fontSize: 10
                }
            },
            colors: ['#ffabab', '#d9abff', '#ffdaab', '#ddffab', '#abe4ff'],
            xAxis: {
                type: 'linear',
                title: 'Series',
                labels: {
                    fontFamily: 'Avenir Next W01',
                    style: {
                        color: "#ffff",
                        fontSize: 15
                    }
                },
                title: {
                    text: ''
                }
            },
            yAxis: {
                //array con categorias
                categories: this.categoriesProcess,
                reversed: true,
                labels: {
                    fontFamily: 'Avenir Next W01',
                    style: {
                        color: "#ffff",
                        fontSize: 15
                    }
                },
            },
            series: [{
                name: '',
                // data y: indexador de categorias, x:ragon incio, x2: rango final
                data: this.chartDataFormat
            }]
        });
    },
    computed: {
        //Generador para el proximo id
        newId: function name(params) {
            return `P${this.procesosView.length + 1}`;
        }
    },
    methods: {
        chargeExample() {
            console.log("Bro :)");
            let example = [
                new Proceso('P1', 2, 7, 5, 0, false, false, false), // 4
                new Proceso('P2', 1, 7, 4, 0, false, false, false), // 3
                new Proceso('P3', 6, 3, 5, 0, false, false, false), // 2
                new Proceso('P4', 0, 7, 4, 0, false, false, false), // 1
                new Proceso('P5', 6, 3, 3, 0, false, false, false)  // 5
            ];
            this.procesosBack = JSON.parse(JSON.stringify(example));
            this.procesosView = JSON.parse(JSON.stringify(example));
        },
        //Valida los datos de entrada en los campos
        valid(arr) {
            const number = /[0-9]*/;
            let valid = true;
            for (let i = 0; i < arr.length; i++) {
                if (!(number.test(arr[0]) && arr[0] != '')) {
                    valid = false;
                }
            }
            return valid;
        },
        //Agrega una fila con nuevo un nuevo procesos
        add() {
            var nuevo = document.querySelectorAll('tr.newProcess input.input-new');
            this.show = this.show ? '' : this.show = true;
            var nproc = [nuevo[0].value, nuevo[1].value, nuevo[2].value];
            //Clases
            if (this.valid(nproc)) {
                let p = new Proceso(this.newId, nuevo[2].valueAsNumber, nuevo[1].valueAsNumber, nuevo[0].valueAsNumber, 0, false, false, false);
                this.procesosView.push(p);
                this.procesosBack.push(p);
                this.isSorted = false;
            }
            else {
                Swal.fire({
                    icon: '',
                    title: 'Oops...',
                    text: 'Rellene todos los campos.',
                });
            }
            nuevo[0].value = '';
            nuevo[1].value = '';
            nuevo[2].value = '';

        },
        //Ordenamiento 1.Prioridad, luego 2.llegada (Por buburja)
        bubbleSort(procesos, tamanio) {
            if (tamanio == 1) return;
            let contador = 0;
            for (let i = 0; i < tamanio - 1; i++) {
                if (procesos[i].prioridad > procesos[i + 1].prioridad) {
                    let temp = procesos[i];
                    procesos[i] = procesos[i + 1];
                    procesos[i + 1] = temp;
                    this.swaps.push([procesos[i].id, procesos[i + 1].id, i, i + 1]);
                    contador++;
                } else if (procesos[i].llegada > procesos[i + 1].llegada && procesos[i].prioridad === procesos[i + 1].prioridad) {
                    let temp = procesos[i];
                    procesos[i] = procesos[i + 1];
                    procesos[i + 1] = temp;
                    this.swaps.push([procesos[i].id, procesos[i + 1].id, i, i + 1]);
                    contador++;
                }
            }
            if (contador == 0) {
                return;
            }
            this.bubbleSort(procesos, tamanio - 1);
        },
        //swaps putting style in the table
        swapAnimationSort(swaps) {
            setTimeout(() => {
                if (swaps.length == 0) {
                    return;
                }
                let [i, j, x, y] = swaps.shift();
                let outside = document.querySelector(`#${j}`);
                let insert = document.querySelector(`#${i}`);
                let inputs = document.querySelectorAll(`#${i} > td > input, #${j} > td > input`);

                outside.classList.add("moveRowOut");
                insert.classList.add("moveRowOut");

                for (const input of inputs) {
                    input.classList.add('see');
                }
                setTimeout(() => {
                    for (const input of inputs) {
                        input.classList.remove('see');
                    }
                    let temp = this.procesosView[x];

                    this.procesosView[x] = this.procesosView[y];
                    this.procesosView[y] = temp;
                    outside.classList.remove("moveRowOut");
                    insert.classList.remove("moveRowOut");

                    this.swapAnimationSort(swaps);
                }, this.TIMER);
            }, this.TIMER);
        },
        //Start the sorting if isn't sorted 
        sort() {
            if (this.isSorted) {
                return this.alertSorted();
            } else {
                this.bubbleSort(this.procesosBack, this.procesosBack.length);
                this.swapAnimationSort(this.swaps);

            }
            return this.isSorted = true;
        },
        //wait time in ms 
        wait: (ms) => {
            const start = Date.now();
            let now = start;
            while (now - start < ms) {
                now = Date.now();
            }
        },
        //valid a number param 
        isValidEdit(Valor) {
            var number = /[0-9]*/;
            let valid = true;

            if (!(number.test(Valor) && Valor != '')) {
                valid = false;
            }
        },
        //edit logic for process object
        edit(id, etiqueta, nuevoValor) {
            let indexProceso = document.getElementById(`${id}`).rowIndex - 1;
            console.log('dex ' + indexProceso + ' et ' + etiqueta + ' id ' + id);
            let input = nuevoValor;
            this.isSorted = false;
            switch (etiqueta) {
                case 'prioridad':
                    console.log(input);
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].prioridad = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                case 'tiempo':
                    console.log(input);
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].tiempo = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                case 'llegada':
                    console.log(input);
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].llegada = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                default:
                //Alerta de input invalido
            }
            this.procesosBack = JSON.parse(JSON.stringify(this.procesosView));
        },
        //Show alert if the process are sorted (using isSorted variable)
        alertSorted() {
            Swal.fire({
                icon: '',
                title: 'Oops...',
                text: 'Los procesos ya se encuentran ordenados',
            });
        },
        // Ejecuta un proceso disminuyendo el valor de tiempo recursivo
        ejecutarRecursivo(_actual) {
            if (_actual.tiempo > 0) {
                _actual.tiempo = _actual.tiempo - 1;
                _actual.procesado = _actual.procesado + 1;
                this.tiempoTotal += 1;
                this.ejecutarRecursivo(_actual);
            } else {
                //push a charDataFormat

                _actual.finished = true;
                this.finished.push(_actual);
                this.hasNext = false;
            }
            return;
        },
        // Envia a ejectuar un proceso en la pila
        proximoEjecutar() {
            this.running.push(this.procesosBack.shift());
            this.hasNext = true;
        },
        //Algoritmo de planeacion por prioridad
        priorityScheduling() {
            console.log(this.procesosBack);
            if (this.procesosBack.length > 0 || this.hasNext) {
                if (this.running.length === 0 && !this.hasNext) {
                    this.proximoEjecutar();
                    this.priorityScheduling();
                } else if (this.hasNext) {
                    this.ejecutarRecursivo(this.running.pop());
                    this.priorityScheduling();
                }
            } else if (this.procesosBack.length === 0 && !this.hasNext) {
                return console.log(`Terminados :)`);
            }
        },
        async start() {
            await this.sort();
            this.priorityScheduling(this.procesosBack);
            let inicio = 0;
            let counter = 0;
            const mySeries = this.chart.series[0];
            let categories = [];

            this.finished.forEach(element => {
                categories.push(`${element.id}`);
            });

            this.chart.yAxis[0].setCategories(categories);    

            this.finished.forEach(proceso => {
                setTimeout(() => {
                    mySeries.addPoint({
                        label: `${proceso.id}`,
                        y: counter,
                        x: inicio + proceso.tiempo,
                        x2: inicio + proceso.procesado
                    });
                    counter++;
                    inicio += proceso.procesado;
                }, 1000);
            });
        }
    }
});
app.mount("#app");

//modified
