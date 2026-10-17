import type { PageInput } from "../types";

const IN28 = "https://antigo.anvisa.gov.br/documents/10181/3898888/%289%29IN_28_2018_COMP.pdf/96d76e7f-78c3-4fce-a2b2-561805d9b4b3";
const IN281 = "https://antigo.anvisa.gov.br/documents/10181/6485886/IN_281_2024_.pdf";
const PR = "https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/alimentos/perguntas-e-respostas-arquivos/suplementos-alimentares.pdf";
const IN75 = "https://antigo.anvisa.gov.br/documents/10181/3882585/%283%29IN_75_2020_COMP.pdf/e5a331f2-86db-4bc8-9f39-afb6c1d7e19f";
const P326 = "https://antigo.anvisa.gov.br/documents/10181/2718376/(1)PRT_SVS_326_1997.pdf/45a45ff7-9f34-44f5-a8f2-6a391fb22d16";

export const brasil: PageInput = {
  id: "terceirizada-brasil-pt", group: "country-br", locale: "pt", slug: ["fabricacao-terceirizada-suplementos", "brasil"],
  type: "country", status: "published", intent: "transactional", cluster: "terceirizacao-suplementos", country: "BR",
  title: "Fabricação terceirizada de suplementos alimentares no Brasil",
  metaTitle: "Fabricação terceirizada de suplementos alimentares | Anvisa",
  description: "Como lançar seu suplemento alimentar com fábrica terceirizada no Brasil: notificação na Anvisa, fabricantes informados, listas da IN 28/2018 e rotulagem.",
  primaryKeyword: "fabricação terceirizada de suplementos",
  reviewedAt: "2026-10-17", editor: "Equipe editorial",
  lead: "No Brasil, suplementos alimentares são notificados na Anvisa, e a empresa que notifica não precisa ter fábrica própria: basta informar todos os fabricantes. Explicamos o processo e buscamos fabricantes terceirizados compatíveis com o seu produto.",
  body: [
    { kind: "h2", text: "O que é suplemento alimentar" },
    { kind: "p", text: `Segundo a [Anvisa](${PR}), suplemento alimentar é um produto para ingestão oral, apresentado em formas farmacêuticas, destinado a suplementar a alimentação de indivíduos saudáveis com nutrientes, substâncias bioativas, enzimas ou probióticos, isolados ou combinados. O marco é a RDC 243/2018, com as listas de constituintes, limites, alegações e rotulagem complementar da [IN 28/2018](${IN28}).` },
    { kind: "p", text: "Só podem ser usadas as alegações da lista positiva da IN 28/2018, e a rotulagem não pode sugerir finalidade medicamentosa ou terapêutica." },
    { kind: "h2", text: "Notificação, não registro" },
    { kind: "table", head: ["Ponto", "O que dizem as normas"], rows: [
      ["Regularização", `Desde 1º/9/2024, suplementos alimentares estão entre as categorias de notificação na Anvisa ([IN 281/2024](${IN281}), Anexo II).`],
      ["Probióticos e enzimas", "Também são notificados; os registros antigos não são renovados (RDC 843/2024)."],
      ["Novos ingredientes", "Passam antes pela avaliação de segurança da RDC 839/2023."],
      ["Quem notifica", "A matriz do fabricante, o representante do fabricante ou o importador, que passa a ser a detentora e responde pelas informações (RDC 843/2024, arts. 4º e 5º)."],
      ["Documentos", "Formulário, licença sanitária dos fabricantes (ou comprovação de regularidade no país de origem), estudos de estabilidade para todo o prazo de validade e laudo ou memorial de cálculo (IN 281/2024, Anexo X)."],
    ] },
    { kind: "h2", text: "Sua marca com fábrica terceirizada" },
    { kind: "p", text: "A detentora deve informar, no pedido de regularização, todos os fabricantes do produto e a responsabilidade de cada um; quem produz, faz controle de qualidade ou armazena precisa estar cadastrado na Anvisa (RDC 843/2024, art. 6º). A norma não detalha o contrato entre marca e fabricante: as responsabilidades devem ficar por escrito no contrato de fabricação." },
    { kind: "h2", text: "O que o fabricante precisa ter" },
    { kind: "list", items: [
      "Licença sanitária emitida pela autoridade sanitária competente.",
      `Boas Práticas de Fabricação de alimentos ([Portaria SVS/MS 326/1997](${P326})) e procedimentos operacionais padronizados (RDC 275/2002).`,
      "Estudos de estabilidade e controles de qualidade que sustentem o prazo de validade declarado.",
      "Cadastro na Anvisa para cada unidade que produz, controla ou armazena o seu produto.",
    ] },
    { kind: "h2", text: "Rotulagem" },
    { kind: "list", items: [
      "A designação «Suplemento alimentar» seguida da forma farmacêutica, em destaque.",
      "As advertências obrigatórias da RDC 243/2018 e as frases complementares do Anexo VI da IN 28/2018, quando os constituintes exigirem.",
      "A expressão «Alimento notificado na Anvisa:» seguida do número do processo (RDC 843/2024, art. 21).",
      `Tabela nutricional pela RDC 429/2020 e [IN 75/2020](${IN75}): a porção é a recomendação diária de consumo para cada grupo populacional e não há declaração por 100 g ou 100 ml.`,
      "Suplementos não levam rotulagem nutricional frontal (IN 75/2020, Anexo XVI).",
    ] },
    { kind: "h2", text: "O que precisamos para pedir orçamentos" },
    { kind: "list", items: [
      "Forma e apresentação: cápsulas, comprimidos, gomas ou pó; unidades por embalagem e tipo de embalagem.",
      "Quantidade do primeiro pedido e a esperada nas recompras.",
      "Sua fórmula, ou o objetivo do produto se precisar de desenvolvimento.",
      "Se a notificação será feita pela sua empresa ou pelo fabricante.",
    ] },
  ],
  faqs: [
    { q: "Preciso ter fábrica para lançar minha marca de suplementos?", a: "Não. O representante do fabricante ou o importador pode notificar o produto, desde que informe todos os fabricantes (RDC 843/2024, arts. 4º e 6º)." },
    { q: "Suplemento com probiótico ainda precisa de registro?", a: "Não. Desde 1º/9/2024 é notificado, como os demais suplementos alimentares (perguntas e respostas da Anvisa)." },
    { q: "Quais documentos são exigidos na notificação?", a: "Formulário, licença sanitária dos fabricantes, estudos de estabilidade e laudo ou memorial de cálculo (IN 281/2024, Anexo X)." },
    { q: "Posso usar um ingrediente novo?", a: "Só depois da avaliação de segurança prevista na RDC 839/2023." },
    { q: "Suplemento leva a lupa de rotulagem frontal?", a: "Não. A rotulagem nutricional frontal não se aplica a suplementos alimentares (IN 75/2020, Anexo XVI)." },
    { q: "Uma marca estrangeira pode vender no Brasil?", a: "Sim, por meio de um importador com licença sanitária local e com o produto notificado na Anvisa." },
  ],
  sources: [
    { label: "Anvisa: perguntas e respostas sobre suplementos alimentares", url: PR },
    { label: "IN 28/2018, versão compilada (Anvisa)", url: IN28 },
    { label: "IN 281/2024 (Anvisa)", url: IN281 },
    { label: "IN 75/2020, versão compilada (Anvisa)", url: IN75 },
    { label: "Portaria SVS/MS 326/1997 (Anvisa)", url: P326 },
  ],
};
