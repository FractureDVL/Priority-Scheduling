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
            procesosView: [],
            editing: false,
            show: false,
            //Procesos ordernados en sort
            procesosBack: [],
            //Procesos ejecutando
            running: [],
            //Procesos pausados
            stoped: [],
            //Procesos terminados
            finished: [],
            //Save swaps
            swaps: [],
            TIMER: 500,
            tiempoTotal: 0,
            isRunning: false,
            hasNext: false,
            //current
            current: null,
            isSorted: false,
            chart: null,
            categoriesProcess: [],
            //burst the time execution process
            bursted: false,
            //Flags for pseudocode
            pointData: [],
            isShowingData: false
        }
    },
    mounted() {
        this.mountChart();
    },
    computed: {
        //Generador para el proximo id
        newId: function name(params) {
            return `P${this.procesosView.length + 1}`;
        }
    },
    methods: {
        clear() {
            this.procesosBack = []
            this.procesosView = []
        },
        //Agrega una fila con nuevo un nuevo procesos ***
        add() {
            var nuevo = document.querySelectorAll('tr.newProcess input.input-new');
            this.show = this.show ? '' : this.show = true;
            var nproc = [nuevo[0].value, nuevo[1].value, nuevo[2].value];
            //Clases
            console.log(this.validArrivalTime(nproc));
            if (this.validArrivalTime(nproc)) {
                if (this.valid(nproc)) {
                    let a = new Proceso(this.newId, nuevo[2].valueAsNumber, nuevo[1].valueAsNumber, nuevo[0].valueAsNumber, 0, false, false, false);
                    let b = new Proceso(this.newId, nuevo[2].valueAsNumber, nuevo[1].valueAsNumber, nuevo[0].valueAsNumber, 0, false, false, false);

                    this.procesosView.push(a);
                    this.procesosBack.push(b);
                    this.isSorted = false;
                    this.bursted = false;
                    this.isShowingData = true;

                    nuevo[0].value = '';
                    nuevo[1].value = '';
                    nuevo[2].value = '';
                }
                else {
                    Swal.fire({
                        icon: '',
                        title: 'Oops...',
                        text: 'Rellene todos los campos.',
                    });
                }
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Este valor de llegada ya esta en uso.',
                });
            }
        },
        mountChart() {
            let newChart = new Highcharts.chart('container', {
                chart: {
                    type: 'xrange',
                    className: 'ganttChart',
                    backgroundColor: "#263159",
                    borderRadius: 5,
                    padding: 20
                },
                title: {
                    text: 'Finished processes',
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
                    data: this.pointData
                }]
            });
            this.chart = newChart;
            this.isShowingData = true;
        },
        //Load the process example
        chargeExample() {
            let example = [
                new Proceso('P1', 2, 7, 5, 0, false, false, false), // 4
                new Proceso('P2', 1, 7, 4, 0, false, false, false), // 3
                new Proceso('P3', 6, 3, 5, 0, false, false, false), // 2
                new Proceso('P4', 0, 7, 4, 0, false, false, false), // 1
                new Proceso('P5', 3, 3, 3, 0, false, false, false)  // 5
            ];
            this.procesosBack = JSON.parse(JSON.stringify(example));
            this.procesosView = JSON.parse(JSON.stringify(example));
        },
        //Valida los datos de entrada en los campos
        valid(arr) {
            const number = /[0-9]*/;
            let valid = true;
            for (let i = 0; i < arr.length; i++) {
                if (!(number.test(arr[i])) || arr[i] === "") {
                    valid = false;
                }
            }

            return valid;
        },
        validArrivalTime(arr) {
            let valid = true;
            for (let i = 0; i < this.procesosBack.length; i++) {
                console.log(arr[1] + "  " + this.procesosBack[i].llegada);
                if (arr[2] == this.procesosBack[i].llegada) {
                    valid = false;
                }
            }
            return valid;
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
                    return this.bursted = true;
                }
                let [i, j, x, y] = swaps.shift();
                let outside = document.querySelector(`#${j}`);
                let insert = document.querySelector(`#${i}`);
                let inputs = document.querySelectorAll(`#${i} > td > input, #${j} > td > input`);

                // outside.classList.add("moveRowOut");
                // insert.classList.add("moveRowOut");

                for (const input of inputs) {
                    // input.classList.add('see');
                }
                setTimeout(() => {
                    for (const input of inputs) {
                        input.classList.remove('see');
                    }
                    // let temp = this.procesosView[x];

                    // this.procesosView[x] = this.procesosView[y];
                    // this.procesosView[y] = temp;
                    // outside.classList.remove("moveRowOut");
                    // insert.classList.remove("moveRowOut");

                    this.swapAnimationSort(swaps);
                }, 0);
            }, 0);
        },
        //Start the sorting if isn't sorted 
        sort() {
            if (this.procesosBack.length > 0) {
                if (this.isSorted) {
                    return this.alertSorted();
                } else {
                    this.bubbleSort(this.procesosBack, this.procesosBack.length);
                    this.swapAnimationSort(this.swaps);
                    this.bursted = true;

                }
                return this.isSorted = true;
            }
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
            let input = nuevoValor;
            this.isSorted = false;
            switch (etiqueta) {
                case 'prioridad':
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].prioridad = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                case 'tiempo':
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].tiempo = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                case 'llegada':
                    if (this.isValidEdit(input)) {
                        this.procesosView[indexProceso].llegada = input;
                        console.log("Se ha actualizado un valor");
                    }
                    break;
                default:
                //Alerta de input invalido
            }
            this.procesosBack = JSON.parse(JSON.stringify(this.procesosView));
            this.clearChart();
            this.isShowingData = true;
            this.bursted = false;
        },
        clearChart() {
            this.chart.destroy();
            this.pointData.splice(0, this.pointData.length);
            this.finished.splice(0, this.finished.length);
            this.mountChart();
        },
        //Show alert if the process are sorted (using isSorted variable)
        alertSorted() {
            Swal.fire({
                icon: '',
                title: 'Oops...',
                text: 'Los procesos ya se encuentran ordenados',
            });
        },
        switchMode() {
            if (this.noPreEmptive === true) {
                this.preEmptive = false;
                this.noPreEmptive = true;
            }
            if(this.preEmptive === true){
                this.noPreEmptive = false;
                this.preEmptive = true;
            }
        },
        // Ejecuta un proceso disminuyendo el valor de tiempo recursivo
        ejecutarRecursivo(_actual) {
            if (_actual.tiempo > 0) {
                _actual.tiempo = _actual.tiempo - 1;
                _actual.procesado = _actual.procesado + 1;
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
        burstAnimation() {
            let animate = JSON.parse(JSON.stringify(this.finished));
            let counter = animate.length;

            for (let i = 0; i < counter; i++) {

            }
        },
        chargePoints() {
            let length = this.finished.length;
            let cX = 0;
            let points = [];
            for (let i = 0; i < length; i++) {
                let process = this.finished.shift();
                let counter = process.procesado;
                for (let j = 0; j < counter; j++) {
                    let data = {
                        label: `${process.id}`,
                        y: i,
                        x: cX,
                        x2: cX + 1
                    }
                    points.push(data);
                    cX++;
                }
            }
            return points;
        },
        indexProcess(arr, str) {
            let index = 0;
            let c = 0;
            arr.forEach(element => {
                if (str === element.id) {
                    index = c;
                }
                c++;
            });
            return index;
        },
        async startNoPreemptive() {
            this.clearChart();
            await this.sort();
            this.priorityScheduling(this.procesosBack);
            let categories = [];

            this.finished.forEach(element => {
                categories.push(`${element.id}`);
            });

            this.chart.yAxis[0].setCategories(categories);

            let mySeries = this.chart.series[0];
            let data = this.chargePoints();
            let last = 0;
            let lengthData = data.length;

            let interval = setInterval(() => {
                if (this.bursted) {
                    if (lengthData > last) {
                        let dataRow = data.shift();
                        let row = document.querySelector(`#${dataRow.label}`);
                        row.classList.add("focusedColorRow");

                        let rowInput = document.querySelectorAll(`#${dataRow.label} > td:nth-child(3) > input`)[0];
                        rowInput.classList.add("focusedColorRowInput");
                        setTimeout(() => {
                            let index = this.indexProcess(this.procesosView, dataRow.label);
                            this.procesosView[index].tiempo -= 1;
                            this.tiempoTotal++;
                            row.classList.remove("focusedColorRow");
                            rowInput.classList.remove("focusedColorRowInput");
                        }, 500);
                        
                        mySeries.addPoint(dataRow);
                    } else {
                        interval.clearInterval;
                    }
                    last++;
                }
            }, 800);
            this.bursted = false;
        }
    }
});

app.mount("#app");