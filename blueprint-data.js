/* Service Blueprint — leitura curada dos 148 post-its da dinâmica.
   Cada item aponta para o índice em boardCards.blueprint (card-data.js):
   i = índice do card (texto completo + recorte original), s = resumo legível. */
const blueprintMap = {
  lanes: [
    { id: 'app',  name: 'Cliente e app',  sub: 'Ações e frontstage',        color: '#39c46d' },
    { id: 'int',  name: 'Integrações',    sub: 'Backstage técnico',         color: '#f04ea6' },
    { id: 'ops',  name: 'Operação',       sub: 'Processos internos',        color: '#f6b324' },
    { id: 'err',  name: 'Exceções',       sub: 'Falhas e cenários de erro', color: '#f4582c' },
    { id: 'opp',  name: 'Oportunidades',  sub: 'Melhorias de UX',           color: '#2fd0bd' }
  ],
  /* Linhas do método (NN/g) desenhadas entre as camadas. */
  lines: {
    0: 'Linha de visibilidade · o que o cliente vê termina aqui',
    1: 'Linha de interação interna',
    2: 'Anotações da dinâmica'
  },
  stages: [
    {
      name: 'Entrada', short: 'Entrada',
      summary: 'O cliente entra pela home ou por “Meus seguros” e começa o pedido no mesmo app em que contratou.',
      span: [0.060, 0.142],
      cells: [
        [
          { i: 9,  s: 'Acionar pela home ou em “Meus seguros”' },
          { i: 10, s: 'Pela home: listar as coberturas contratadas' },
          { i: 11, s: 'Dentro do seguro: não precisa escolher qual acionar' },
          { i: 16, s: 'Todos os seguros acionados por aqui, Icatu ou meutudo' },
          { i: 15, s: 'Falecimento começa por uma jornada externa' },
          { i: 4,  s: 'Tela de referência: home de seguros' },
          { i: 5,  s: 'Tela de referência: coberturas contratadas' }
        ],
        [],
        [],
        [
          { i: 99,  s: 'Cobertura não aparece no sistema' },
          { i: 100, s: 'Cliente sem seguros válidos' },
          { i: 101, s: 'Timeout de API' }
        ],
        [
          { i: 126, s: 'Exibir a lista de coberturas contratadas' }
        ]
      ]
    },
    {
      name: 'Duas seguradoras', short: 'Seguradoras',
      summary: 'Antes de seguir, o serviço precisa saber de qual seguradora é cada apólice, sem empurrar o cliente para fora do app.',
      span: [0.144, 0.352],
      cells: [
        [
          { i: 12, s: 'Cliente integrado à Icatu: direcionar para a Icatu' },
          { i: 13, s: 'Mesma cobertura nas duas: abrir aqui e encaminhar o restante' },
          { i: 14, s: 'Coberturas diferentes entre meutudo e Icatu' },
          { i: 18, s: 'Bottom sheet com telefone da Icatu' },
          { i: 19, s: 'Apólices Icatu acionadas de forma oculta para o cliente' },
          { i: 17, s: 'Como registrar o status Icatu: arquivo mensal, manual ou só pela Icatu?' }
        ],
        [
          { i: 59, s: 'Um número de sinistro por cobertura' },
          { i: 60, s: 'API para cadastrar o sinistro internamente' },
          { i: 61, s: 'Como saber se o cliente já acionou pela Icatu?' },
          { i: 62, s: 'Plataforma de seguros mostra o que é Icatu e meutudo' }
        ],
        [
          { i: 84, s: 'Alguém cadastra manualmente na Icatu, via painel' },
          { i: 85, s: 'Analista precisa de acesso ao sistema para visualizar' }
        ],
        [],
        []
      ]
    },
    {
      name: 'Escolher cobertura', short: 'Cobertura',
      summary: 'O cliente escolhe a cobertura, confere o que ela abrange e vê a lista de documentos antes de começar.',
      span: [0.357, 0.470],
      cells: [
        [
          { i: 20, s: 'Coberturas agrupadas; seleciona, por exemplo, “Perda de renda”' },
          { i: 22, s: 'CLT e Renda: perda de renda, invalidez, morte por acidente' },
          { i: 24, s: 'Vida: invalidez, diárias, doenças graves, funeral…' },
          { i: 25, s: 'Exibir só o que o cliente contratou (4 formas de contratação)' },
          { i: 26, s: 'Cards de cobertura com descrição breve' },
          { i: 27, s: 'Abrangência da cobertura' },
          { i: 28, s: 'CTA: “Iniciar acionamento”' },
          { i: 21, s: 'Lista de documentos antes de enviar, incluindo formulário para imprimir e assinar' },
          { i: 23, s: 'Pendente: formulários para preencher' }
        ],
        [
          { i: 63, s: 'Validar se a cobertura está ativa' },
          { i: 64, s: 'Carregar regras: carência e documentos obrigatórios' }
        ],
        [
          { i: 86, s: 'Mapear regras por seguradora (meutudo vs. Icatu)' },
          { i: 87, s: 'Definir documentos exigidos por cobertura' }
        ],
        [
          { i: 102, s: 'Carência ativa' },
          { i: 103, s: 'Cobertura expirada' },
          { i: 104, s: 'Acionamento duplicado' },
          { i: 105, s: 'Cobertura não disponível' }
        ],
        [
          { i: 127, s: 'Tratar carência com mensagem empática' },
          { i: 128, s: '“Você já acionou esta cobertura em XX/XX”' },
          { i: 129, s: 'Detalhar o que cobre e o que não cobre' },
          { i: 130, s: 'Converter quem não tem cobertura disponível' }
        ]
      ]
    },
    {
      name: 'Enviar documentos', short: 'Documentos',
      summary: 'Envia os documentos pelo celular, com prazo de 90 dias para completar o que faltar.',
      span: [0.475, 0.580],
      cells: [
        [
          { i: 29, s: 'Checklist adaptado a cada cobertura' },
          { i: 30, s: 'Deixar claro o prazo de 30 dias para retorno' },
          { i: 32, s: 'Permitir câmera, galeria e arquivos' },
          { i: 33, s: 'Mesmo documento vale para todos os seguros da cobertura' },
          { i: 34, s: 'Enviar depois: 90 dias para completar' },
          { i: 35, s: 'Enviar outros documentos que julgar úteis' },
          { i: 31, s: 'Monitorar o “vai e volta” para validar a tela de confirmação' }
        ],
        [
          { i: 69, s: 'ERP em construção; envio via API para o ERP' },
          { i: 68, s: 'Sobe para o ERP; uma pessoa baixa e confere' },
          { i: 66, s: 'Reutilizar a identificação da abertura de conta: sim' },
          { i: 67, s: 'Validar com formalização o reaproveitamento do código' },
          { i: 65, s: 'Validação conjunta dos documentos: fica como melhoria' },
          { i: 70, s: 'Falta documento: analista libera novo envio no ERP' },
          { i: 71, s: 'Análise só começa com todos os obrigatórios' }
        ],
        [
          { i: 88, s: 'Qual o processo de análise? Teremos OCR?' }
        ],
        [
          { i: 106, s: 'Arquivo pesado (qual o limite?)' },
          { i: 107, s: 'Formato incorreto (quais aceitos?)' },
          { i: 108, s: 'Upload falhou' },
          { i: 109, s: 'API ou sistema indisponível' },
          { i: 110, s: 'Cliente não entende quais arquivos enviar' },
          { i: 111, s: 'Falha ao substituir arquivo' },
          { i: 112, s: 'Passou o prazo de 90 dias' }
        ],
        [
          { i: 131, s: 'Barra de progresso e status de envio' },
          { i: 132, s: 'Mensagens específicas: “excede 10 MB”, “apenas JPG, PNG ou PDF”' },
          { i: 133, s: 'Reenvio rápido sem reiniciar' },
          { i: 134, s: 'Estados: carregando / erro / sucesso' },
          { i: 135, s: 'Avisar que a análise começa após todos os obrigatórios' },
          { i: 136, s: 'Avisar quando passar o prazo de 90 dias' }
        ]
      ]
    },
    {
      name: 'Conferência interna', short: 'Conferência',
      summary: 'Nada acontece em tela: o analista baixa e confere os documentos no ERP antes de qualquer retorno.',
      span: [0.584, 0.682],
      empty: { 0: 'O cliente não vê esta etapa' },
      cells: [
        [],
        [
          { i: 72, s: 'Download manual dos documentos na plataforma interna' }
        ],
        [],
        [
          { i: 113, s: 'Erro humano ao alterar o status' }
        ],
        []
      ]
    },
    {
      name: 'Confirmar pedido', short: 'Confirmação',
      summary: 'Revisa o resumo do pedido, confirma o envio e sabe por onde acompanhar.',
      span: [0.690, 0.762],
      cells: [
        [
          { i: 37, s: 'Tela de confirmação dos dados' },
          { i: 38, s: 'Resumo do essencial: cobertura, documentos, prazo, canal' },
          { i: 40, s: 'Prazo de 90 dias para novos documentos' },
          { i: 39, s: 'Jornada externa: validação por SMS ou WhatsApp' },
          { i: 36, s: 'Precisa enviar documentos para receber o sorteio' }
        ],
        [
          { i: 73, s: 'Validação de token (senha, biometria)' }
        ],
        [
          { i: 89, s: 'Se faltar documento, analista informa no ERP' }
        ],
        [
          { i: 114, s: 'Sistema indisponível' },
          { i: 115, s: 'Falha no arquivo enviado pela Icatu' }
        ],
        [
          { i: 137, s: 'Push ou e-mail a cada mudança de status' }
        ]
      ]
    },
    {
      name: 'Acompanhar análise', short: 'Análise',
      summary: 'Acompanha o status, recebe notificações e sabe quanto tempo falta.',
      span: [0.766, 0.836],
      cells: [
        [
          { i: 44, s: 'Notificações push e e-mail' },
          { i: 45, s: 'Indicativo de tempo médio de aprovação' },
          { i: 46, s: 'Pendência de documentos' },
          { i: 48, s: 'Número do processo para consulta' },
          { i: 47, s: 'Se Icatu: telefone de contato' },
          { i: 42, s: 'Confirmar com a Icatu como é o retorno ao cliente' },
          { i: 43, s: 'Documento pendente: recusa ou reenvio? Há aviso de aprovado?' },
          { i: 41, s: 'Precisamos rever' }
        ],
        [
          { i: 75, s: 'API da seguradora recebe o sinistro' },
          { i: 76, s: 'Status: recebido → analisando → aprovado/reprovado' },
          { i: 74, s: 'Resultado da análise manual entra via ERP' },
          { i: 77, s: 'Abre PSL até o fim da análise (reserva do valor)' },
          { i: 78, s: 'Código de consulta gerado via API' },
          { i: 79, s: 'Telefone da Icatu só para apólice Icatu' },
          { i: 80, s: 'Como o ERP conecta ao CRM?' }
        ],
        [
          { i: 90, s: 'Como será feita a análise?' },
          { i: 91, s: 'O sistema será o ERP em construção' },
          { i: 92, s: 'Definir time, sistema e retornos ao virar seguradora' },
          { i: 93, s: 'Status Icatu atualizado manualmente no ERP' }
        ],
        [
          { i: 116, s: 'Pedido parado na seguradora' },
          { i: 117, s: 'Pedido de complementação documental' },
          { i: 118, s: 'Erro humano ao alterar o status' },
          { i: 119, s: 'Divergência de dados' }
        ],
        [
          { i: 138, s: 'Linha do tempo com histórico e datas' },
          { i: 139, s: 'Onde consultar o protocolo (central e app)' },
          { i: 140, s: 'Meio a meio: acompanhar o restante pela Icatu' },
          { i: 141, s: 'Com retorno meutudo, orientar a acompanhar o restante na Icatu' }
        ]
      ]
    },
    {
      name: 'Receber resultado', short: 'Resultado',
      summary: 'Recebe o resultado com motivo e próximo passo, de cada seguradora.',
      span: [0.838, 0.908],
      cells: [
        [
          { i: 51, s: 'Resultado: aprovado / necessita ação' },
          { i: 53, s: 'Instruções sobre prazos e pagamento' },
          { i: 54, s: 'Se rejeitado: motivo + próximo passo' },
          { i: 55, s: 'Histórico salvo' },
          { i: 52, s: 'Sem todos os documentos em 120 dias: não aprovado' },
          { i: 56, s: 'Apólices divididas: direcionar à Icatu para o restante' },
          { i: 57, s: 'E se algumas apólices forem aprovadas e outras não?' },
          { i: 50, s: 'Pagamento é da seguradora; definir regras ao virar seguradora' },
          { i: 49, s: 'Apólices Icatu: quem dá o retorno?' }
        ],
        [
          { i: 81, s: 'Decisão salva no histórico do ERP' },
          { i: 82, s: 'E em caso de negativa ou documento pendente?' }
        ],
        [
          { i: 94, s: 'Geração de protocolo digital' },
          { i: 95, s: 'Analista registra no ERP a não aprovação por 120 dias' },
          { i: 96, s: 'Analista com acesso ao ERP para consulta' },
          { i: 97, s: 'Registro para auditoria e compliance' }
        ],
        [
          { i: 120, s: 'Falha ao registrar conclusão' },
          { i: 121, s: 'Cliente não sabe há quanto tempo está no status' },
          { i: 122, s: 'Notificação não enviada' },
          { i: 123, s: 'API da seguradora indisponível' },
          { i: 124, s: 'Passou os 120 dias para complementar' }
        ],
        [
          { i: 142, s: '“Às vezes pedimos documentos extras — avisaremos!”' },
          { i: 143, s: 'Botão “Enviar documentos adicionais”' },
          { i: 144, s: 'Opção “Falar com suporte”' },
          { i: 145, s: 'Aprovado: “Estamos com você nesse momento”' },
          { i: 146, s: 'Mensagem clara de prazo de 120 dias expirado' },
          { i: 147, s: 'Acesso fácil ao histórico de sinistros' }
        ]
      ]
    }
  ],
  /* Decisões facilitadas na dinâmica, ancoradas na célula em que aconteceram. */
  decisions: [
    { stage: 1, lane: 0, tag: 'Continuidade', card: 13,
      q: 'O cliente conseguiria abrir um único pedido no app?',
      a: 'Defendi que a abertura e o envio dos documentos acontecessem onde o seguro foi contratado. O desenho passou a contemplar clientes com apólices das duas seguradoras.' },
    { stage: 3, lane: 1, tag: 'Integração', card: 69,
      q: 'Como os documentos chegariam à Icatu?',
      a: 'Exploramos uma API direta. Como a Icatu não dispunha dessa integração, combinamos o recebimento pelo ERP e o encaminhamento pelo analista.' },
    { stage: 3, lane: 1, tag: 'Documentos', card: 66,
      q: 'Poderíamos reutilizar a identificação da abertura da conta?',
      a: 'O reaproveitamento atendia à meutudo. A Icatu exigia o envio dos documentos, então incluí essa etapa na jornada. A validação automática com OCR ficou para evolução por restrição técnica.' },
    { stage: 7, lane: 0, tag: 'Responsabilidades', card: 57,
      q: 'Quem analisa, comunica e paga? Qual prazo mostrar?',
      a: 'Cada seguradora responde pela sua análise, comunicação e pagamento. O app precisava explicar o prazo de retorno e orientar o cliente mesmo quando as decisões fossem diferentes.' }
  ],
  /* Faixas verticais das camadas no quadro original (para o minimapa). */
  laneSpans: [[0.125, 0.34], [0.355, 0.475], [0.51, 0.645], [0.655, 0.775], [0.785, 0.905]]
};
