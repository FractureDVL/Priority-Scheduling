export default class TableCellEdit{
    constructor(table){
        this.tbody = table.querySelector("tbody");
    }
    Init(){
        const tds = this.tbody.querySelectorAll('td');
        tds.forEach(td =>{
            td.setAttribute('contenteditable', true);
        td.addEventListener('click',(ev)=>{
            this.starEditing(td);
        })
        })
    }
    starEditing(td){

    }
    cancelEditing(td){}
    
    finishEditing(td){}
    
    inEditing(td){}
    createButton(){
        const toolbar = document.createElement('div')
        toolbar.innerHTML = `
        <button>Cancel</button>
        <button>Save</button>
        `
    }
}
