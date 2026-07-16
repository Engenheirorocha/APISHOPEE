"use strict";

/* =====================================================
   CONFIGURAÇÃO
===================================================== */

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

/* =====================================================
   CATÁLOGO DE SKUS
===================================================== */

const CATALOGO = {
  /* Unitárias redondas */

  "228792214684": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 25,
    pecasPorVenda: 1
  },

  "228792214678": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 30,
    pecasPorVenda: 1
  },

  "292651491139": {
    modelo: "Redonda",
    cor: "Preto",
    medida: 30,
    pecasPorVenda: 1
  },

  "292651491140": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 30,
    pecasPorVenda: 1
  },

  /* Kits com 2 redondas */

  "209613874440": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 30,
    pecasPorVenda: 2
  },

  "445867399988": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 15,
    pecasPorVenda: 2
  },

  /* Kits com 3 redondas */

  "430463424666": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 20,
    pecasPorVenda: 3
  },

  "430463424667": {
    modelo: "Redonda",
    cor: "Preto",
    medida: 20,
    pecasPorVenda: 3
  },

  "430463424668": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 25,
    pecasPorVenda: 3
  },

  "430463424669": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 30,
    pecasPorVenda: 3
  },

  "430463424670": {
    modelo: "Redonda",
    cor: "Preto",
    medida: 30,
    pecasPorVenda: 3
  },

  "430463424671": {
    modelo: "Redonda",
    cor: "Preto",
    medida: 25,
    pecasPorVenda: 3
  },

  "216387569151": {
    modelo: "Redonda",
    cor: "Branco",
    medida: 16,
    pecasPorVenda: 3
  },

  /* Kits com 3 diamante */

  "360463511208": {
    modelo: "Diamante",
    cor: "Branco",
    medida: 20,
    pecasPorVenda: 3
  },

  "360463511209": {
    modelo: "Diamante",
    cor: "Branco",
    medida: 25,
    pecasPorVenda: 3
  },

  "360463511210": {
    modelo: "Diamante",
    cor: "Branco",
    medida: 30,
    pecasPorVenda: 3
  },

  "360463511211": {
    modelo: "Diamante",
    cor: "Preto",
    medida: 20,
    pecasPorVenda: 3
  },

  "360463511212": {
    modelo: "Diamante",
    cor: "Preto",
    medida: 25,
    pecasPorVenda: 3
  },

  "360463511213": {
    modelo: "Diamante",
    cor: "Preto",
    medida: 30,
    pecasPorVenda: 3
  }
};

/* =====================================================
   ESTADO
===================================================== */

let arquivoSelecionado = null;

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function elemento(id) {
  return document.getElementById(id);
}

function definirTexto(id, valor) {
  const alvo = elemento(id);

  if (alvo) {
    alvo.textContent = valor;
  }
}

function limparTexto(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizar(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/branc0/g, "branco")
    .replace(/\s+/g, " ")
    .trim();
}

function somenteNumeros(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function protegerHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caractere => {
    const mapa = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return mapa[caractere];
  });
}

function mostrarElemento(id, mostrar) {
  const alvo = elemento(id);

  if (alvo) {
    alvo.classList.toggle("hidden", !mostrar);
  }
}

/* =====================================================
   LEITURA DO PDF UPSELLER
===================================================== */

async function extrairItensPdf(arquivo) {
  if (!window.pdfjsLib) {
    throw new Error("A biblioteca PDF não foi carregada.");
  }

  const buffer = await arquivo.arrayBuffer();

  const pdf = await pdfjsLib
    .getDocument({
      data: buffer
    })
    .promise;

  const itens = [];

  for (
    let numeroPagina = 1;
    numeroPagina <= pdf.numPages;
    numeroPagina++
  ) {
    const pagina = await pdf.getPage(numeroPagina);
    const conteudo = await pagina.getTextContent();

    conteudo.items.forEach(item => {
      const texto = limparTexto(item.str);

      if (texto) {
        itens.push(texto);
      }
    });
  }

  return itens;
}

function interpretarPdfUpSeller(itens) {
  const pedidos = [];

  const regexPedido = /\b\d{6}[A-Z0-9]{6,}\b/i;
  const regexSku = /\b\d{12}\b/;
  const regexCodigoInterno = /\bUP[A-Z0-9]+\b/i;

  let pedidoAtual = null;

  function salvarPedidoAtual() {
    if (
      pedidoAtual &&
      pedidoAtual.pedido &&
      pedidoAtual.sku
    ) {
      pedidos.push({
        pedido: pedidoAtual.pedido,
        sku: pedidoAtual.sku,
        quantidade:
          pedidoAtual.quantidade > 0
            ? pedidoAtual.quantidade
            : 1,
        titulo: pedidoAtual.titulo.join(" ")
      });
    }

    pedidoAtual = null;
  }

  for (const itemOriginal of itens) {
    let item = limparTexto(itemOriginal);

    if (!item) {
      continue;
    }

    const pedidoEncontrado = item.match(regexPedido);

    if (pedidoEncontrado) {
      salvarPedidoAtual();

      pedidoAtual = {
        pedido: pedidoEncontrado[0],
        sku: "",
        quantidade: 0,
        titulo: [],
        esperandoQuantidade: false
      };

      item = item
        .replace(pedidoEncontrado[0], "")
        .replace(regexCodigoInterno, "")
        .replace(/^\d+\s*/, "")
        .trim();

      if (item) {
        pedidoAtual.titulo.push(item);
      }

      continue;
    }

    if (!pedidoAtual) {
      continue;
    }

    if (regexCodigoInterno.test(item)) {
      item = item
        .replace(regexCodigoInterno, "")
        .trim();

      if (!item) {
        continue;
      }
    }

    const skuEncontrado = item.match(regexSku);

    if (skuEncontrado) {
      pedidoAtual.sku = skuEncontrado[0];
      pedidoAtual.esperandoQuantidade = true;

      const depoisSku = item
        .replace(skuEncontrado[0], "")
        .trim();

      const quantidadeNaMesmaLinha =
        depoisSku.match(/\b([1-9]\d*)\b/);

      if (quantidadeNaMesmaLinha) {
        pedidoAtual.quantidade =
          Number(quantidadeNaMesmaLinha[1]);

        pedidoAtual.esperandoQuantidade = false;
      }

      const antesSku = item
        .split(skuEncontrado[0])[0]
        .trim();

      if (antesSku) {
        pedidoAtual.titulo.push(antesSku);
      }

      continue;
    }

    if (
      pedidoAtual.esperandoQuantidade &&
      /^\d+$/.test(item)
    ) {
      const quantidade = Number(item);

      if (
        Number.isInteger(quantidade) &&
        quantidade >= 1 &&
        quantidade <= 100
      ) {
        pedidoAtual.quantidade = quantidade;
        pedidoAtual.esperandoQuantidade = false;

        continue;
      }
    }

    const textoNormalizado = normalizar(item);

    const ignorar =
      textoNormalizado.includes("lista de separacao") ||
      textoNormalizado.includes("qtd. de pedidos") ||
      textoNormalizado.includes("qtd. de sku") ||
      textoNormalizado.includes("total(itens)") ||
      textoNormalizado.includes("titulo & variacao") ||
      textoNormalizado.includes("imprimir - upseller") ||
      textoNormalizado.includes("app.upseller.com") ||
      textoNormalizado === "sku" ||
      textoNormalizado === "qtd." ||
      textoNormalizado === "#";

    if (!ignorar && !pedidoAtual.sku) {
      pedidoAtual.titulo.push(item);
    }
  }

  salvarPedidoAtual();

  return pedidos;
}

async function lerPdfUpSeller(arquivo) {
  const itens = await extrairItensPdf(arquivo);
  const pedidos = interpretarPdfUpSeller(itens);

  if (!pedidos.length) {
    throw new Error(
      "Nenhum pedido foi encontrado no PDF."
    );
  }

  return pedidos;
}

/* =====================================================
   LEITURA EXCEL / CSV
===================================================== */

function encontrarColuna(linha, nomes) {
  const colunas = Object.entries(linha);

  for (const nomeProcurado of nomes) {
    const nomeNormalizado = normalizar(nomeProcurado);

    const encontrada = colunas.find(([nomeColuna, valor]) => {
      return (
        normalizar(nomeColuna) === nomeNormalizado &&
        valor !== "" &&
        valor !== null &&
        valor !== undefined
      );
    });

    if (encontrada) {
      return encontrada[1];
    }
  }

  return "";
}

async function lerPlanilha(arquivo) {
  if (!window.XLSX) {
    throw new Error(
      "A biblioteca de Excel não foi carregada."
    );
  }

  const buffer = await arquivo.arrayBuffer();

  const pasta = XLSX.read(buffer, {
    type: "array"
  });

  const nomeAba =
    pasta.SheetNames.find(nome => {
      return normalizar(nome) === "orders";
    }) || pasta.SheetNames[0];

  const planilha = pasta.Sheets[nomeAba];

  const linhas = XLSX.utils.sheet_to_json(planilha, {
    defval: "",
    raw: false
  });

  return linhas
    .map(linha => {
      return {
        pedido: limparTexto(
          encontrarColuna(linha, [
            "ID do pedido",
            "Nº de Pedido",
            "Número do pedido",
            "Pedido"
          ])
        ),

        sku: somenteNumeros(
          encontrarColuna(linha, [
            "SKU",
            "Número de referência SKU",
            "Nº de referência SKU",
            "Model ID"
          ])
        ),

        quantidade:
          Number(
            encontrarColuna(linha, [
              "Quantidade",
              "Qtd.",
              "Qtd"
            ])
          ) || 1,

        titulo: limparTexto(
          encontrarColuna(linha, [
            "Nome do Produto",
            "Título do produto"
          ])
        )
      };
    })
    .filter(linha => {
      return linha.pedido || linha.sku || linha.titulo;
    });
}

/* =====================================================
   ESTRUTURA DA PRODUÇÃO
===================================================== */

function criarProducaoVazia() {
  return {
    redonda: {
      Branco: {
        15: 0,
        16: 0,
        20: 0,
        25: 0,
        30: 0
      },

      Preto: {
        15: 0,
        16: 0,
        20: 0,
        25: 0,
        30: 0
      }
    },

    diamante: {
      Branco: {
        20: 0,
        25: 0,
        30: 0
      },

      Preto: {
        20: 0,
        25: 0,
        30: 0
      }
    },

    gancho: {
      Branco: 0,
      Preto: 0
    }
  };
}

/* =====================================================
   CÁLCULO
===================================================== */

function calcularProducao(pedidos) {
  const producao = criarProducaoVazia();
  const revisoes = [];
  const pedidosUnicos = new Set();

  let totalPecas = 0;

  pedidos.forEach(pedido => {
    if (pedido.pedido) {
      pedidosUnicos.add(pedido.pedido);
    }

    const produto = CATALOGO[pedido.sku];

    if (!produto) {
      revisoes.push({
        ...pedido,
        motivo: pedido.sku
          ? "SKU não cadastrado"
          : "SKU não encontrado"
      });

      return;
    }

    const quantidadeVendida =
      Math.max(
        1,
        Number(pedido.quantidade) || 1
      );

    const quantidadeFisica =
      quantidadeVendida *
      produto.pecasPorVenda;

    totalPecas += quantidadeFisica;

    if (produto.modelo === "Redonda") {
      if (
        producao.redonda[produto.cor] &&
        Object.prototype.hasOwnProperty.call(
          producao.redonda[produto.cor],
          produto.medida
        )
      ) {
        producao.redonda[produto.cor][produto.medida] +=
          quantidadeFisica;
      }

      return;
    }

    if (produto.modelo === "Diamante") {
      if (
        producao.diamante[produto.cor] &&
        Object.prototype.hasOwnProperty.call(
          producao.diamante[produto.cor],
          produto.medida
        )
      ) {
        producao.diamante[produto.cor][produto.medida] +=
          quantidadeFisica;
      }

      return;
    }

    if (produto.modelo === "Gancho") {
      producao.gancho[produto.cor] += quantidadeFisica;
    }
  });

  return {
    producao,
    revisoes,
    totalPecas,
    totalPedidos:
      pedidosUnicos.size || pedidos.length
  };
}

/* =====================================================
   EXIBIÇÃO
===================================================== */

function somarObjeto(objeto) {
  return Object.values(objeto).reduce(
    (total, valor) => total + valor,
    0
  );
}

function renderizarProducao(resultado) {
  const { producao } = resultado;

  const totalRedondaBranca =
    somarObjeto(producao.redonda.Branco);

  const totalRedondaPreta =
    somarObjeto(producao.redonda.Preto);

  const totalRedonda =
    totalRedondaBranca +
    totalRedondaPreta;

  const totalDiamanteBranca =
    somarObjeto(producao.diamante.Branco);

  const totalDiamantePreta =
    somarObjeto(producao.diamante.Preto);

  const totalDiamante =
    totalDiamanteBranca +
    totalDiamantePreta;

  const totalGancho =
    producao.gancho.Branco +
    producao.gancho.Preto;

  [15, 16, 20, 25, 30].forEach(medida => {
    definirTexto(
      `roundWhite${medida}`,
      producao.redonda.Branco[medida] || 0
    );

    definirTexto(
      `roundBlack${medida}`,
      producao.redonda.Preto[medida] || 0
    );
  });

  definirTexto(
    "roundWhiteTotal",
    totalRedondaBranca
  );

  definirTexto(
    "roundBlackTotal",
    totalRedondaPreta
  );

  definirTexto(
    "roundTotal",
    `${totalRedonda} peças`
  );

  [20, 25, 30].forEach(medida => {
    definirTexto(
      `diamondWhite${medida}`,
      producao.diamante.Branco[medida] || 0
    );

    definirTexto(
      `diamondBlack${medida}`,
      producao.diamante.Preto[medida] || 0
    );
  });

  definirTexto(
    "diamondWhiteTotal",
    totalDiamanteBranca
  );

  definirTexto(
    "diamondBlackTotal",
    totalDiamantePreta
  );

  definirTexto(
    "diamondTotal",
    `${totalDiamante} peças`
  );

  definirTexto(
    "hookWhite",
    producao.gancho.Branco
  );

  definirTexto(
    "hookBlack",
    producao.gancho.Preto
  );

  definirTexto(
    "hookTotal",
    `${totalGancho} unidades`
  );

  definirTexto(
    "ordersMetric",
    resultado.totalPedidos
  );

  definirTexto(
    "piecesMetric",
    resultado.totalPecas
  );

  definirTexto(
    "reviewMetric",
    resultado.revisoes.length
  );

  mostrarElemento(
    "emptyState",
    resultado.totalPecas === 0
  );

  mostrarElemento(
    "productionResult",
    resultado.totalPecas > 0
  );

  const botaoImprimir = elemento("printButton");

  if (botaoImprimir) {
    botaoImprimir.disabled =
      resultado.totalPecas === 0;
  }

  renderizarRevisoes(resultado.revisoes);
}

function renderizarRevisoes(revisoes) {
  const corpo = elemento("reviewBody");

  if (!corpo) {
    return;
  }

  corpo.innerHTML = "";

  revisoes.forEach(item => {
    corpo.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td>${protegerHtml(item.pedido || "—")}</td>
          <td>${protegerHtml(item.sku || "Não encontrado")}</td>
          <td>${protegerHtml(item.titulo || "—")}</td>
          <td>${protegerHtml(item.motivo)}</td>
        </tr>
      `
    );
  });
}

/* =====================================================
   PROCESSAMENTO DO ARQUIVO
===================================================== */

async function processarArquivo() {
  if (!arquivoSelecionado) {
    alert("Selecione um arquivo.");
    return;
  }

  const botao = elemento("processButton");

  try {
    botao.disabled = true;
    botao.textContent = "Processando...";

    definirTexto(
      "fileStatus",
      "Processando arquivo..."
    );

    const nomeArquivo =
      arquivoSelecionado.name.toLowerCase();

    let pedidos;

    if (nomeArquivo.endsWith(".pdf")) {
      pedidos = await lerPdfUpSeller(
        arquivoSelecionado
      );
    } else {
      pedidos = await lerPlanilha(
        arquivoSelecionado
      );
    }

    const resultado =
      calcularProducao(pedidos);

    renderizarProducao(resultado);

    definirTexto(
      "fileStatus",
      `${pedidos.length} pedido(s) processado(s).`
    );
  } catch (erro) {
    console.error(erro);

    definirTexto(
      "fileStatus",
      "Erro ao processar o arquivo."
    );

    alert(
      erro.message ||
      "Não foi possível processar o arquivo."
    );
  } finally {
    botao.disabled = false;
    botao.textContent = "Processar arquivo";
  }
}

/* =====================================================
   LIMPAR
===================================================== */

function limparSistema() {
  arquivoSelecionado = null;

  const input = elemento("fileInput");

  if (input) {
    input.value = "";
  }

  definirTexto(
    "fileStatus",
    "Nenhum arquivo selecionado."
  );

  renderizarProducao({
    producao: criarProducaoVazia(),
    revisoes: [],
    totalPecas: 0,
    totalPedidos: 0
  });

  const botaoProcessar =
    elemento("processButton");

  if (botaoProcessar) {
    botaoProcessar.disabled = true;
  }
}

/* =====================================================
   EXEMPLO
===================================================== */

function testarExemplo() {
  const pedidos = [
    {
      pedido: "DEMO001",
      sku: "430463424669",
      quantidade: 2,
      titulo: "Kit 3 branco 30 cm"
    },

    {
      pedido: "DEMO002",
      sku: "292651491140",
      quantidade: 2,
      titulo: "Unitária branca 30 cm"
    },

    {
      pedido: "DEMO003",
      sku: "360463511212",
      quantidade: 1,
      titulo: "Diamante preto 25 cm"
    }
  ];

  renderizarProducao(
    calcularProducao(pedidos)
  );
}

/* =====================================================
   EVENTOS
===================================================== */

const inputArquivo = elemento("fileInput");
const botaoProcessar = elemento("processButton");
const botaoLimpar = elemento("clearButton");
const botaoExemplo = elemento("demoButton");
const botaoImprimir = elemento("printButton");
const zonaArquivo = elemento("dropzone");

if (inputArquivo) {
  inputArquivo.addEventListener(
    "change",
    evento => {
      arquivoSelecionado =
        evento.target.files?.[0] || null;

      definirTexto(
        "fileStatus",
        arquivoSelecionado
          ? `Arquivo selecionado: ${arquivoSelecionado.name}`
          : "Nenhum arquivo selecionado."
      );

      if (botaoProcessar) {
        botaoProcessar.disabled =
          !arquivoSelecionado;
      }
    }
  );
}

if (botaoProcessar) {
  botaoProcessar.addEventListener(
    "click",
    processarArquivo
  );
}

if (botaoLimpar) {
  botaoLimpar.addEventListener(
    "click",
    limparSistema
  );
}

if (botaoExemplo) {
  botaoExemplo.addEventListener(
    "click",
    testarExemplo
  );
}

if (botaoImprimir) {
  botaoImprimir.addEventListener(
    "click",
    () => window.print()
  );
}

if (zonaArquivo) {
  ["dragenter", "dragover"].forEach(evento => {
    zonaArquivo.addEventListener(
      evento,
      e => {
        e.preventDefault();
        zonaArquivo.classList.add("dragging");
      }
    );
  });

  ["dragleave", "drop"].forEach(evento => {
    zonaArquivo.addEventListener(
      evento,
      e => {
        e.preventDefault();
        zonaArquivo.classList.remove("dragging");
      }
    );
  });

  zonaArquivo.addEventListener(
    "drop",
    evento => {
      const arquivo =
        evento.dataTransfer?.files?.[0];

      if (!arquivo) {
        return;
      }

      arquivoSelecionado = arquivo;

      definirTexto(
        "fileStatus",
        `Arquivo selecionado: ${arquivo.name}`
      );

      if (botaoProcessar) {
        botaoProcessar.disabled = false;
      }
    }
  );
}

limparSistema();
