"use strict";

/* =====================================
   PRODUÇÃO SHOPEE / UPSELLER
===================================== */


/* PDF WORKER */
if(window.pdfjsLib){

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}



/* =========================
CATÁLOGO SKU
========================= */

const produtos = {

"228792214684":{
modelo:"Redonda",
cor:"Branco",
medida:"25 cm",
pecas:1
},

"228792214678":{
modelo:"Redonda",
cor:"Branco",
medida:"30 cm",
pecas:1
},

"292651491140":{
modelo:"Redonda",
cor:"Branco",
medida:"30 cm",
pecas:1
},

"209613874440":{
modelo:"Redonda",
cor:"Branco",
medida:"30 cm",
pecas:2
},

"445867399988":{
modelo:"Redonda",
cor:"Branco",
medida:"15 cm",
pecas:2
},

"430463424668":{
modelo:"Redonda",
cor:"Branco",
medida:"25 cm",
pecas:3
},

"430463424669":{
modelo:"Redonda",
cor:"Branco",
medida:"30 cm",
pecas:3
},

"360463511208":{
modelo:"Diamante",
cor:"Branco",
medida:"20 cm",
pecas:3
},

"360463511209":{
modelo:"Diamante",
cor:"Branco",
medida:"25 cm",
pecas:3
},

"360463511210":{
modelo:"Diamante",
cor:"Branco",
medida:"30 cm",
pecas:3
},

"360463511211":{
modelo:"Diamante",
cor:"Preto",
medida:"20 cm",
pecas:3
},

"360463511212":{
modelo:"Diamante",
cor:"Preto",
medida:"25 cm",
pecas:3
},

"360463511213":{
modelo:"Diamante",
cor:"Preto",
medida:"30 cm",
pecas:3
}

};



let arquivoSelecionado=null;



function id(x){

return document.getElementById(x);

}



function texto(id,value){

let el=document.getElementById(id);

if(el){

el.textContent=value;

}

}



/* =========================
LEITURA PDF
========================= */


async function lerPDF(file){

let buffer =
await file.arrayBuffer();


let pdf =
await pdfjsLib.getDocument({
data:buffer
}).promise;


let linhas=[];


for(
let p=1;
p<=pdf.numPages;
p++
){

let pagina =
await pdf.getPage(p);


let conteudo =
await pagina.getTextContent();


conteudo.items.forEach(item=>{

let t =
item.str.trim();

if(t){

linhas.push(t);

}

});


}


return separarPedidos(linhas);


}




function separarPedidos(linhas){


let pedidos=[];


let atual=null;



for(let linha of linhas){


linha =
linha.trim();



/* pedido */

if(
/^260\d+[A-Z0-9]+$/i.test(linha)
){


if(atual){

pedidos.push(atual);

}



atual={

pedido:linha,
sku:"",
qtd:1

};


continue;


}



/* SKU */

if(
/^\d{12}$/.test(linha)
){


if(atual){

atual.sku=linha;

}


continue;


}



/* quantidade */

if(
/^\d+$/.test(linha)
){


if(atual){

atual.qtd=
Number(linha);

}


}


}



if(atual){

pedidos.push(atual);

}



return pedidos;


}






/* =========================
CALCULO
========================= */


function calcular(pedidos){


let resultado={

redonda:{},

diamante:{}

};



let total=0;


pedidos.forEach(p=>{


let produto =
produtos[p.sku];



if(!produto){

return;

}



let qtd =
p.qtd *
produto.pecas;


total+=qtd;



let chave =
produto.cor+
" "+
produto.medida;



if(!resultado[produto.modelo]){

resultado[produto.modelo]={};

}



if(!resultado[produto.modelo][chave]){

resultado[produto.modelo][chave]=0;

}



resultado[produto.modelo][chave]+=qtd;



});



return {

resultado,
total

};


}






/* =========================
MOSTRAR NA TELA
========================= */


function mostrar(dados){



texto(
"ordersMetric",
dados.pedidos
);



texto(
"piecesMetric",
dados.total
);



texto(
"reviewMetric",
0
);



let r =
dados.resultado;



/* redonda */

if(r.Redonda){


Object.keys(r.Redonda)
.forEach(k=>{


let partes=k.split(" ");


let cor=partes[0];

let medida=
partes[1]+" "+partes[2];



if(cor==="Branco"){


if(medida==="15 cm")
texto("roundWhite15",
r.Redonda[k]);


if(medida==="20 cm")
texto("roundWhite20",
r.Redonda[k]);


if(medida==="25 cm")
texto("roundWhite25",
r.Redonda[k]);


if(medida==="30 cm")
texto("roundWhite30",
r.Redonda[k]);



}


});



}





/* diamante */

if(r.Diamante){


Object.keys(r.Diamante)
.forEach(k=>{


let partes=k.split(" ");

let cor=partes[0];

let medida=
partes[1]+" "+partes[2];


if(cor==="Branco"){


if(medida==="20 cm")
texto(
"diamondWhite20",
r.Diamante[k]
);


if(medida==="25 cm")
texto(
"diamondWhite25",
r.Diamante[k]
);


if(medida==="30 cm")
texto(
"diamondWhite30",
r.Diamante[k]
);



}



});


}



id("emptyState")
.classList.add("hidden");


id("productionResult")
.classList.remove("hidden");


}





/* =========================
PROCESSAR
========================= */


async function processar(){


let pedidos;


if(
arquivoSelecionado.name
.toLowerCase()
.endsWith(".pdf")
){


pedidos =
await lerPDF(
arquivoSelecionado
);


}else{


alert(
"Por enquanto teste usando o PDF UpSeller."
);

return;

}



let calc =
calcular(pedidos);


mostrar({

pedidos:
pedidos.length,

total:
calc.total,

resultado:
calc.resultado

});



}





/* =========================
EVENTOS
========================= */


id("fileInput")
.addEventListener(
"change",
function(e){

arquivoSelecionado =
e.target.files[0];


texto(
"fileStatus",
"Arquivo selecionado: "+
arquivoSelecionado.name
);


id("processButton")
.disabled=false;


});



id("processButton")
.addEventListener(
"click",
processar
);



id("clearButton")
.addEventListener(
"click",
function(){

location.reload();

});



id("printButton")
.addEventListener(
"click",
function(){

window.print();

});



console.log(
"Sistema produção carregado"
);
