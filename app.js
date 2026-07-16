const STORAGE_KEY = "rochaCatalogV1";

/*
  Cadastro inicial dos Model IDs conhecidos.

  Cada Model ID informa:
  - modelo da prateleira;
  - cor;
  - medida;
  - detalhe;
  - quantidade de peças geradas por venda.
*/
const defaultCatalog = [
  {
    modelId: "292651491139",
    model: "Meia-lua unitária",
    color: "Preto",
    size: "30 cm",
    detail: "",
    pieces: 1
  },
  {
    modelId: "292651491140",
    model: "Meia-lua unitária",
    color: "Branco",
    size: "30 cm",
    detail: "",
    pieces: 1
  },
  {
    modelId: "430463424666",
    model: "Meia-lua",
    color: "Branco",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "430463424667",
    model: "Meia-lua",
    color: "Preto",
    size: "20 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "430463424668",
    model: "Meia-lua",
    color: "Branco",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "430463424669",
    model: "Meia-lua",
    color: "Branco",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "430463424670",
    model: "Meia-lua",
    color: "Preto",
    size: "30 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "430463424671",
    model: "Meia-lua",
    color: "Preto",
    size: "25 cm",
    detail: "Kit 3",
    pieces: 3
  },
  {
    modelId: "216387569151",
    model: "Meia-lua",
    color: "Branco",
    size: "16 cm",
    detail: "Kit 3",
    pieces: 3
  },
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
  {
    modelId: "396026195582",
    model: "Meia-lua",
    color: "Outra",
    size: "30 cm",
    detail: "Combo 2 com LED",
    pieces: 2
  }
];

let catalog = loadCatalog();
let selectedFile = null;
let lastRows = [];

/*
  Atalho para buscar elementos pelo ID.
*/
const $ = (id) => document.getElementById(id);

/*
  Carrega o catálogo salvo no navegador.
*/
function loadCatalog() {
  try {
    const savedCatalog = localStorage.getItem(STORAGE_KEY);

    if (savedCatalog) {
      return JSON.parse(savedCatalog);
    }

    return [...defaultCatalog];
  } catch (error) {
    console.error("Erro ao carregar catálogo:", error);
    return [...defaultCatalog];
  }
}

/*
  Salva o catálogo no navegador.
*/
function saveCatalog() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(catalog)
  );

  renderCatalog();
}

/*
  Limpa espaços extras de um texto.
*/
function norm(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

/*
  Mantém apenas os números de um valor.
*/
function digits(value) {
  return norm(value).replace(/\D/g, "");
}

/*
  Procura uma coluna da planilha por possíveis nomes.
*/
function findValue(row, aliases) {
  const entries = Object.entries(row);

  for (const alias of aliases) {
    const hit = entries.find(([columnName]) => {
      return norm(columnName)
        .toLowerCase()
        .includes(alias);
    });

    if (
      hit &&
      hit[1] !== undefined &&
      hit[1] !== null &&
      hit[1] !== ""
    ) {
      return hit[1];
    }
  }

  return "";
}

/*
  Converte cada linha da planilha em um formato padronizado.
*/
function normalizeRow(row) {
  const order = norm(
    findValue(row, [
      "id do pedido",
      "nº do pedido",
      "numero do pedido",
      "pedido"
    ])
  );

  const title = norm(
    findValue(row, [
      "nome do produto",
      "título",
      "titulo",
      "produto"
    ])
  );

  const variation = norm(
    findValue(row, [
      "nome da variação",
      "nome da variacao",
      "variação",
      "variacao"
    ])
  );

  const quantityRaw = findValue(row, [
    "quantidade",
    "qtd.",
    "qtd"
  ]);

  const quantity = Math.max(
    1,
    Number(
      String(quantityRaw || 1)
        .replace(",", ".")
    ) || 1
  );

  /*
    O sistema tenta localizar o Model ID
    em diferentes colunas possíveis.
  */
  const modelIdRaw = findValue(row, [
    "model id",
    "id do modelo",
    "id da variação",
    "id da variacao",
    "sku",
    "número de referência sku",
    "numero de referencia sku"
  ]);

  return {
    order,
    title,
    variation,
    qty: quantity,
    modelId: digits(modelIdRaw)
  };
}

/*
  Verifica se o Model ID encontrado existe no catálogo.
*/
function resolveModelId(row) {
  const modelExists = catalog.some((item) => {
    return item.modelId === row.modelId;
  });

  if (row.modelId && modelExists) {
    return row.modelId;
  }

  /*
    Caso o Model ID tenha aparecido dentro do título
    ou da variação, tenta encontrá-lo.
  */
  const searchableText = (
    row.title +
    " " +
    row.variation
  ).toLowerCase();

  for (const item of catalog) {
    if (searchableText.includes(item.modelId)) {
      return item.modelId;
    }
  }

  return row.modelId;
}

/*
  Processa todas as linhas normalizadas.
*/
function processNormalized(rows) {
  lastRows = rows;

  const recognized = [];
  const review = [];
  const groups = new Map();
  const orders = new Set();

  rows.forEach((row) => {
    if (
      !row.order &&
      !row.title &&
      !row.variation
    ) {
      return;
    }

    if (row.order) {
      orders.add(row.order);
    }

    row.modelId = resolveModelId(row);

    const product = catalog.find((item) => {
      return item.modelId === row.modelId;
    });

    /*
      Produto não cadastrado:
      manda para revisão.
    */
    if (!product) {
      review.push(row);
      return;
    }

    /*
      Fórmula principal:

      quantidade comprada
      × peças por venda
      = total para fabricar
    */
    const total = row.qty * product.pieces;

    recognized.push({
      ...row,
      product,
      total
    });

    /*
      Agrupa os produtos iguais.
    */
    const groupKey = [
      product.model,
      product.color,
      product.size,
      product.detail
    ].join("|");

    const previousTotal = groups.get(groupKey) || 0;

    groups.set(
      groupKey,
      previousTotal + total
    );
  });

  renderResult({
    recognized,
    review,
    groups,
    orders:
      orders.size ||
      rows.length,
    lines: rows.length
  });
}

/*
  Atualiza os resultados na tela.
*/
function renderResult({
  recognized,
  review,
  groups,
  orders,
  lines
}) {
  $("metricOrders").textContent = orders;
  $("metricLines").textContent = lines;

  const totalPieces = [...groups.values()]
    .reduce((total, quantity) => {
      return total + quantity;
    }, 0);

  $("metricPieces").textContent = totalPieces;
  $("metricReview").textContent = review.length;

  $("printBtn").disabled = groups.size === 0;

  renderProduction(groups);
  renderRecognized(recognized);
  renderReview(review);
}

/*
  Mostra a ordem de produção agrupada.
*/
function renderProduction(groups) {
  $("productionBody").innerHTML = "";

  [...groups.entries()]
    .sort()
    .forEach(([key, quantity]) => {
      const [
        model,
        color,
        size,
        detail
      ] = key.split("|");

      const rowHtml = `
        <tr>
          <td>${escapeHtml(model)}</td>
          <td>${escapeHtml(color)}</td>
          <td>${escapeHtml(size)}</td>
          <td>${escapeHtml(detail || "—")}</td>
          <td>
            <strong>${quantity}</strong>
          </td>
        </tr>
      `;

      $("productionBody")
        .insertAdjacentHTML(
          "beforeend",
          rowHtml
        );
    });

  toggleSection(
    "production",
    groups.size > 0
  );
}

/*
  Mostra os pedidos reconhecidos.
*/
function renderRecognized(recognized) {
  $("recognizedBody").innerHTML = "";

  recognized.forEach((row) => {
    const rowHtml = `
      <tr>
        <td>${escapeHtml(row.order || "—")}</td>
        <td>${escapeHtml(row.modelId)}</td>
        <td>
          ${escapeHtml(
            row.variation ||
            row.title
          )}
        </td>
        <td>${row.qty}</td>
        <td>${row.product.pieces}</td>
        <td>
          <strong>${row.total}</strong>
        </td>
      </tr>
    `;

    $("recognizedBody")
      .insertAdjacentHTML(
        "beforeend",
        rowHtml
      );
  });

  toggleSection(
    "recognized",
    recognized.length > 0
  );
}

/*
  Mostra os pedidos que precisam ser cadastrados.
*/
function renderReview(review) {
  $("reviewBody").innerHTML = "";

  review.forEach((row, index) => {
    const template = $("reviewRowTemplate")
      .content
      .firstElementChild
      .cloneNode(true);

    template.dataset.index = index;

    const keys = [
      "order",
      "title",
      "variation",
      "modelId",
      "qty"
    ];

    keys.forEach((key) => {
      const cell = template.querySelector(
        `[data-key="${key}"]`
      );

      cell.textContent =
        row[key] ||
        "—";
    });

    const configureButton =
      template.querySelector(
        '[data-action="configure"]'
      );

    configureButton.onclick = () => {
      prefillReview(row);
    };

    $("reviewBody").appendChild(template);
  });

  toggleSection(
    "review",
    review.length > 0
  );
}

/*
  Exibe ou esconde uma tabela.
*/
function toggleSection(prefix, show) {
  $(`${prefix}Empty`)
    .classList
    .toggle("hidden", show);

  $(`${prefix}Wrap`)
    .classList
    .toggle("hidden", !show);
}

/*
  Evita inserir HTML perigoso vindo da planilha.
*/
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/[&<>"]/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      };

      return entities[character];
    });
}

/*
  Lê a planilha Excel.
*/
async function readFile(file) {
  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data, {
    type: "array"
  });

  const firstSheetName =
    workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[firstSheetName];

  const rawRows =
    XLSX.utils.sheet_to_json(
      worksheet,
      {
        defval: ""
      }
    );

  return rawRows
    .map(normalizeRow)
    .filter((row) => {
      return (
        row.order ||
        row.title ||
        row.variation
      );
    });
}

/*
  Seleção do arquivo.
*/
$("fileInput").addEventListener(
  "change",
  (event) => {
    setFile(event.target.files[0]);
  }
);

function setFile(file) {
  selectedFile = file || null;

  $("processBtn").disabled = !file;

  $("fileStatus").textContent = file
    ? `Arquivo selecionado: ${file.name}`
    : "Nenhum arquivo selecionado.";
}

/*
  Botão de processar planilha.
*/
$("processBtn").onclick = async () => {
  try {
    const rows =
      await readFile(selectedFile);

    if (!rows.length) {
      throw new Error(
        "Nenhuma linha de pedido foi encontrada. Verifique se o arquivo contém pedidos e cabeçalhos completos."
      );
    }

    processNormalized(rows);

    $("fileStatus").textContent =
      `${rows.length} linha(s) de pedido processada(s).`;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

/*
  Dados de teste.
*/
$("demoBtn").onclick = () => {
  processNormalized([
    {
      order: "EX001",
      title: "Kit 3 Prateleiras de Canto Meia Lua",
      variation: "BRANCO 30 CM",
      qty: 2,
      modelId: "430463424669"
    },
    {
      order: "EX002",
      title: "Prateleira de Canto Flutuante",
      variation: "Branca",
      qty: 4,
      modelId: "292651491140"
    },
    {
      order: "EX003",
      title: "Kit 3 Diamante",
      variation: "PRETO 25 CM",
      qty: 1,
      modelId: "360463511212"
    },
    {
      order: "EX004",
      title: "Produto novo",
      variation: "BRANCO 20 CM",
      qty: 1,
      modelId: "999999999999"
    }
  ]);
};

/*
  Limpa a tela.
*/
$("clearBtn").onclick = () => {
  selectedFile = null;

  $("fileInput").value = "";

  setFile(null);

  processNormalized([]);
};

/*
  Imprime a ordem de produção.
*/
$("printBtn").onclick = () => {
  window.print();
};

/*
  Salva ou atualiza um produto.
*/
$("catalogForm").onsubmit = (event) => {
  event.preventDefault();

  const product = {
    modelId: digits(
      $("modelId").value
    ),

    model: norm(
      $("model").value
    ),

    color: $("color").value,

    size: norm(
      $("size").value
    ),

    detail: norm(
      $("detail").value
    ),

    pieces: Number(
      $("piecesPerSale").value
    )
  };

  if (!product.modelId) {
    alert("Informe um Model ID válido.");
    return;
  }

  const existingIndex =
    catalog.findIndex((item) => {
      return item.modelId === product.modelId;
    });

  if (existingIndex >= 0) {
    catalog[existingIndex] = product;
  } else {
    catalog.push(product);
  }

  saveCatalog();

  event.target.reset();

  /*
    Recalcula a planilha caso já tenha sido processada.
  */
  if (lastRows.length) {
    processNormalized(lastRows);
  }
};

/*
  Preenche o formulário ao clicar em cadastrar
  um produto desconhecido.
*/
function prefillReview(row) {
  $("modelId").value = row.modelId;

  $("detail").value = row.title;

  $("model").focus();

  window.scrollTo({
    top:
      $("catalogForm").offsetTop -
      120,

    behavior: "smooth"
  });
}

/*
  Mostra o catálogo cadastrado.
*/
function renderCatalog() {
  $("catalogBody").innerHTML = "";

  catalog
    .sort((a, b) => {
      return a.modelId.localeCompare(
        b.modelId
      );
    })
    .forEach((product, index) => {
      const rowHtml = `
        <tr>
          <td>${escapeHtml(product.modelId)}</td>
          <td>${escapeHtml(product.model)}</td>
          <td>${escapeHtml(product.color)}</td>
          <td>${escapeHtml(product.size)}</td>
          <td>
            ${escapeHtml(
              product.detail ||
              "—"
            )}
          </td>
          <td>${product.pieces}</td>
          <td>
            <button
              class="small ghost"
              onclick="removeCatalog(${index})"
            >
              Excluir
            </button>
          </td>
        </tr>
      `;

      $("catalogBody")
        .insertAdjacentHTML(
          "beforeend",
          rowHtml
        );
    });
}

/*
  Exclui um produto do catálogo.
*/
window.removeCatalog = (index) => {
  const confirmed = confirm(
    "Excluir este cadastro?"
  );

  if (!confirmed) {
    return;
  }

  catalog.splice(index, 1);

  saveCatalog();

  if (lastRows.length) {
    processNormalized(lastRows);
  }
};

/*
  Exporta o catálogo em JSON.
*/
$("exportCatalogBtn").onclick = () => {
  const fileContent =
    JSON.stringify(
      catalog,
      null,
      2
    );

  const blob = new Blob(
    [fileContent],
    {
      type: "application/json"
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "catalogo-model-ids.json";

  link.click();

  URL.revokeObjectURL(link.href);
};

/*
  Permite arrastar a planilha até a área de upload.
*/
const dropzone = $("dropzone");

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
      event.dataTransfer.files[0];

    $("fileInput").files =
      event.dataTransfer.files;

    setFile(file);
  }
);

/*
  Inicialização do sistema.
*/
renderCatalog();
processNormalized([]);
