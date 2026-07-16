"use strict";

/*
=========================================================
ORGANIZADOR DE PRODUÇÃO SHOPEE / UPSELLER
APP.JS - PARTE 1/3

Responsável por:
- Cadastro dos produtos
- Leitura PDF UpSeller
- Leitura Excel/CSV Shopee
- Preparação dos dados

=========================================================
*/


/*
=========================================================
PDF.JS CONFIGURAÇÃO
=========================================================
*/

if (window.pdfjsLib) {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}



/*
=========================================================
CATÁLOGO DOS PRODUTOS

A chave principal é o SKU do UpSeller.

SKU
↓
Produto físico
↓
Quantidade de peças

=========================================================
*/


const CATALOG = {


    /*
    ============================
    REDONDA UNITÁRIA
    ============================
    */


    "228792214684": {

        model: "Redonda",
        color: "Branco",
        size: "25 cm",
        pieces: 1,
        detail: "Unitária"

    },


    "228792214678": {

        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 1,
        detail: "Unitária"

    },


    "292651491139": {

        model: "Redonda",
        color: "Preto",
        size: "30 cm",
        pieces: 1,
        detail: "Unitária"

    },


    "292651491140": {

        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 1,
        detail: "Unitária"

    },



    /*
    ============================
    KIT 2 REDONDA
    ============================
    */


    "209613874440": {

        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 2,
        detail: "Kit 2"

    },


    "445867399988": {

        model: "Redonda",
        color: "Branco",
        size: "15 cm",
        pieces: 2,
        detail: "Kit 2"

    },



    /*
    ============================
    KIT 3 REDONDA
    ============================
    */


    "430463424666": {

        model: "Redonda",
        color: "Branco",
        size: "20 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "430463424667": {

        model: "Redonda",
        color: "Preto",
        size: "20 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "430463424668": {

        model: "Redonda",
        color: "Branco",
        size: "25 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "430463424669": {

        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "430463424670": {

        model: "Redonda",
        color: "Preto",
        size: "30 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "430463424671": {

        model: "Redonda",
        color: "Preto",
        size: "25 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "216387569151": {

        model: "Redonda",
        color: "Branco",
        size: "16 cm",
        pieces: 3,
        detail: "Kit 3"

    },



    /*
    ============================
    DIAMANTE
    ============================
    */


    "360463511208": {

        model: "Diamante",
        color: "Branco",
        size: "20 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "360463511209": {

        model: "Diamante",
        color: "Branco",
        size: "25 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "360463511210": {

        model: "Diamante",
        color: "Branco",
        size: "30 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "360463511211": {

        model: "Diamante",
        color: "Preto",
        size: "20 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "360463511212": {

        model: "Diamante",
        color: "Preto",
        size: "25 cm",
        pieces: 3,
        detail: "Kit 3"

    },


    "360463511213": {

        model: "Diamante",
        color: "Preto",
        size: "30 cm",
        pieces: 3,
        detail: "Kit 3"

    }


};



/*
=========================================================
VARIÁVEIS GLOBAIS
=========================================================
*/


let selectedFile = null;

let lastProduction = null;



/*
=========================================================
FUNÇÕES BÁSICAS
=========================================================
*/


function get(id){

    return document.getElementById(id);

}



function setText(id,value){

    const element = get(id);

    if(element){

        element.textContent = value;

    }

}



function normalize(value){

    return String(value ?? "")
        .trim()
        .replace(/\s+/g," ");

}



function searchText(value){

    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/branc0/g,"branco")
        .trim();

}



function digits(value){

    return String(value ?? "")
        .replace(/\D/g,"");

}



function safe(value){

    return String(value ?? "")
        .replace(/[&<>"']/g,function(char){

            const map={

                "&":"&amp;",
                "<":"&lt;",
                ">":"&gt;",
                '"':"&quot;",
                "'":"&#039;"

            };

            return map[char];

        });

}



/*
=========================================================
LEITURA DO PDF UPSELLER
=========================================================

O PDF vem assim:

Pedido
Código interno
Título quebrado em várias linhas
SKU
Quantidade

=========================================================
*/


async function readPDF(file){


    const buffer =
        await file.arrayBuffer();



    const pdf =
        await pdfjsLib
        .getDocument({

            data:buffer

        })
        .promise;



    let lines=[];



    for(
        let pageNumber=1;
        pageNumber<=pdf.numPages;
        pageNumber++
    ){


        const page =
            await pdf.getPage(pageNumber);



        const content =
            await page.getTextContent();



        const items =
            content.items
            .map(item=>{

                return {

                    text:item.str,

                    x:item.transform[4],

                    y:item.transform[5]

                };

            });



        const rows={};



        items.forEach(item=>{


            const y =
                Math.round(item.y);



            if(!rows[y]){

                rows[y]=[];

            }


            rows[y].push(item);



        });



        Object.values(rows)
        .forEach(row=>{


            row.sort((a,b)=>a.x-b.x);


            const text =
                row
                .map(item=>item.text)
                .join(" ")
                .replace(/\s+/g," ")
                .trim();



            if(text){

                lines.push(text);

            }


        });


    }



    return parseUpSeller(lines);


}



/*
=========================================================
PARSER DO PDF

Transforma o PDF em pedidos

=========================================================
*/


function parseUpSeller(lines){


    const orders=[];


    const orderRegex =
        /^\d{12}[A-Z0-9]+$/;



    const skuRegex =
        /^\d{12}$/;



    let current=null;



    function save(){


        if(
            current &&
            current.order &&
            current.sku
        ){


            orders.push({

                order:current.order,

                sku:current.sku,

                title:
                    current.title.join(" "),

                qty:
                    current.qty || 1


            });


        }



        current=null;


    }





    lines.forEach(line=>{


        line =
            normalize(line);



        if(!line){

            return;

        }




        if(
            line.includes("Lista de") ||
            line.includes("Titulo") ||
            line.includes("Título") ||
            line==="SKU"
        ){

            return;

        }





        if(orderRegex.test(line)){


            save();


            current={

                order:line,

                title:[],

                sku:"",

                qty:1

            };


            return;


        }





        if(!current){

            return;

        }





        if(
            /^UP[A-Z0-9]+$/i.test(line)
        ){

            return;

        }





        if(skuRegex.test(line)){


            current.sku=line;

            return;


        }





        if(
            /^\d+$/.test(line)
        ){


            current.qty =
                Number(line);


            return;


        }





        current.title.push(line);



    });



    save();



    return orders;


}

// =====================================================
// PARTE 2/3
// MOTOR DE PRODUÇÃO
// =====================================================


/*
=========================================================
CRIA ESTRUTURA DA PRODUÇÃO
=========================================================
*/

function createProduction(){

    return {

        redonda:{

            Branco:{

                "15 cm":0,
                "16 cm":0,
                "20 cm":0,
                "25 cm":0,
                "30 cm":0

            },

            Preto:{

                "15 cm":0,
                "16 cm":0,
                "20 cm":0,
                "25 cm":0,
                "30 cm":0

            }

        },


        diamante:{

            Branco:{

                "20 cm":0,
                "25 cm":0,
                "30 cm":0

            },

            Preto:{

                "20 cm":0,
                "25 cm":0,
                "30 cm":0

            }

        },


        gancho:{

            Branco:0,

            Preto:0

        },


        outros:[]

    };

}




/*
=========================================================
PROCESSA PEDIDOS
=========================================================

Entrada:

[
 {
  sku:"430463424669",
  qty:2
 }
]


Saída:

Redonda
Branco
30 cm = 6


=========================================================
*/


function calculateProduction(rows){


    const production =
        createProduction();


    let totalPieces=0;


    let reviews=[];



    rows.forEach(order=>{


        const product =
            CATALOG[order.sku];



        /*
        SKU não cadastrado
        */


        if(!product){


            reviews.push({

                ...order,

                reason:
                "SKU não cadastrado"

            });


            return;

        }




        const quantity =
            Number(order.qty) || 1;



        const pieces =
            quantity *
            product.pieces;



        totalPieces += pieces;



        /*
        REDONDA
        */


        if(product.model==="Redonda"){


            production
            .redonda[product.color]
            [product.size] += pieces;


            return;


        }





        /*
        DIAMANTE
        */


        if(product.model==="Diamante"){


            production
            .diamante[product.color]
            [product.size] += pieces;


            return;


        }





        /*
        GANCHO
        */


        if(product.model==="Gancho"){


            production
            .gancho[product.color]
            += pieces;


            return;


        }





        /*
        OUTROS
        */


        production.outros.push({

            nome:
            product.description,

            quantidade:
            pieces

        });



    });





    return {

        production,

        totalPieces,

        reviews

    };


}





/*
=========================================================
LEITURA DE EXCEL / CSV
=========================================================
*/


async function readExcel(file){


    const buffer =
        await file.arrayBuffer();



    const workbook =
        XLSX.read(buffer,{

            type:"array"

        });



    const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];



    const rows =
        XLSX
        .utils
        .sheet_to_json(
            sheet,
            {
                defval:""
            }
        );



    return rows.map(row=>{


        return {


            order:

            row["ID do pedido"] ||
            row["Nº de Pedido"] ||
            row["Pedido"] ||
            "",



            sku:

            digits(

                row["SKU"] ||
                row["Número de referência SKU"] ||
                row["Model ID"] ||
                ""

            ),



            title:

            row["Nome do Produto"] ||
            "",



            qty:

            Number(

                row["Quantidade"] ||
                row["Qtd"] ||
                1

            )



        };


    });



}




/*
=========================================================
PROCESSA ARQUIVO
=========================================================
*/


async function processFile(file){


    let rows=[];



    const name =
        file.name.toLowerCase();



    if(
        name.endsWith(".pdf")
    ){


        rows =
            await readPDF(file);


    }


    else{


        rows =
            await readExcel(file);


    }





    const result =
        calculateProduction(rows);




    lastProduction =
        result;



    renderProduction(
        result.production,
        result.totalPieces
    );



    renderReviews(
        result.reviews
    );



    setText(
        "ordersMetric",
        rows.length
    );



    setText(
        "piecesMetric",
        result.totalPieces
    );



    setText(
        "reviewMetric",
        result.reviews.length
    );



}





/*
=========================================================
RENDERIZA PRODUÇÃO NA TELA
=========================================================
*/


function renderProduction(
    production,
    total
){



    /*
    TOTAL REDONDA
    */


    let redondaTotal=0;


    Object.values(
        production.redonda
    )
    .forEach(color=>{


        Object.values(color)
        .forEach(q=>{


            redondaTotal+=q;


        });


    });





    /*
    TOTAL DIAMANTE
    */


    let diamanteTotal=0;


    Object.values(
        production.diamante
    )
    .forEach(color=>{


        Object.values(color)
        .forEach(q=>{


            diamanteTotal+=q;


        });


    });





    const ganchoTotal =

        production.gancho.Branco +

        production.gancho.Preto;




    /*
    MOSTRA REDONDA
    */


    [
        "Branco",
        "Preto"

    ]
    .forEach(color=>{


        [

            "15 cm",
            "16 cm",
            "20 cm",
            "25 cm",
            "30 cm"

        ]
        .forEach(size=>{


            const id =
            "round" +
            color +
            size.replace(" ","");


            setText(

                id,

                production
                .redonda[color][size]

            );


        });



    });





    setText(
        "roundTotal",
        redondaTotal+" peças"
    );





    /*
    MOSTRA DIAMANTE
    */


    [
        "Branco",
        "Preto"

    ]
    .forEach(color=>{


        [

            "20 cm",
            "25 cm",
            "30 cm"

        ]
        .forEach(size=>{


            const id =
            "diamond" +
            color +
            size.replace(" ","");


            setText(

                id,

                production
                .diamante[color][size]

            );


        });


    });





    setText(

        "diamondTotal",

        diamanteTotal+" peças"

    );





    /*
    GANCHOS
    */


    setText(

        "hookWhite",

        production.gancho.Branco

    );


    setText(

        "hookBlack",

        production.gancho.Preto

    );


    setText(

        "hookTotal",

        ganchoTotal+" unidades"

    );





    /*
    MOSTRA RESULTADO
    */


    if(total>0){


        get("emptyState")
        .classList
        .add("hidden");



        get("productionResult")
        .classList
        .remove("hidden");



        get("roundPanel")
        .classList
        .remove("hidden");



    }



}

// =====================================================
// PARTE 3/3
// INTERFACE + EVENTOS
// =====================================================



/*
=========================================================
MOSTRA PRODUTOS COM ERRO
=========================================================
*/


function renderReviews(reviews){


    const body =
        get("reviewBody");


    if(!body){

        return;

    }


    body.innerHTML="";



    if(reviews.length===0){


        const empty =
            get("reviewEmpty");


        if(empty){

            empty.classList.remove(
                "hidden"
            );

        }


        return;

    }





    const empty =
        get("reviewEmpty");


    if(empty){

        empty.classList.add(
            "hidden"
        );

    }





    const table =
        get("reviewTableWrapper");


    if(table){

        table.classList.remove(
            "hidden"
        );

    }





    reviews.forEach(item=>{


        const tr =
            document.createElement(
                "tr"
            );



        tr.innerHTML = `

        <td>
        ${safe(item.order)}
        </td>

        <td>
        ${safe(item.sku)}
        </td>

        <td>
        ${safe(item.title)}
        </td>

        <td>
        ${safe(item.qty)}
        </td>

        <td class="warning">
        ${safe(item.reason)}
        </td>

        `;



        body.appendChild(tr);


    });


}







/*
=========================================================
SELEÇÃO DO ARQUIVO
=========================================================
*/


function selectFile(file){


    selectedFile=file;



    const button =
        get("processButton");



    if(button){

        button.disabled =
            !file;

    }



    const status =
        get("fileStatus");



    if(status){

        status.textContent =
            file

            ?

            "Arquivo selecionado: "
            +
            file.name

            :

            "Nenhum arquivo selecionado.";

    }



}








/*
=========================================================
BOTÃO PROCESSAR
=========================================================
*/


function setupProcess(){



    const button =
        get("processButton");



    if(!button){

        return;

    }



    button.addEventListener(
        "click",
        async function(){



            if(!selectedFile){

                alert(
                    "Selecione um arquivo primeiro."
                );

                return;

            }





            try{


                button.disabled=true;


                button.textContent =
                    "Processando...";



                await processFile(
                    selectedFile
                );



                button.textContent =
                    "Processar arquivo";



                button.disabled=false;



            }

            catch(error){


                console.error(
                    error
                );


                alert(
                    "Erro ao processar arquivo."
                );


                button.disabled=false;


                button.textContent =
                    "Processar arquivo";


            }



        }
    );


}









/*
=========================================================
INPUT DE ARQUIVO
=========================================================
*/


function setupFileInput(){



    const input =
        get("fileInput");



    if(!input){

        return;

    }



    input.addEventListener(
        "change",
        function(event){


            const file =
                event.target.files[0];



            selectFile(file);



        }
    );


}









/*
=========================================================
ARRASTAR ARQUIVO
=========================================================
*/


function setupDropzone(){


    const zone =
        get("dropzone");



    if(!zone){

        return;

    }




    [
        "dragenter",
        "dragover"

    ]
    .forEach(event=>{


        zone.addEventListener(
            event,
            function(e){

                e.preventDefault();


                zone.classList.add(
                    "dragging"
                );


            }
        );


    });





    [
        "dragleave",
        "drop"

    ]
    .forEach(event=>{


        zone.addEventListener(
            event,
            function(e){

                e.preventDefault();


                zone.classList.remove(
                    "dragging"
                );


            }
        );


    });





    zone.addEventListener(
        "drop",
        function(event){


            const file =
                event.dataTransfer
                .files[0];



            if(file){


                selectFile(file);


            }



        }
    );



}









/*
=========================================================
BOTÃO LIMPAR
=========================================================
*/


function setupClear(){


    const button =
        get("clearButton");



    if(!button){

        return;

    }



    button.addEventListener(
        "click",
        function(){



            selectedFile=null;



            const input =
                get("fileInput");



            if(input){

                input.value="";

            }




            const status =
                get("fileStatus");


            if(status){

                status.textContent =
                "Nenhum arquivo selecionado.";

            }




            get("productionResult")
            .classList
            .add(
                "hidden"
            );



            get("emptyState")
            .classList
            .remove(
                "hidden"
            );




        }
    );



}










/*
=========================================================
BOTÃO IMPRIMIR
=========================================================
*/


function setupPrint(){


    const button =
        get("printButton");



    if(!button){

        return;

    }



    button.addEventListener(
        "click",
        function(){


            window.print();


        }
    );



}









/*
=========================================================
BOTÃO EXEMPLO
=========================================================
*/


function setupDemo(){


    const button =
        get("demoButton");



    if(!button){

        return;

    }



    button.addEventListener(
        "click",
        function(){



            const demo=[



                {

                order:
                "DEMO001",

                sku:
                "430463424669",

                title:
                "Kit 3 Redonda",

                qty:2


                },



                {

                order:
                "DEMO002",

                sku:
                "292651491140",

                title:
                "Unitária",

                qty:3


                }



            ];




            const result =
                calculateProduction(
                    demo
                );




            renderProduction(
                result.production,
                result.totalPieces
            );




            setText(
                "ordersMetric",
                demo.length
            );



            setText(
                "piecesMetric",
                result.totalPieces
            );



        }
    );



}











/*
=========================================================
INICIAR SISTEMA
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    function(){



        setupFileInput();



        setupDropzone();



        setupProcess();



        setupClear();



        setupPrint();



        setupDemo();



        console.log(
            "Sistema de produção carregado."
        );



    }
);
