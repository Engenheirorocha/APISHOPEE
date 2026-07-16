"use strict";

const STORAGE_KEY = "catalogo-producao-shopee-v3";

const DEFAULT_CATALOG = [
  {
    modelId: "292651491139",
    model: "Redonda",
    color: "Preto",
    size: "30 cm",
    pieces: 1,
    detail: "Unitária"
  },
  {
    modelId: "292651491140",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    pieces: 1,
    detail: "Unitária"
  },

  {
    modelId: "430463424666",
    model: "Redonda",
    color: "Branco",
    size: "20 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "430463424667",
    model: "Redonda",
    color: "Preto",
    size: "20 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "430463424668",
    model: "Redonda",
    color: "Branco",
    size: "25 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "430463424669",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "430463424670",
    model: "Redonda",
    color: "Preto",
    size: "30 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "430463424671",
    model: "Redonda",
    color: "Preto",
    size: "25 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "216387569151",
    model: "Redonda",
    color: "Branco",
    size: "16 cm",
    pieces: 3,
    detail: "Kit 3"
  },

  {
    modelId: "360463511208",
    model: "Diamante",
    color: "Branco",
    size: "20 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "360463511209",
    model: "Diamante",
    color: "Branco",
    size: "25 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "360463511210",
    model: "Diamante",
    color: "Branco",
    size: "30 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "360463511211",
    model: "Diamante",
    color: "Preto",
    size: "20 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "360463511212",
    model: "Diamante",
    color: "Preto",
    size: "25 cm",
    pieces: 3,
    detail: "Kit 3"
  },
  {
    modelId: "360463511213",
    model: "Diamante",
    color: "Preto",
    size: "30 cm",
    pieces: 3,
    detail: "Kit 3"
  },

  {
    modelId: "396026195582",
    model: "Redonda",
    color: "Branco",
    size: "30 cm",
    pieces: 2,
    detail: "Combo 2 com LED"
  }
];

const TITLE_RULES = [
  {
    titleIncludes: [
      "kit 3 prateleiras de canto meia lua"
    ],
    variations: {
      "branco 20 cm": {
        model: "Redonda",
        color: "Branco",
        size: "20 cm",
        pieces: 3
      },
      "preto 20 cm": {
        model: "Redonda",
        color: "Preto",
        size: "20 cm",
        pieces: 3
      },
      "branco 25 cm": {
        model: "Redonda",
        color: "Branco",
        size: "25 cm",
        pieces: 3
      },
      "preto 25 cm": {
        model: "Redonda",
        color: "Preto",
        size: "25 cm",
        pieces: 3
      },
      "branco 30 cm": {
        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 3
      },
      "preto 30 cm": {
        model: "Redonda",
        color: "Preto",
        size: "30 cm",
        pieces: 3
      },
      "branco 16 cm": {
        model: "Redonda",
        color: "Branco",
        size: "16 cm",
        pieces: 3
      }
    }
  },

  {
    titleIncludes: [
      "kit 3 prateleiras canto quina diamante",
      "kit 3 prateleiras de canto diamante"
    ],
    variations: {
      "branco 20 cm": {
        model: "Diamante",
        color: "Branco",
        size: "20 cm",
        pieces: 3
      },
      "preto 20 cm": {
        model: "Diamante",
        color: "Preto",
        size: "20 cm",
        pieces: 3
      },
      "branco 25 cm": {
        model: "Diamante",
        color: "Branco",
        size: "25 cm",
        pieces: 3
      },
      "preto 25 cm": {
        model: "Diamante",
        color: "Preto",
        size: "25 cm",
        pieces: 3
      },
      "branco 30 cm": {
        model: "Diamante",
        color: "Branco",
        size: "30 cm",
        pieces: 3
      },
      "preto 30 cm": {
        model: "Diamante",
        color: "Preto",
        size: "30 cm",
        pieces: 3
      }
    }
  },

  {
    titleIncludes: [
      "prateleira de canto flutuante decorativa mdf 30 cm"
    ],
    variations: {
      "branco": {
        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 1
      },
      "branca": {
        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 1
      },
      "preto": {
        model: "Redonda",
        color: "Preto",
        size: "30 cm",
        pieces: 1
      }
    }
  },

  {
    titleIncludes: [
      "kit 2 prateleiras de canto"
    ],
    variations: {
      "branco 15 cm": {
        model: "Redonda",
        color: "Branco",
        size: "15 cm",
        pieces: 2
      },
      "branco 20 cm": {
        model: "Redonda",
        color: "Branco",
        size: "20 cm",
        pieces: 2
      },
      "branco 25 cm": {
        model: "Redonda",
        color: "Branco",
        size: "25 cm",
        pieces: 2
      },
      "branco 30 cm": {
        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 2
      },
      "preto 20 cm": {
        model: "Redonda",
        color: "Preto",
        size: "20 cm",
        pieces: 2
      },
      "preto 25 cm": {
        model: "Redonda",
        color: "Preto",
        size: "25 cm",
        pieces: 2
      },
      "preto 30 cm": {
        model: "Redonda",
        color: "Preto",
        size: "30 cm",
        pieces: 2
      }
    }
  },

  {
    titleIncludes: [
      "prateleira para quarto e banheiro kit 3"
    ],
    variations: {
      "branco 25 cm": {
        model: "Redonda",
        color: "Branco",
        size: "25 cm",
        pieces: 1
      },
      "branco 30 cm": {
        model: "Redonda",
        color: "Branco",
        size: "30 cm",
        pieces: 1
      }
    }
  },

  {
    titleIncludes: [
      "3 ganchos penduradores"
    ],
    variations: {
      "branco": {
        model: "Gancho",
        color: "Branco",
        size: "",
        pieces: 3
      },
      "preto": {
        model: "Gancho",
        color: "Preto",
        size: "",
        pieces: 3
      }
    }
  }
];

let catalog = loadCatalog();
let selectedFile = null;
let lastRows = [];

function element(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const target = element(id);

  if (target) {
    target.textContent = value;
  }
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeSearch(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/branc0/g, "branco")
    .replace(/\s+/g, " ");
}

function onlyDigits(value) {
  return String(value ?? "")
    .replace(/\D/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/[&<>"']/g, (character) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return map[character];
    });
}

function parseNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  let text = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace("R$", "");

  if (text.includes(",")) {
    text = text
      .replace(/\./g, "")
      .replace(",", ".");
  }

  const parsed = Number(text);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function loadCatalog() {
  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return structuredClone(DEFAULT_CATALOG);
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : structuredClone(DEFAULT_CATALOG);
  } catch (error) {
    console.error(error);

    return structuredClone(DEFAULT_CATALOG);
  }
}

function saveCatalog() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(catalog)
  );

  renderCatalog();
}

function normalizeColumnName(value) {
  return normalizeSearch(value)
    .replace(/[º°]/g, "")
    .replace(/[._-]/g, " ");
}

function findColumn(row, exactNames, partialNames = []) {
  const entries = Object.entries(row);

  const normalizedExact = exactNames.map(
    normalizeColumnName
  );

  for (const [name, value] of entries) {
    if (
      normalizedExact.includes(
        normalizeColumnName(name)
      ) &&
      value !== ""
    ) {
      return value;
    }
  }

  const normalizedPartial = partialNames.map(
    normalizeColumnName
  );

  for (const [name, value] of entries) {
    const normalizedName =
      normalizeColumnName(name);

    const match = normalizedPartial.some(
      (partial) => {
        return normalizedName.includes(partial);
      }
    );

    if (match && value !== "") {
      return value;
    }
  }

  return "";
}

function normalizeRow(row, index) {
  const order = normalizeText(
    findColumn(
      row,
      [
        "ID do pedido",
        "Nº de Pedido",
        "Número do pedido",
        "Order ID"
      ],
      [
        "id do pedido",
        "numero do pedido"
      ]
    )
  );

  const title = normalizeText(
    findColumn(
      row,
      [
        "Nome do Produto",
        "Título do produto",
        "Título & Variação"
      ],
      [
        "nome do produto",
        "titulo"
      ]
    )
  );

  const variation = normalizeText(
    findColumn(
      row,
      [
        "Nome da Variação",
        "Variação",
        "Variacao"
      ],
      [
        "nome da variacao",
        "variacao"
      ]
    )
  );

  const quantityRaw = findColumn(
    row,
    [
      "Quantidade",
      "Qtd.",
      "Qtd",
      "Quantity"
    ]
  );

  const quantity = Math.floor(
    parseNumber(quantityRaw)
  );

  const modelIdRaw = findColumn(
    row,
    [
      "Model ID",
      "ID do Modelo",
      "ID da Variação",
      "ID da Variacao",
      "SKU",
      "Número de referência SKU",
      "Numero de referencia SKU"
    ],
    [
      "model id",
      "id do modelo",
      "referencia sku"
    ]
  );

  const status = normalizeText(
    findColumn(
      row,
      [
        "Status do pedido",
        "Status",
        "Situação do pedido"
      ],
      [
        "status do pedido",
        "situacao"
      ]
    )
  );

  return {
    rowNumber: index + 1,
    order,
    title,
    variation,
    qty: quantity,
    modelId: onlyDigits(modelIdRaw),
    status
  };
}

function invalidStatus(status) {
  const text = normalizeSearch(status);

  if (!text) {
    return false;
  }

  return [
    "cancelado",
    "cancelada",
    "reembolsado",
    "reembolsada",
    "devolvido",
    "devolvida",
    "pagamento falhou"
  ].some((invalid) => {
    return text.includes(invalid);
  });
}

function findByModelId(modelId) {
  if (!modelId) {
    return null;
  }

  return catalog.find((product) => {
    return product.modelId === modelId;
  }) || null;
}

function findByTitleAndVariation(row) {
  const normalizedTitle =
    normalizeSearch(row.title);

  const normalizedVariation =
    normalizeSearch(row.variation);

  for (const rule of TITLE_RULES) {
    const titleMatches =
      rule.titleIncludes.some((text) => {
        return normalizedTitle.includes(text);
      });

    if (!titleMatches) {
      continue;
    }

    const directMatch =
      rule.variations[normalizedVariation];

    if (directMatch) {
      return {
        modelId: "",
        detail: "Regra por título e variação",
        ...directMatch
      };
    }

    for (
      const [
        variationName,
        product
      ] of Object.entries(rule.variations)
    ) {
      if (
        normalizedVariation.includes(
          variationName
        )
      ) {
        return {
          modelId: "",
          detail: "Regra por título e variação",
          ...product
        };
      }
    }
  }

  return null;
}

function resolveProduct(row) {
  const productById = findByModelId(
    row.modelId
  );

  if (productById) {
    return {
      source: "model-id",
      product: productById
    };
  }

  const productByText =
    findByTitleAndVariation(row);

  if (productByText) {
    return {
      source: "title-variation",
      product: productByText
    };
  }

  return {
    source: "unknown",
    product: null
  };
}

function normalizedCategory(model) {
  const text = normalizeSearch(model);

  if (text.includes("diamante")) {
    return "Diamante";
  }

  if (
    text.includes("gancho") ||
    text.includes("pendurador")
  ) {
    return "Gancho";
  }

  if (
    text.includes("redonda") ||
    text.includes("meia lua")
  ) {
    return "Redonda";
  }

  return "Outro";
}

function normalizedColor(color) {
  const text = normalizeSearch(color);

  if (text.includes("preto")) {
    return "Preto";
  }

  if (
    text.includes("branco") ||
    text.includes("branca")
  ) {
    return "Branco";
  }

  return color || "Outra";
}

function processRows(rows) {
  lastRows = rows;

  const groups = new Map();
  const review = [];
  const recognized = [];
  const orderIds = new Set();

  rows.forEach((row) => {
    if (
      !row.order &&
      !row.title &&
      !row.variation &&
      !row.modelId
    ) {
      return;
    }

    if (invalidStatus(row.status)) {
      return;
    }

    if (row.qty <= 0) {
      review.push({
        ...row,
        reason: "Quantidade inválida"
      });

      return;
    }

    if (row.order) {
      orderIds.add(row.order);
    }

    const resolution = resolveProduct(row);

    if (!resolution.product) {
      review.push({
        ...row,
        reason: row.modelId
          ? "ID/SKU não cadastrado"
          : "Produto ainda não reconhecido"
      });

      return;
    }

    const product = resolution.product;

    const pieces =
      row.qty *
      Number(product.pieces || 0);

    if (pieces <= 0) {
      review.push({
        ...row,
        reason: "Quantidade de peças não configurada"
      });

      return;
    }

    const category =
      normalizedCategory(product.model);

    const color =
      normalizedColor(product.color);

    const size =
      normalizeText(product.size);

    const groupKey = [
      category,
      color,
      size
    ].join("|");

    groups.set(
      groupKey,
      (groups.get(groupKey) || 0) + pieces
    );

    recognized.push({
      row,
      product,
      category,
      color,
      pieces,
      source: resolution.source
    });
  });

  const totalPieces =
    Array.from(groups.values())
      .reduce((sum, value) => {
        return sum + value;
      }, 0);

  setText(
    "metricOrders",
    orderIds.size ||
      recognized.length +
      review.length
  );

  setText(
    "metricPieces",
    totalPieces
  );

  setText(
    "metricReview",
    review.length
  );

  setText(
    "reviewSummaryCount",
    review.length
  );

  element("printBtn").disabled =
    totalPieces === 0;

  renderProduction(groups);
  renderReview(review);
}

function emptyProduction() {
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
    },

    other: []
  };
}

function sizeNumber(size) {
  return Number(onlyDigits(size)) || 0;
}

function renderProduction(groups) {
  const production = emptyProduction();

  for (const [key, quantity] of groups) {
    const [
      category,
      color,
      size
    ] = key.split("|");

    const categoryText =
      normalizeSearch(category);

    const colorKey =
      normalizeSearch(color).includes("preto")
        ? "black"
        : "white";

    const measurement =
      sizeNumber(size);

    if (categoryText.includes("gancho")) {
      production.hooks[colorKey] += quantity;
      continue;
    }

    if (categoryText.includes("diamante")) {
      if (
        Object.hasOwn(
          production.diamond[colorKey],
          measurement
        )
      ) {
        production.diamond[colorKey][measurement] +=
          quantity;
      } else {
        production.other.push({
          name: `${category} ${color} ${size}`,
          quantity
        });
      }

      continue;
    }

    if (categoryText.includes("redonda")) {
      if (
        Object.hasOwn(
          production.round[colorKey],
          measurement
        )
      ) {
        production.round[colorKey][measurement] +=
          quantity;
      } else {
        production.other.push({
          name: `${category} ${color} ${size}`,
          quantity
        });
      }

      continue;
    }

    production.other.push({
      name: `${category} ${color} ${size}`,
      quantity
    });
  }

  const roundWhiteTotal =
    Object.values(
      production.round.white
    ).reduce((sum, value) => sum + value, 0);

  const roundBlackTotal =
    Object.values(
      production.round.black
    ).reduce((sum, value) => sum + value, 0);

  const roundTotal =
    roundWhiteTotal +
    roundBlackTotal;

  const diamondWhiteTotal =
    Object.values(
      production.diamond.white
    ).reduce((sum, value) => sum + value, 0);

  const diamondBlackTotal =
    Object.values(
      production.diamond.black
    ).reduce((sum, value) => sum + value, 0);

  const diamondTotal =
    diamondWhiteTotal +
    diamondBlackTotal;

  const hookTotal =
    production.hooks.white +
    production.hooks.black;

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

  renderOtherProducts(
    production.other
  );

  const total =
    roundTotal +
    diamondTotal +
    hookTotal +
    production.other.reduce(
      (sum, item) => {
        return sum + item.quantity;
      },
      0
    );

  element("productionEmpty")
    .classList
    .toggle(
      "hidden",
      total > 0
    );

  element("productionResult")
    .classList
    .toggle(
      "hidden",
      total === 0
    );

  element("roundPanel")
    .classList
    .toggle(
      "hidden",
      roundTotal === 0
    );

  element("diamondPanel")
    .classList
    .toggle(
      "hidden",
      diamondTotal === 0
    );

  element("hookPanel")
    .classList
    .toggle(
      "hidden",
      hookTotal === 0
    );
}

function renderOtherProducts(items) {
  const panel = element("otherPanel");
  const container = element("otherProducts");

  container.innerHTML = "";

  if (!items.length) {
    panel.classList.add("hidden");
    return;
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  setText(
    "otherTotal",
    `${total} unidades`
  );

  items.forEach((item) => {
    const html = `
      <div class="other-item">
        <span>
          ${escapeHtml(item.name)}
        </span>

        <strong>
          ${item.quantity}
        </strong>
      </div>
    `;

    container.insertAdjacentHTML(
      "beforeend",
      html
    );
  });

  panel.classList.remove("hidden");
}

function renderReview(review) {
  const body = element("reviewBody");

  body.innerHTML = "";

  if (!review.length) {
    element("reviewEmpty")
      .classList
      .remove("hidden");

    element("reviewWrap")
      .classList
      .add("hidden");

    return;
  }

  element("reviewEmpty")
    .classList
    .add("hidden");

  element("reviewWrap")
    .classList
    .remove("hidden");

  review.forEach((row, index) => {
    const html = `
      <tr>
        <td>${escapeHtml(row.order || "—")}</td>

        <td>${escapeHtml(row.title || "—")}</td>

        <td>${escapeHtml(row.variation || "—")}</td>

        <td>${escapeHtml(row.modelId || "Não encontrado")}</td>

        <td>${row.qty || 0}</td>

        <td>${escapeHtml(row.reason)}</td>

        <td>
          <button
            type="button"
            class="small-button configure-button"
            data-index="${index}"
          >
            Cadastrar
          </button>
        </td>
      </tr>
    `;

    body.insertAdjacentHTML(
      "beforeend",
      html
    );
  });

  body
    .querySelectorAll(".configure-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const row =
            review[
              Number(button.dataset.index)
            ];

          fillProductForm(row);
        }
      );
    });
}

function fillProductForm(row) {
  element("modelId").value =
    row.modelId || "";

  element("detail").value =
    [
      row.title,
      row.variation
    ]
      .filter(Boolean)
      .join(" — ");

  document
    .querySelectorAll(".details-box")[1]
    .open = true;

  element("model").focus();

  element("catalogForm")
    .scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
}

async function readSpreadsheet(file) {
  if (!window.XLSX) {
    throw new Error(
      "A biblioteca de Excel não foi carregada. Atualize a página e verifique sua internet."
    );
  }

  const buffer =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(buffer, {
      type: "array"
    });

  if (!workbook.SheetNames.length) {
    throw new Error(
      "Nenhuma aba encontrada na planilha."
    );
  }

  const sheetName =
    workbook.SheetNames.find((name) => {
      return normalizeSearch(name) === "orders";
    }) ||
    workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[sheetName];

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
      "A planilha não possui pedidos."
    );
  }

  const rows = rawRows
    .map(normalizeRow)
    .filter((row) => {
      return (
        row.order ||
        row.title ||
        row.variation ||
        row.modelId
      );
    });

  if (!rows.length) {
    throw new Error(
      "Não foi possível localizar os pedidos."
    );
  }

  return rows;
}

function selectFile(file) {
  selectedFile = file || null;

  element("processBtn").disabled =
    !selectedFile;

  element("fileStatus").textContent =
    selectedFile
      ? `Arquivo selecionado: ${selectedFile.name}`
      : "Nenhum arquivo selecionado.";
}

function renderCatalog() {
  const body = element("catalogBody");

  body.innerHTML = "";

  [...catalog]
    .sort((a, b) => {
      return a.modelId.localeCompare(
        b.modelId,
        "pt-BR",
        {
          numeric: true
        }
      );
    })
    .forEach((product) => {
      const html = `
        <tr>
          <td>${escapeHtml(product.modelId)}</td>
          <td>${escapeHtml(product.model)}</td>
          <td>${escapeHtml(product.color)}</td>
          <td>${escapeHtml(product.size || "—")}</td>
          <td>${product.pieces}</td>

          <td>
            <button
              type="button"
              class="delete-button"
              data-model-id="${escapeHtml(product.modelId)}"
            >
              Excluir
            </button>
          </td>
        </tr>
      `;

      body.insertAdjacentHTML(
        "beforeend",
        html
      );
    });

  body
    .querySelectorAll(".delete-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const modelId =
            button.dataset.modelId;

          const confirmed = confirm(
            `Excluir o cadastro ${modelId}?`
          );

          if (!confirmed) {
            return;
          }

          catalog = catalog.filter(
            (product) => {
              return product.modelId !==
                modelId;
            }
          );

          saveCatalog();

          if (lastRows.length) {
            processRows(lastRows);
          }
        }
      );
    });
}

element("fileInput")
  .addEventListener(
    "change",
    (event) => {
      selectFile(
        event.target.files[0]
      );
    }
  );

element("processBtn")
  .addEventListener(
    "click",
    async () => {
      if (!selectedFile) {
        return;
      }

      const button =
        element("processBtn");

      try {
        button.disabled = true;
        button.textContent =
          "Processando...";

        const rows =
          await readSpreadsheet(
            selectedFile
          );

        processRows(rows);

        element("fileStatus")
          .textContent =
          `${rows.length} linha(s) analisada(s).`;
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        button.disabled = false;
        button.textContent =
          "Processar planilha";
      }
    }
  );

element("demoBtn")
  .addEventListener(
    "click",
    () => {
      processRows([
        {
          rowNumber: 1,
          order: "DEMO-001",
          title:
            "Kit 3 Prateleiras de Canto Meia Lua",
          variation: "BRANCO 30 CM",
          qty: 2,
          modelId: "430463424669",
          status: "A enviar"
        },
        {
          rowNumber: 2,
          order: "DEMO-002",
          title:
            "Prateleira de Canto Flutuante Decorativa MDF 30 cm",
          variation: "Branco",
          qty: 4,
          modelId: "292651491140",
          status: "A enviar"
        },
        {
          rowNumber: 3,
          order: "DEMO-003",
          title:
            "Kit 3 Prateleiras Canto Quina Diamante",
          variation: "PRETO 25 CM",
          qty: 2,
          modelId: "360463511212",
          status: "A enviar"
        },
        {
          rowNumber: 4,
          order: "DEMO-004",
          title:
            "3 Ganchos Penduradores",
          variation: "Branco",
          qty: 3,
          modelId: "",
          status: "A enviar"
        }
      ]);
    }
  );

element("clearBtn")
  .addEventListener(
    "click",
    () => {
      selectedFile = null;
      lastRows = [];

      element("fileInput").value = "";

      selectFile(null);
      processRows([]);
    }
  );

element("printBtn")
  .addEventListener(
    "click",
    () => {
      window.print();
    }
  );

element("catalogForm")
  .addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const product = {
        modelId: onlyDigits(
          element("modelId").value
        ),

        model:
          element("model").value,

        color:
          element("color").value,

        size: normalizeText(
          element("size").value
        ),

        pieces: Math.floor(
          parseNumber(
            element("piecesPerSale").value
          )
        ),

        detail: normalizeText(
          element("detail").value
        )
      };

      if (!product.modelId) {
        alert(
          "Informe o Model ID ou SKU."
        );

        return;
      }

      if (
        !product.model ||
        !product.color ||
        product.pieces <= 0
      ) {
        alert(
          "Preencha o produto, a cor e as peças por venda."
        );

        return;
      }

      const existingIndex =
        catalog.findIndex((item) => {
          return item.modelId ===
            product.modelId;
        });

      if (existingIndex >= 0) {
        catalog[existingIndex] =
          product;
      } else {
        catalog.push(product);
      }

      saveCatalog();

      event.target.reset();

      if (lastRows.length) {
        processRows(lastRows);
      }

      alert(
        "Produto salvo com sucesso."
      );
    }
  );

element("exportCatalogBtn")
  .addEventListener(
    "click",
    () => {
      const blob = new Blob(
        [
          JSON.stringify(
            catalog,
            null,
            2
          )
        ],
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
        "catalogo-producao.json";

      link.click();

      URL.revokeObjectURL(url);
    }
  );

element("resetCatalogBtn")
  .addEventListener(
    "click",
    () => {
      const confirmed = confirm(
        "Restaurar o cadastro inicial? Os produtos adicionados manualmente serão apagados."
      );

      if (!confirmed) {
        return;
      }

      catalog =
        structuredClone(
          DEFAULT_CATALOG
        );

      saveCatalog();

      if (lastRows.length) {
        processRows(lastRows);
      }
    }
  );

const dropzone =
  element("dropzone");

[
  "dragenter",
  "dragover"
].forEach((eventName) => {
  dropzone.addEventListener(
    eventName,
    (event) => {
      event.preventDefault();

      dropzone.classList.add(
        "dragging"
      );
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

      dropzone.classList.remove(
        "dragging"
      );
    }
  );
});

dropzone.addEventListener(
  "drop",
  (event) => {
    const file =
      event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    selectFile(file);
  }
);

renderCatalog();
processRows([]);
