(function () {
  var coverage = {
    title: "Perda de renda",
    subtitle: "Veja os certificados da cobertura selecionada",
    estimatedTotal: "R$ 6.000,00",
    providers: [
      {
        id: "meutudo",
        name: "Certificados meutudo",
        avatar: "assets/fe2c1.png",
        avatarShape: "rounded",
        countLabel: "3 certificados",
        total: "R$ 3.000,00",
        certificates: [
          { number: "Certificado nº 123456", amount: "R$ 1.500,00" },
          { number: "Certificado nº 123456", amount: "R$ 1.000,00" },
          { number: "Certificado nº 123456", amount: "R$ 500,00" }
        ]
      },
      {
        id: "icatu",
        name: "Certificados Icatu",
        avatar: "assets/3de86.png",
        avatarShape: "circle",
        countLabel: "3 certificados",
        total: "R$ 3.000,00",
        certificates: [
          { number: "Certificado nº 123456", amount: "R$ 1.000,00" },
          { number: "Certificado nº 123456", amount: "R$ 1.000,00" },
          { number: "Certificado nº 123456", amount: "R$ 1.000,00" }
        ]
      }
    ]
  };

  var meta = {
    identidade: ["Documento de identificação", "CPF e RG ou CNH", "alert", "description", "Enviar documento", "identity", false],
    "outros-segurado": ["Outros documentos", "Envie outros documentos, caso necessário", "info", "description-info", "Enviar documento", "file", true],
    carteira: ["Carteira de trabalho", "Pagina com a baixa registrada", "alert", "description", "Enviar documento", "file", false],
    recisao: ["Recisão", "Termo de recisão do contrato de trabalho", "alert", "description", "Enviar documento", "file", false],
    "outros-renda": ["Outros documentos", "Envie outros documentos, caso necessário", "info", "description-info", "Enviar documento", "file", true],
    formulario: ["Formulário de autorização de pagamento", "Você precisa preencher o documento antes de enviá-lo", "alert", "bank", "Anexar documento", "file", false],
    aviso: ["Aviso de sinistro", "Você precisa preencher o documento antes de enviá-lo", "alert", "shield", "Anexar documento", "file", false],
    "outros-pagamento": ["Outros documentos", "Envie outros documentos, caso necessário", "info", "description-info", "Enviar documento", "file", true]
  };

  var groups = [
    ["segurado", "Segurado", "Documentos necessários do titular do seguro", ["identidade", "outros-segurado"]],
    ["renda", "Comprovação de renda", "Documentos necessários para validar a atividade profissional e o ganho médio", ["carteira", "recisao", "outros-renda"]],
    ["pagamento", "Formulário e pagamento", "Documentos necessários para o recebimento da indenização", ["formulario", "aviso", "outros-pagamento"]]
  ];

  var state = {};
  Object.keys(meta).forEach(function (id) {
    state[id] = { status: "PENDING", documentType: "", files: [] };
  });

  function item(id) {
    var spec = meta[id];
    var current = state[id];
    return {
      id: id,
      title: spec[0],
      subtitle: spec[1],
      tone: spec[2],
      icon: spec[3],
      action: spec[4],
      kind: spec[5],
      optional: spec[6],
      status: current.status,
      documentType: current.documentType,
      files: current.files
    };
  }

  function documents() {
    return {
      groups: groups.map(function (group) {
        return {
          id: group[0],
          title: group[1],
          description: group[2],
          items: group[3].map(item)
        };
      })
    };
  }

  function reply(body, status) {
    return new Response(JSON.stringify(body), {
      status: status,
      headers: { "Content-Type": "application/json" }
    });
  }

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var raw = typeof input === "string" ? input : input.url;
    var path;
    try {
      path = new URL(raw, window.location.href).pathname;
    } catch (error) {
      path = raw;
    }
    if (path.indexOf("/api/") === -1) return nativeFetch(input, init);
    var method = ((init && init.method) || "GET").toUpperCase();
    if (path === "/api/coverage" && method === "GET") return Promise.resolve(reply(coverage, 200));
    if (path === "/api/documents" && method === "GET") return Promise.resolve(reply(documents(), 200));
    if (path.indexOf("/api/documents/") === 0 && method === "POST") {
      var id = decodeURIComponent(path.slice("/api/documents/".length));
      if (!state[id]) return Promise.resolve(reply({ error: "documento" }, 404));
      var body = init && init.body;
      var files = body && typeof body.getAll === "function" ? body.getAll("files") : [];
      if (!files.length) return Promise.resolve(reply({ error: "arquivo" }, 400));
      var labels = body.getAll("labels");
      state[id].status = "SENT";
      state[id].documentType = body.get("documentType") || "";
      state[id].files = files.map(function (file, index) {
        return {
          label: labels[index] || (file && file.name) || "",
          fileName: (file && file.name) || "",
          url: ""
        };
      });
      return Promise.resolve(reply({ id: id, status: "SENT", files: state[id].files }, 200));
    }
    if (path === "/api/claims" && method === "POST") {
      var later = false;
      if (init && typeof init.body === "string") later = init.body.indexOf('"later":true') !== -1;
      return Promise.resolve(reply({ id: "local", later: later }, 201));
    }
    if (path === "/api/support" && method === "POST") {
      return Promise.resolve(reply({ requested: true, message: "Atendimento solicitado" }, 201));
    }
    return Promise.resolve(reply({ error: "rota" }, 404));
  };
})();
