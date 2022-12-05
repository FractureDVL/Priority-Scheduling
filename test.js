let array = [
    { c: 5 },
    { c: 3 },
    { c: 5 }]

async function delay() {
    let nuevo = array.pop();
    
    await new Promise(resolve => setInterval(() => {
            if(nuevo.c > 0 ){
                console.log(`c: ${nuevo.c}`);
                nuevo.c = nuevo.c - 1;
            }
            else clearInterval(ejecutando);
        },1000, resolve)
    );
}

let run = async () => {
    await delay();
    console.log('Terminado');
    await delay();
    
}

console.log(run());