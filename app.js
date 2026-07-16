"use strict";

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


const SKU = {

"228792214684":{
modelo:"Redonda",
cor:"Branco",
medida:25,
pecas:1
},

"228792214678":{
modelo:"Redonda",
cor:"Branco",
medida:30,
pecas:1
},
  
"292651491140":{
modelo:"Diamante",
cor:"Branco",
medida:30,
pecas:1

},

"209613874440":{
modelo:"Redonda",
cor:"Branco",
medida:30,
pecas:2
},

"445867399988":{
modelo:"Redonda",
cor:"Branco",
medida:15,
pecas:2
},

"430463424668":{
modelo:"Redonda",
cor:"Branco",
medida:25,
pecas:3
},

"430463424669":{
modelo:"Redonda",
cor:"Branco",
medida:30,
pecas:3
},

"360463511208":{
modelo:"Diamante",
cor:"Branco",
medida:20,
pecas:3
},

"360463511209":{
modelo:"Diamante",
cor:"Branco",
medida:25,
pecas:3
},

"360463511210":{
modelo:"Diamante",
cor:"Branco",
medida:30,
pecas:3
},

"360463511211":{
modelo:"Diamante",
cor:"Preto",
medida:20,
pecas:3
},

"360463511212":{
modelo:"Diamante",
cor:"Preto",
medida:25,
pecas:3
},

"360463511213":{
modelo:"Diamante",
cor:"Preto",
medida:30,
pecas:3
}

};


let arquivo = null;



function id(nome){

return document.getElementById(nome);

}



function texto(nome,valor){

let el=id(nome);

if(el){

el.textContent=valor;

}

}



/*
==========================
LER PDF
==========================
*/


async function lerPDF(file){


let buffer =
await file.arrayBuffer();


let pdf =
await pdfjsLib
.getDocument({
data:buffer
})
.promise;



let textoPDF="";


for(
let i=1;
i<=pdf.numPages;
i++
){

let pagina =
await pdf.getPage(i);


let conteudo =
await pagina.getTextContent();


conteudo.items.forEach(item=>{

textoPDF += " " + item.str;

});


}



let skus =
textoPDF.match(/\d{12}/g);



if(!skus){

throw new Error(
"Nenhum SKU encontrado"
);

}



return skus.map(sku=>({

sku:sku,
qtd:1

}));

}



/*
==========================
CALCULAR
==========================
*/


function calcular(lista){


let resultado={

redonda:{},

diamante:{}

};


let total=0;



lista.forEach(item=>{


let produto =
SKU[item.sku];


if(!produto){

return;

}



let quantidade =
produto.pecas *
item.qtd;


total += quantidade;



let chave =
produto.cor+"_"+produto.medida;



if(produto.modelo==="Redonda"){


if(!resultado.redonda[chave]){

resultado.redonda[chave]=0;

}


resultado.redonda[chave]+=quantidade;


}



if(produto.modelo==="Diamante"){


if(!resultado.diamante[chave]){

resultado.diamante[chave]=0;

}


resultado.diamante[chave]+=quantidade;


}



});



return {
resultado,
total
};


}



/*
==========================
MOSTRAR
==========================
*/


function mostrar(dados){


let r =
dados.resultado;



texto(
"ordersMetric",
12
);


texto(
"piecesMetric",
dados.total
);



texto(
"reviewMetric",
0
);





// REDONDA BRANCO


texto(
"roundWhite15",
r.redonda["Branco_15"] || 0
);


texto(
"roundWhite25",
r.redonda["Branco_25"] || 0
);


texto(
"roundWhite30",
r.redonda["Branco_30"] || 0
);





let totalRedonda =

(r.redonda["Branco_15"]||0)+
(r.redonda["Branco_25"]||0)+
(r.redonda["Branco_30"]||0);



texto(
"roundWhiteTotal",
totalRedonda
);



texto(
"roundTotal",
totalRedonda+" peças"
);





// DIAMANTE


texto(
"diamondWhite20",
r.diamante["Branco_20"] || 0
);


texto(
"diamondWhite25",
r.diamante["Branco_25"] || 0
);


texto(
"diamondWhite30",
r.diamante["Branco_30"] || 0
);

  texto(
"diamondWhiteTotal",
(r.diamante["Branco_20"] || 0) +
(r.diamante["Branco_25"] || 0) +
(r.diamante["Branco_30"] || 0)
);


texto(
"diamondBlackTotal",
(r.diamante["Preto_20"] || 0) +
(r.diamante["Preto_25"] || 0) +
(r.diamante["Preto_30"] || 0)
);


texto(
"diamondBlack20",
r.diamante["Preto_20"] || 0
);


texto(
"diamondBlack25",
r.diamante["Preto_25"] || 0
);


texto(
"diamondBlack30",
r.diamante["Preto_30"] || 0
);



let totalDiamante =

(r.diamante["Branco_20"] || 0) +
(r.diamante["Branco_25"] || 0) +
(r.diamante["Branco_30"] || 0) +
(r.diamante["Preto_20"] || 0) +
(r.diamante["Preto_25"] || 0) +
(r.diamante["Preto_30"] || 0);

Object.values(r.diamante)
.reduce(
(a,b)=>a+b,
0
);



texto(
"diamondTotal",
totalDiamante+" peças"
);



id("emptyState")
.classList.add("hidden");


id("productionResult")
.classList.remove("hidden");


}



/*
==========================
PROCESSAR
==========================
*/


async function processar(){


let pedidos =
await lerPDF(arquivo);



let calculo =
calcular(pedidos);



mostrar(calculo);



}





/*
==========================
EVENTOS
==========================
*/


id("fileInput")
.addEventListener(
"change",
function(e){


arquivo =
e.target.files[0];


texto(
"fileStatus",
arquivo.name
);


id("processButton").disabled=false;


});



id("processButton")
.addEventListener(
"click",
processar
);



id("clearButton")
.addEventListener(
"click",
()=>{

location.reload();

});


id("printButton")
.addEventListener(
"click",
()=>{

window.print();

});
