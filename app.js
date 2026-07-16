"use strict";

/*
=========================================================
ORGANIZADOR DE PRODUÇÃO — VERSÃO MANUAL
=========================================================

Funcionamento:

1. O usuário envia uma planilha Excel/CSV.
2. O sistema encontra o Model ID/SKU da variação.
3. Consulta o cadastro interno.
4. Converte kits em quantidade real de peças.
5. Agrupa a produção em:

- Prateleira redonda branca/preta
- Prateleira diamante branca/preta
- Ganchos penduradores branco/preto

A estrutura já está preparada para futuramente receber
pedidos diretamente pela API da Shopee.
=========================================================
*/

const STORAGE_KEY = "catalogoProducaoShopeeV2";

/*
=========================================================
CADASTRO INICIAL DOS PRODUTOS
=========================================================

O Model ID/SKU identifica a variação real comprada.

A informação "pieces" representa quantas peças físicas
uma venda daquele Model ID gera.

Exemplo:

Model ID: 430463424669
Quantidade comprada: 2
Peças por venda: 3

Resultado:
2 × 3 = 6 prateleiras.
*/

const defaultCatalog = [
  /*
  =====================================
  PRATELEIRAS UNITÁRIAS MEIA-LUA
  =====================================
  */

  {
    modelId: "292651491139",
    model: "Redonda",
    color: "Preto",
    size: "30 cm",
    detail: "Unitária",
    pieces: 1
  },

  {
    modelId: "292651491140",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    detail: "Unitária",
    pieces: 1
  },

  /*
  =====================================
  KIT 3 — PRATELEIRA MEIA-LUA
  =====================================
  */

  {
    modelId: "430463424666",
    model: "Redonda",
    color: "Branco",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "430463424667",
    model: "Redonda",
    color: "Preto",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "430463424668",
    model: "Redonda",
    color: "Branco",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "430463424669",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "430463424670",
    model: "Redonda",
    color: "Preto",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "430463424671",
    model: "Redonda",
    color: "Preto",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "216387569151",
    model: "Redonda",
    color: "Branco",
    size: "16 cm",
    detail: "Kit 3",
    pieces: 3
  },

  /*
  =====================================
  KIT 3 — PRATELEIRA DIAMANTE
  =====================================
  */

  {
    modelId: "360463511208",
    model: "Diamante",
    color: "Branco",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "360463511209",
    model: "Diamante",
    color: "Branco",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "360463511210",
    model: "Diamante",
    color: "Branco",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "360463511211",
    model: "Diamante",
    color: "Preto",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "360463511212",
    model: "Diamante",
    color: "Preto",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },

  {
    modelId: "360463511213",
    model: "Diamante",
    color: "Preto",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },

  /*
  =====================================
  COMBO COM LED
  =====================================
  */

  {
    modelId: "396026195582",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    detail: "Combo 2 com LED",
    pieces: 2
  }

  /*
  =====================================
  GANCHOS
  =====================================

  Os Model IDs dos ganchos poderão ser cadastrados
  pelo formulário do sistema.

  Exemplo:

  {
    modelId: "123456789",
    model: "Gancho",
    color: "Branco",
    size: "",
    detail: "Pendurador",
    pieces: 3
  }
  */
];

/*
=========================================================
ESTADO DO SISTEMA
=========================================================
*/

let catalog = loadCatalog();
let selectedFile = null;
let lastRows = [];

/*
=========================================================
FUNÇÕES AUXILIARES
=========================================================
*/

function getElement(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = getElement(id);

  if (element) {
    element.textContent = value ?? 0;
  }
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function parseNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  let text = String(value ?? "").trim();

  if (!text) {
    return 0;
  }

  text = text
    .replace(/\s/g, "")
    .replace("R$", "");

  /*
  Caso contenha vírgula, considera formato brasileiro.

  Exemplo:
  1.234,56 → 1234.56
  */

  if (text.includes(",")) {
    text = text
      .replace(/\./g, "")
      .replace(",", ".");
  }

  const number = Number(text);

  return Number.isFinite(number) ? number : 0;
}

/*
=========================================================
CATÁLOGO SALVO NO NAVEGADOR
=========================================================
*/

function loadCatalog() {
  try {
    const savedCatalog = localStorage.getItem(STORAGE_KEY);

    if (!savedCatalog) {
      return [...defaultCatalog];
    }

    const parsedCatalog = JSON.parse(savedCatalog);

    if (!Array.isArray(parsedCatalog)) {
      return [...defaultCatalog];
    }

    /*
    Adiciona automaticamente os produtos padrão que ainda
    não estejam no catálogo salvo.
    */

    const combinedCatalog = [...parsedCatalog];

    defaultCatalog.forEach((defaultProduct) => {
      const exists = combinedCatalog.some((product) => {
        return product.modelId === defaultProduct.modelId;
      });

      if (!exists) {
        combinedCatalog.push(defaultProduct);
      }
    });

    return combinedCatalog;
  } catch (error) {
    console.error("Erro ao carregar o catálogo:", error);

    return [...defaultCatalog];
  }
}

function saveCatalog() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(catalog)
    );

    renderCatalog();
  } catch (error) {
    console.error("Erro ao salvar o catálogo:", error);

    alert(
      "Não foi possível salvar o cadastro no navegador."
    );
  }
}

/*
=========================================================
LOCALIZAÇÃO DAS COLUNAS DA PLANILHA
=========================================================
*/

function normalizeColumnName(value) {
  return normalizeSearchText(value)
    .replace(/[º°]/g, "")
    .replace(/[._-]/g, " ");
}

function findExactColumnValue(row, aliases) {
  const normalizedAliases = aliases.map(normalizeColumnName);

  for (const [columnName, value] of Object.entries(row)) {
    const normalizedColumn = normalizeColumnName(columnName);

    if (
      normalizedAliases.includes(normalizedColumn) &&
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
}

function findPartialColumnValue(row, aliases) {
  const normalizedAliases = aliases.map(normalizeColumnName);

  for (const [columnName, value] of Object.entries(row)) {
    const normalizedColumn = normalizeColumnName(columnName);

    const found = normalizedAliases.some((alias) => {
      return normalizedColumn.includes(alias);
    });

    if (
      found &&
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
}

function findColumnValue(row, exactAliases, partialAliases = []) {
  const exactValue = findExactColumnValue(
    row,
    exactAliases
  );

  if (exactValue !== "") {
    return exactValue;
  }

  return findPartialColumnValue(
    row,
    partialAliases
  );
}

/*
=========================================================
NORMALIZAÇÃO DAS LINHAS DA PLANILHA
=========================================================
*/

function normalizeSpreadsheetRow(row, rowIndex) {
  const order = normalizeText(
    findColumnValue(
      row,
      [
        "ID do pedido",
        "Nº de Pedido",
        "Nº do pedido",
        "Número do pedido",
        "Numero do pedido",
        "Order ID"
      ],
      [
        "id do pedido",
        "numero do pedido",
        "n do pedido"
      ]
    )
  );

  const title = normalizeText(
    findColumnValue(
      row,
      [
        "Nome do Produto",
        "Nome do produto",
        "Título do produto",
        "Titulo do produto",
        "Título & Variação",
        "Titulo & Variacao"
      ],
      [
        "nome do produto",
        "titulo do produto",
        "titulo variacao"
      ]
    )
  );

  const variation = normalizeText(
    findColumnValue(
      row,
      [
        "Nome da Variação",
        "Nome da variação",
        "Nome da Variacao",
        "Variação",
        "Variacao"
      ],
      [
        "nome da variacao",
        "variacao"
      ]
    )
  );

  /*
  Primeiro busca quantidade por nome exato.
  Isso evita confundir com quantidade devolvida,
  cancelada ou reembolsada.
  */

  const quantityRaw = findColumnValue(
    row,
    [
      "Quantidade",
      "Qtd.",
      "Qtd",
      "Quantity"
    ],
    []
  );

  const parsedQuantity = parseNumber(quantityRaw);

  /*
  Quantidade inválida não será automaticamente
  transformada em 1. Ela será marcada como zero.
  */

  const quantity =
    parsedQuantity > 0
      ? Math.floor(parsedQuantity)
      : 0;

  /*
  Procura o identificador em diferentes colunas.

  Na lista da UpSeller, o Model ID pode aparecer
  na coluna chamada SKU.
  */

  const modelIdRaw = findColumnValue(
    row,
    [
      "Model ID",
      "Model Id",
      "ID do Modelo",
      "Id do Modelo",
      "ID da Variação",
      "Id da Variação",
      "ID da Variacao",
      "SKU",
      "Número de referência SKU",
      "Numero de referencia SKU",
      "Nº de referência SKU"
    ],
    [
      "model id",
      "id do modelo",
      "id da variacao",
      "referencia sku"
    ]
  );

  const status = normalizeText(
    findColumnValue(
      row,
      [
        "Status do pedido",
        "Status",
        "Situação do pedido",
        "Situacao do pedido"
      ],
      [
        "status do pedido",
        "situacao do pedido"
      ]
    )
  );

  return {
    internalRowId: rowIndex + 1,
    order,
    title,
    variation,
    qty: quantity,
    modelId: onlyDigits(modelIdRaw),
    status,
    originalRow: row
  };
}

/*
=========================================================
STATUS DE PEDIDOS
=========================================================
*/

function isInvalidOrderStatus(status) {
  const normalizedStatus = normalizeSearchText(status);

  if (!normalizedStatus) {
    return false;
  }

  const invalidStatuses = [
    "cancelado",
    "cancelada",
    "cancelled",
    "reembolsado",
    "reembolsada",
    "refunded",
    "devolvido",
    "devolvida",
    "falha no pagamento",
    "pagamento falhou"
  ];

  return invalidStatuses.some((invalidStatus) => {
    return normalizedStatus.includes(invalidStatus);
  });
}

/*
=========================================================
IDENTIFICAÇÃO DO MODEL ID
=========================================================
*/

function resolveModelId(row) {
  if (row.modelId) {
    const exactProduct = catalog.find((product) => {
      return product.modelId === row.modelId;
    });

    if (exactProduct) {
      return row.modelId;
    }
  }

  /*
  Caso o número esteja dentro do título ou variação.
  */

  const searchableText = [
    row.title,
    row.variation,
    row.modelId
  ].join(" ");

  for (const product of catalog) {
    if (
      searchableText.includes(product.modelId)
    ) {
      return product.modelId;
    }
  }

  return row.modelId;
}

/*
=========================================================
CLASSIFICAÇÃO FÍSICA DO PRODUTO
=========================================================
*/

function getPhysicalCategory(product) {
  const text = normalizeSearchText(
    `${product.model} ${product.detail}`
  );

  if (
    text.includes("gancho") ||
    text.includes("pendurador")
  ) {
    return "Gancho";
  }

  if (text.includes("diamante")) {
    return "Diamante";
  }

  if (
    text.includes("redonda") ||
    text.includes("meia lua") ||
    text.includes("meia-lua") ||
    text.includes("canto")
  ) {
    return "Redonda";
  }

  return product.model || "Outro";
}

function getNormalizedColor(color) {
  const normalizedColor = normalizeSearchText(color);

  if (
    normalizedColor.includes("preto") ||
    normalizedColor.includes("preta")
  ) {
    return "Preto";
  }

  if (
    normalizedColor.includes("branco") ||
    normalizedColor.includes("branca") ||
    normalizedColor.includes("branc0")
  ) {
    return "Branco";
  }

  return color || "Outra";
}

function getSizeNumber(size) {
  const number = Number(
    onlyDigits(size)
  );

  return Number.isFinite(number)
    ? number
    : 0;
}

/*
=========================================================
PROCESSAMENTO DOS PEDIDOS
=========================================================
*/

function processNormalizedRows(rows) {
  lastRows = rows;

  const recognized = [];
  const review = [];
  const ignored = [];
  const groups = new Map();
  const uniqueOrders = new Set();

  /*
  Evita duplicidade idêntica dentro do mesmo arquivo.
  */

  const processedLines = new Set();

  rows.forEach((row) => {
    if (
      !row.order &&
      !row.title &&
      !row.variation &&
      !row.modelId
    ) {
      return;
    }

    if (isInvalidOrderStatus(row.status)) {
      ignored.push({
        ...row,
        reason: "Status inválido"
      });

      return;
    }

    if (row.qty <= 0) {
      review.push({
        ...row,
        reviewReason: "Quantidade inválida ou vazia"
      });

      return;
    }

    if (row.order) {
      uniqueOrders.add(row.order);
    }

    row.modelId = resolveModelId(row);

    /*
    A chave considera pedido, Model ID, variação,
    quantidade e número da linha.

    O número da linha evita apagar pedidos legítimos
    com o mesmo produto repetido.
    */

    const duplicateKey = [
      row.order,
      row.modelId,
      row.variation,
      row.qty,
      row.internalRowId
    ].join("|");

    if (processedLines.has(duplicateKey)) {
      return;
    }

    processedLines.add(duplicateKey);

    const product = catalog.find((catalogProduct) => {
      return catalogProduct.modelId === row.modelId;
    });

    if (!product) {
      review.push({
        ...row,
        reviewReason: row.modelId
          ? "Model ID ainda não cadastrado"
          : "Model ID não encontrado na planilha"
      });

      return;
    }

    /*
    MATEMÁTICA PRINCIPAL

    Quantidade comprada × peças por venda
    */

    const totalPieces =
      row.qty *
      Number(product.pieces || 0);

    if (totalPieces <= 0) {
      review.push({
        ...row,
        reviewReason: "Cadastro sem quantidade de peças"
      });

      return;
    }

    const physicalCategory =
      getPhysicalCategory(product);

    const normalizedColor =
      getNormalizedColor(product.color);

    recognized.push({
      ...row,
      product,
      physicalCategory,
      normalizedColor,
      total: totalPieces
    });

    /*
    A informação Unitária, Kit 2 ou Kit 3
    não entra na chave da produção.

    Exemplo:

    Unitária branca 30 cm
    Kit 2 branco 30 cm
    Kit 3 branco 30 cm

    Tudo será somado como:

    Redonda | Branco | 30 cm
    */

    const groupKey = [
      physicalCategory,
      normalizedColor,
      product.size || ""
    ].join("|");

    const previousQuantity =
      groups.get(groupKey) || 0;

    groups.set(
      groupKey,
      previousQuantity + totalPieces
    );
  });

  renderResults({
    recognized,
    review,
    ignored,
    groups,
    orders:
      uniqueOrders.size ||
      recognized.length +
      review.length,

    lines: rows.length
  });
}

/*
=========================================================
RESULTADO GERAL
=========================================================
*/

function renderResults({
  recognized,
  review,
  ignored,
  groups,
  orders,
  lines
}) {
  setText("metricOrders", orders);
  setText("metricLines", lines);

  const totalPieces = Array.from(
    groups.values()
  ).reduce((sum, quantity) => {
    return sum + quantity;
  }, 0);

  setText("metricPieces", totalPieces);
  setText("metricReview", review.length);

  const printButton = getElement("printBtn");

  if (printButton) {
    printButton.disabled =
      groups.size === 0;
  }

  renderProduction(groups);
  renderRecognized(recognized);
  renderReview(review);

  console.log("Pedidos reconhecidos:", recognized);
  console.log("Pedidos para revisão:", review);
  console.log("Pedidos ignorados:", ignored);
  console.log("Grupos de produção:", groups);
}

/*
=========================================================
PAINEL VISUAL DA PRODUÇÃO
=========================================================
*/

function createEmptyProductionState() {
  return {
    round: {
      white: {
        16: 0,
        20: 0,
        25: 0,
        30: 0
      },

      black: {
        16: 0,
        20: 0,
        25: 0,
        30: 0
      }
    },

    diamond: {
      white: {
        20: 0,
        25: 0,
        30: 0
      },

      black: {
        20: 0,
        25: 0,
        30: 0
      }
    },

    hooks: {
      white: 0,
      black: 0
    }
  };
}

function renderProduction(groups) {
  const production =
    createEmptyProductionState();

  for (const [key, quantity] of groups.entries()) {
    const [
      category,
      color,
      size
    ] = key.split("|");

    const normalizedCategory =
      normalizeSearchText(category);

    const normalizedColor =
      normalizeSearchText(color);

    const sizeNumber =
      getSizeNumber(size);

    const colorKey =
      normalizedColor.includes("preto")
        ? "black"
        : "white";

    /*
    GANCHOS
    */

    if (
      normalizedCategory.includes("gancho") ||
      normalizedCategory.includes("pendurador")
    ) {
      production.hooks[colorKey] += quantity;

      continue;
    }

    /*
    DIAMANTE
    */

    if (
      normalizedCategory.includes("diamante")
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          production.diamond[colorKey],
          sizeNumber
        )
      ) {
        production.diamond[colorKey][sizeNumber] +=
          quantity;
      }

      continue;
    }

    /*
    REDONDA / MEIA-LUA
    */

    if (
      normalizedCategory.includes("redonda") ||
      normalizedCategory.includes("meia lua")
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          production.round[colorKey],
          sizeNumber
        )
      ) {
        production.round[colorKey][sizeNumber] +=
          quantity;
      }
    }
  }

  /*
  TOTAIS REDONDAS
  */

  const roundWhiteTotal =
    production.round.white[16] +
    production.round.white[20] +
    production.round.white[25] +
    production.round.white[30];

  const roundBlackTotal =
    production.round.black[16] +
    production.round.black[20] +
    production.round.black[25] +
    production.round.black[30];

  const roundTotal =
    roundWhiteTotal +
    roundBlackTotal;

  /*
  TOTAIS DIAMANTE
  */

  const diamondWhiteTotal =
    production.diamond.white[20] +
    production.diamond.white[25] +
    production.diamond.white[30];

  const diamondBlackTotal =
    production.diamond.black[20] +
    production.diamond.black[25] +
    production.diamond.black[30];

  const diamondTotal =
    diamondWhiteTotal +
    diamondBlackTotal;

  /*
  TOTAIS GANCHOS
  */

  const hookTotal =
    production.hooks.white +
    production.hooks.black;

  /*
  PREENCHE PRATELEIRAS REDONDAS
  */

  setText(
    "roundWhite16",
    production.round.white[16]
  );

  setText(
    "roundWhite20",
    production.round.white[20]
  );

  setText(
    "roundWhite25",
    production.round.white[25]
  );

  setText(
    "roundWhite30",
    production.round.white[30]
  );

  setText(
    "roundBlack16",
    production.round.black[16]
  );

  setText(
    "roundBlack20",
    production.round.black[20]
  );

  setText(
    "roundBlack25",
    production.round.black[25]
  );

  setText(
    "roundBlack30",
    production.round.black[30]
  );

  setText(
    "roundWhiteTotal",
    roundWhiteTotal
  );

  setText(
    "roundBlackTotal",
    roundBlackTotal
  );

  setText(
    "roundTotal",
    `${roundTotal} peças`
  );

  /*
  PREENCHE PRATELEIRAS DIAMANTE
  */

  setText(
    "diamondWhite20",
    production.diamond.white[20]
  );

  setText(
    "diamondWhite25",
    production.diamond.white[25]
  );

  setText(
    "diamondWhite30",
    production.diamond.white[30]
  );

  setText(
    "diamondBlack20",
    production.diamond.black[20]
  );

  setText(
    "diamondBlack25",
    production.diamond.black[25]
  );

  setText(
    "diamondBlack30",
    production.diamond.black[30]
  );

  setText(
    "diamondWhiteTotal",
    diamondWhiteTotal
  );

  setText(
    "diamondBlackTotal",
    diamondBlackTotal
  );

  setText(
    "diamondTotal",
    `${diamondTotal} peças`
  );

  /*
  PREENCHE GANCHOS
  */

  setText(
    "hookWhite",
    production.hooks.white
  );

  setText(
    "hookBlack",
    production.hooks.black
  );

  setText(
    "hookTotal",
    `${hookTotal} unidades`
  );

  /*
  MOSTRA OU ESCONDE O RESULTADO
  */

  const hasProduction =
    roundTotal +
    diamondTotal +
    hookTotal > 0;

  const emptyElement =
    getElement("productionEmpty");

  const resultElement =
    getElement("productionResult");

  if (emptyElement) {
    emptyElement.classList.toggle(
      "hidden",
      hasProduction
    );
  }

  if (resultElement) {
    resultElement.classList.toggle(
      "hidden",
      !hasProduction
    );
  }
}

/*
=========================================================
PEDIDOS RECONHECIDOS
=========================================================
*/

function renderRecognized(recognized) {
  const body = getElement("recognizedBody");

  if (!body) {
    return;
  }

  body.innerHTML = "";

  recognized.forEach((row) => {
    const productionDescription = [
      row.physicalCategory,
      row.normalizedColor,
      row.product.size
    ]
      .filter(Boolean)
      .join(" — ");

    const html = `
      <tr>
        <td>${escapeHtml(row.order || "—")}</td>

        <td>${escapeHtml(row.modelId || "—")}</td>

        <td>
          ${escapeHtml(productionDescription)}
        </td>

        <td>${row.qty}</td>

        <td>${row.product.pieces}</td>

        <td>
          <strong>${row.total}</strong>
        </td>
      </tr>
    `;

    body.insertAdjacentHTML(
      "beforeend",
      html
    );
  });

  toggleTableSection(
    "recognized",
    recognized.length > 0
  );
}

/*
=========================================================
PRODUTOS PARA REVISÃO
=========================================================
*/

function renderReview(review) {
  const body = getElement("reviewBody");

  if (!body) {
    return;
  }

  body.innerHTML = "";

  review.forEach((row) => {
    const html = `
      <tr>
        <td>
          ${escapeHtml(row.order || "—")}
        </td>

        <td>
          ${escapeHtml(row.title || "—")}
        </td>

        <td>
          ${escapeHtml(row.variation || "—")}
        </td>

        <td>
          ${escapeHtml(row.modelId || "Não encontrado")}
        </td>

        <td>
          ${row.qty || "—"}
        </td>

        <td>
          <button
            type="button"
            class="small primary configure-product-button"
            data-model-id="${escapeHtml(row.modelId)}"
            data-title="${escapeHtml(row.title)}"
            data-variation="${escapeHtml(row.variation)}"
          >
            Cadastrar
          </button>

          <small
            style="
              display:block;
              margin-top:6px;
              color:#b54708;
            "
          >
            ${escapeHtml(row.reviewReason || "")}
          </small>
        </td>
      </tr>
    `;

    body.insertAdjacentHTML(
      "beforeend",
      html
    );
  });

  body
    .querySelectorAll(".configure-product-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          prefillProductForm({
            modelId:
              button.dataset.modelId || "",

            title:
              button.dataset.title || "",

            variation:
              button.dataset.variation || ""
          });
        }
      );
    });

  toggleTableSection(
    "review",
    review.length > 0
  );
}

function toggleTableSection(prefix, show) {
  const emptyElement =
    getElement(`${prefix}Empty`);

  const wrapElement =
    getElement(`${prefix}Wrap`);

  if (emptyElement) {
    emptyElement.classList.toggle(
      "hidden",
      show
    );
  }

  if (wrapElement) {
    wrapElement.classList.toggle(
      "hidden",
      !show
    );
  }
}

/*
=========================================================
LEITURA DO EXCEL
=========================================================
*/

async function readSpreadsheet(file) {
  if (!window.XLSX) {
    throw new Error(
      "A biblioteca de leitura do Excel não foi carregada. Verifique sua conexão com a internet."
    );
  }

  const fileData =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(fileData, {
      type: "array"
    });

  if (!workbook.SheetNames.length) {
    throw new Error(
      "A planilha não possui nenhuma aba."
    );
  }

  /*
  Procura primeiro uma aba chamada orders.
  Caso não exista, usa a primeira aba.
  */

  const ordersSheetName =
    workbook.SheetNames.find((sheetName) => {
      return normalizeSearchText(sheetName) ===
        "orders";
    });

  const selectedSheetName =
    ordersSheetName ||
    workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[selectedSheetName];

  const rawRows =
    XLSX.utils.sheet_to_json(
      worksheet,
      {
        defval: "",
        raw: false
      }
    );

  if (!rawRows.length) {
    throw new Error(
      "A planilha está vazia ou não contém pedidos."
    );
  }

  const normalizedRows =
    rawRows
      .map(normalizeSpreadsheetRow)
      .filter((row) => {
        return (
          row.order ||
          row.title ||
          row.variation ||
          row.modelId
        );
      });

  if (!normalizedRows.length) {
    throw new Error(
      "Não foi possível localizar linhas de pedidos na planilha."
    );
  }

  return normalizedRows;
}

/*
=========================================================
SELEÇÃO E ENVIO DO ARQUIVO
=========================================================
*/

function setSelectedFile(file) {
  selectedFile = file || null;

  const processButton =
    getElement("processBtn");

  const fileStatus =
    getElement("fileStatus");

  if (processButton) {
    processButton.disabled =
      !selectedFile;
  }

  if (fileStatus) {
    fileStatus.textContent =
      selectedFile
        ? `Arquivo selecionado: ${selectedFile.name}`
        : "Nenhum arquivo selecionado.";
  }
}

function setupFileInput() {
  const fileInput =
    getElement("fileInput");

  if (!fileInput) {
    return;
  }

  fileInput.addEventListener(
    "change",
    (event) => {
      const file =
        event.target.files?.[0];

      setSelectedFile(file);
    }
  );
}

function setupProcessButton() {
  const processButton =
    getElement("processBtn");

  if (!processButton) {
    return;
  }

  processButton.addEventListener(
    "click",
    async () => {
      if (!selectedFile) {
        alert(
          "Selecione uma planilha antes de continuar."
        );

        return;
      }

      try {
        processButton.disabled = true;
        processButton.textContent =
          "Processando...";

        const rows =
          await readSpreadsheet(
            selectedFile
          );

        processNormalizedRows(rows);

        const fileStatus =
          getElement("fileStatus");

        if (fileStatus) {
          fileStatus.textContent =
            `${rows.length} linha(s) analisada(s) com sucesso.`;
        }
      } catch (error) {
        console.error(error);

        alert(
          error.message ||
          "Ocorreu um erro ao processar a planilha."
        );
      } finally {
        processButton.disabled = false;
        processButton.textContent =
          "Processar planilha";
      }
    }
  );
}

/*
=========================================================
ARRASTAR E SOLTAR PLANILHA
=========================================================
*/

function setupDropzone() {
  const dropzone =
    getElement("dropzone");

  const fileInput =
    getElement("fileInput");

  if (!dropzone) {
    return;
  }

  [
    "dragenter",
    "dragover"
  ].forEach((eventName) => {
    dropzone.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();

        dropzone.classList.add("drag");
      }
    );
  });

  [
    "dragleave",
    "drop"
  ].forEach((eventName) => {
    dropzone.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();

        dropzone.classList.remove("drag");
      }
    );
  });

  dropzone.addEventListener(
    "drop",
    (event) => {
      const file =
        event.dataTransfer?.files?.[0];

      if (!file) {
        return;
      }

      const validExtensions = [
        ".xlsx",
        ".xls",
        ".csv"
      ];

      const fileName =
        file.name.toLowerCase();

      const isValid =
        validExtensions.some((extension) => {
          return fileName.endsWith(extension);
        });

      if (!isValid) {
        alert(
          "Envie um arquivo Excel ou CSV."
        );

        return;
      }

      if (fileInput) {
        try {
          const transfer =
            new DataTransfer();

          transfer.items.add(file);

          fileInput.files =
            transfer.files;
        } catch (error) {
          console.warn(
            "Não foi possível preencher o campo de arquivo automaticamente.",
            error
          );
        }
      }

      setSelectedFile(file);
    }
  );
}

/*
=========================================================
BOTÃO DE EXEMPLO
=========================================================
*/

function setupDemoButton() {
  const demoButton =
    getElement("demoBtn");

  if (!demoButton) {
    return;
  }

  demoButton.addEventListener(
    "click",
    () => {
      const demoRows = [
        {
          internalRowId: 1,
          order: "EXEMPLO-001",
          title: "Kit 3 Prateleiras Meia Lua",
          variation: "BRANCO 30 CM",
          qty: 2,
          modelId: "430463424669",
          status: "A enviar"
        },

        {
          internalRowId: 2,
          order: "EXEMPLO-002",
          title: "Prateleira Flutuante",
          variation: "BRANCO",
          qty: 4,
          modelId: "292651491140",
          status: "A enviar"
        },

        {
          internalRowId: 3,
          order: "EXEMPLO-003",
          title: "Kit 3 Diamante",
          variation: "PRETO 25 CM",
          qty: 1,
          modelId: "360463511212",
          status: "A enviar"
        },

        {
          internalRowId: 4,
          order: "EXEMPLO-004",
          title: "Produto não cadastrado",
          variation: "BRANCO 20 CM",
          qty: 1,
          modelId: "999999999999",
          status: "A enviar"
        }
      ];

      processNormalizedRows(demoRows);
    }
  );
}

/*
=========================================================
LIMPAR RESULTADOS
=========================================================
*/

function clearSystem() {
  selectedFile = null;
  lastRows = [];

  const fileInput =
    getElement("fileInput");

  if (fileInput) {
    fileInput.value = "";
  }

  setSelectedFile(null);

  processNormalizedRows([]);
}

function setupClearButton() {
  const clearButton =
    getElement("clearBtn");

  if (!clearButton) {
    return;
  }

  clearButton.addEventListener(
    "click",
    clearSystem
  );
}

/*
=========================================================
IMPRESSÃO
=========================================================
*/

function setupPrintButton() {
  const printButton =
    getElement("printBtn");

  if (!printButton) {
    return;
  }

  printButton.addEventListener(
    "click",
    () => {
      window.print();
    }
  );
}

/*
=========================================================
CADASTRO MANUAL DE NOVOS PRODUTOS
=========================================================
*/

function prefillProductForm(row) {
  const modelIdInput =
    getElement("modelId");

  const detailInput =
    getElement("detail");

  const modelInput =
    getElement("model");

  if (modelIdInput) {
    modelIdInput.value =
      row.modelId || "";
  }

  if (detailInput) {
    detailInput.value = [
      row.title,
      row.variation
    ]
      .filter(Boolean)
      .join(" — ");
  }

  if (modelInput) {
    modelInput.focus();
  }

  const form =
    getElement("catalogForm");

  if (form) {
    form.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function setupCatalogForm() {
  const form =
    getElement("catalogForm");

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const product = {
        modelId: onlyDigits(
          getElement("modelId")?.value
        ),

        model: normalizeText(
          getElement("model")?.value
        ),

        color:
          getElement("color")?.value ||
          "",

        size: normalizeText(
          getElement("size")?.value
        ),

        detail: normalizeText(
          getElement("detail")?.value
        ),

        pieces: Math.floor(
          parseNumber(
            getElement("piecesPerSale")?.value
          )
        )
      };

      if (!product.modelId) {
        alert(
          "Informe o Model ID/SKU da variação."
        );

        return;
      }

      if (!product.model) {
        alert(
          "Informe o modelo do produto."
        );

        return;
      }

      if (!product.color) {
        alert(
          "Informe a cor do produto."
        );

        return;
      }

      if (product.pieces <= 0) {
        alert(
          "Informe quantas peças uma venda gera."
        );

        return;
      }

      const existingIndex =
        catalog.findIndex((catalogProduct) => {
          return catalogProduct.modelId ===
            product.modelId;
        });

      if (existingIndex >= 0) {
        catalog[existingIndex] =
          product;
      } else {
        catalog.push(product);
      }

      saveCatalog();

      form.reset();

      if (lastRows.length) {
        processNormalizedRows(lastRows);
      }
    }
  );
}

/*
=========================================================
EXIBIÇÃO DO CATÁLOGO
=========================================================
*/

function renderCatalog() {
  const catalogBody =
    getElement("catalogBody");

  if (!catalogBody) {
    return;
  }

  catalogBody.innerHTML = "";

  const sortedCatalog =
    [...catalog].sort((a, b) => {
      return a.modelId.localeCompare(
        b.modelId,
        "pt-BR",
        {
          numeric: true
        }
      );
    });

  sortedCatalog.forEach((product) => {
    const html = `
      <tr>
        <td>
          ${escapeHtml(product.modelId)}
        </td>

        <td>
          ${escapeHtml(product.model)}
        </td>

        <td>
          ${escapeHtml(product.color)}
        </td>

        <td>
          ${escapeHtml(product.size || "—")}
        </td>

        <td>
          ${escapeHtml(product.detail || "—")}
        </td>

        <td>
          ${product.pieces}
        </td>

        <td>
          <button
            type="button"
            class="small ghost delete-catalog-button"
            data-model-id="${escapeHtml(product.modelId)}"
          >
            Excluir
          </button>
        </td>
      </tr>
    `;

    catalogBody.insertAdjacentHTML(
      "beforeend",
      html
    );
  });

  catalogBody
    .querySelectorAll(".delete-catalog-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          removeCatalogProduct(
            button.dataset.modelId
          );
        }
      );
    });
}

function removeCatalogProduct(modelId) {
  const product = catalog.find((item) => {
    return item.modelId === modelId;
  });

  if (!product) {
    return;
  }

  const confirmed = confirm(
    `Excluir o cadastro ${modelId} — ${product.model}?`
  );

  if (!confirmed) {
    return;
  }

  catalog = catalog.filter((item) => {
    return item.modelId !== modelId;
  });

  saveCatalog();

  if (lastRows.length) {
    processNormalizedRows(lastRows);
  }
}

/*
=========================================================
EXPORTAR O CATÁLOGO
=========================================================
*/

function setupExportCatalogButton() {
  const exportButton =
    getElement("exportCatalogBtn");

  if (!exportButton) {
    return;
  }

  exportButton.addEventListener(
    "click",
    () => {
      const content =
        JSON.stringify(
          catalog,
          null,
          2
        );

      const blob =
        new Blob(
          [content],
          {
            type: "application/json"
          }
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "catalogo-producao-shopee.json";

      document.body.appendChild(link);

      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    }
  );
}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

function initializeApplication() {
  renderCatalog();

  setupFileInput();
  setupProcessButton();
  setupDropzone();
  setupDemoButton();
  setupClearButton();
  setupPrintButton();
  setupCatalogForm();
  setupExportCatalogButton();

  processNormalizedRows([]);
}

document.addEventListener(
  "DOMContentLoaded",
  initializeApplication
);
