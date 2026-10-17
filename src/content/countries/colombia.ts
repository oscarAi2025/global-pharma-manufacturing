import type { PageInput } from "../types";

const D3249 = "https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm";
const D3863 = "https://normograma.invima.gov.co/compilacion/docs/decreto_3863_2008.htm";
const R3096 = "https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_3096_2007.htm";
const R2015 = "https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_2015_2011.htm";

export const colombia: PageInput = {
  id: "maquila-colombia-es", group: "country-co", locale: "es", slug: ["maquila-suplementos", "colombia"],
  type: "country", status: "published", intent: "transactional", cluster: "maquila-suplementos", country: "CO",
  title: "Maquila de suplementos dietarios en Colombia",
  metaTitle: "Maquila de suplementos dietarios en Colombia | INVIMA",
  description: "Cómo fabricar tu suplemento dietario con un maquilador en Colombia: registro sanitario INVIMA, BPM, contrato de fabricación y rotulado.",
  primaryKeyword: "maquila de suplementos dietarios Colombia",
  reviewedAt: "2026-10-17", editor: "Equipo editorial",
  lead: "En Colombia, la marca puede ser titular del registro sanitario y encargar la fabricación a un tercero. Te explicamos qué exige el INVIMA y buscamos maquiladores que encajen con tu producto.",
  body: [
    { kind: "h2", text: "Qué cuenta como suplemento dietario" },
    { kind: "p", text: `El [Decreto 3249 de 2006](${D3249}) define el suplemento dietario como un producto cuyo propósito es adicionar la dieta normal: una fuente concentrada de nutrientes y otras sustancias con efecto fisiológico o nutricional, como vitaminas, minerales, proteínas, aminoácidos o extractos de plantas. No puede encajar en la definición de alimento, medicamento o producto fitoterapéutico ([Decreto 3863 de 2008](${D3863})).` },
    { kind: "p", text: `Tampoco puede presentarse como preventivo o terapéutico. El rótulo y la publicidad no pueden sugerir que el producto sirve para prevenir, aliviar, tratar o curar una enfermedad ([Resolución 3096 de 2007](${R3096}), art. 5.3). Si tu producto necesita esas afirmaciones, probablemente no es un suplemento, y conviene saberlo antes de pedir presupuestos.` },
    { kind: "h2", text: "Registro sanitario INVIMA" },
    { kind: "table", head: ["Punto", "Qué dice la norma"], rows: [
      ["Obligatorio", "Para fabricar, importar o comercializar un suplemento dietario (Decreto 3249 de 2006, art. 9)."],
      ["Modalidades", "Fabricar y vender; importar y vender; importar, envasar y vender (art. 10)."],
      ["Vigencia", "Diez años, renovables por periodos iguales (art. 13)."],
      ["Número", "Lleva el prefijo SD y puede amparar hasta tres marcas (Decreto 3863 de 2008)."],
      ["Revisión", "El INVIMA revisa la documentación en 15 días hábiles; si falta información, hay 2 meses para completarla o la solicitud se da por abandonada."],
      ["Ingredientes", "Deben figurar en las listas del Anexo 3 del decreto; si no, se niega salvo concepto favorable de la Sala Especializada."],
    ] },
    { kind: "h2", text: "La marca como titular y el maquilador como fabricante" },
    { kind: "p", text: `La solicitud la firma el representante legal o apoderado de la sociedad titular. Cuando fabrica un tercero, se adjunta copia del contrato de fabricación ([Decreto 3249 de 2006](${D3249}), art. 11, num. 1.1 d). Por eso el contrato de maquila no es un trámite menor: es un documento del registro. Si más adelante cambias de fabricante, el cambio pasa por revisión del INVIMA (art. 15).` },
    { kind: "h2", text: "Qué debe tener el maquilador" },
    { kind: "list", items: [
      `Certificado de Buenas Prácticas de Manufactura para suplementos dietarios, según el Anexo 2 del decreto, o certificado BPM de medicamentos si la planta también los fabrica. La guía de inspección es la [Resolución 2015 de 2011](${R2015}): el certificado dura cinco años y el INVIMA inspecciona al menos una vez al año.`,
      "Capacidad para tu forma: el decreto admite formas orales no estériles sólidas, semisólidas y líquidas, y otras formas físicas. Las gomitas no se nombran expresamente, así que conviene confirmar con el maquilador cómo las ha registrado antes.",
      "Disposición a firmar el contrato de fabricación que acompañará la solicitud del registro.",
    ] },
    { kind: "h2", text: "Si fabricas fuera e importas a Colombia" },
    { kind: "p", text: `Para un producto importado se presenta el certificado de la autoridad sanitaria del país exportador, la autorización expresa del titular al importador y los documentos apostillados o legalizados, traducidos si no están en español y con menos de un año de expedición. Del fabricante extranjero se acepta su certificado BPM o el documento equivalente de su país; si no existe, el INVIMA puede visitar la planta ([Decreto 3249 de 2006](${D3249}), arts. 7 y 11). La etiqueta de origen se acepta con la información en español en un rótulo adicional que no se despegue fácilmente (arts. 22 y 23).` },
    { kind: "h2", text: "Lo que debe decir la etiqueta" },
    { kind: "p", text: `La leyenda obligatoria es «Este Producto es un Suplemento Dietario, no es un Medicamento y no suple una Alimentación Equilibrada», en español, en mayúsculas y con color que contraste con el fondo. Según el caso se añaden «Manténgase fuera del alcance de los niños», «No consumir en estado de embarazo y lactancia», el fabricante o envasador, el origen y la advertencia de sustancias prohibidas en el deporte ([Decreto 3863 de 2008](${D3863}), art. 21). La información nutricional va en un recuadro visible, por porción o por dosis diaria ([Resolución 3096 de 2007](${R3096})).` },
    { kind: "h2", text: "Qué necesitamos para pedirte presupuestos" },
    { kind: "list", items: [
      "La forma (cápsula, tableta, polvo, gomita…) y la presentación: unidades por envase y tipo de envase.",
      "La cantidad del primer pedido y la que esperas en recompras.",
      "La fórmula, si la tienes, o qué quieres conseguir si necesitas que la desarrollen.",
      "Si el registro irá a nombre de tu empresa y si venderás solo en Colombia o también exportarás.",
    ] },
  ],
  faqs: [
    { q: "¿Puede mi marca ser titular del registro si otra empresa fabrica el producto?", a: "Sí. La solicitud se presenta a nombre de tu empresa y se adjunta copia del contrato de fabricación con el maquilador (Decreto 3249 de 2006, art. 11)." },
    { q: "¿Cuánto dura el registro sanitario de un suplemento dietario?", a: "Diez años, renovables por periodos iguales (Decreto 3249 de 2006, art. 13)." },
    { q: "¿Puedo importar un suplemento fabricado en otro país?", a: "Sí, en la modalidad de importar y vender o de importar, envasar y vender, con el certificado de la autoridad del país exportador, la autorización del titular y el certificado BPM del fabricante o su equivalente." },
    { q: "¿Puedo decir que mi suplemento previene o trata una enfermedad?", a: "No. La norma prohíbe indicaciones preventivas o terapéuticas en suplementos dietarios (Decreto 3249 de 2006, art. 24; Resolución 3096 de 2007, art. 5.3)." },
    { q: "¿Cómo compruebo si un producto tiene registro vigente?", a: "En la consulta pública de registros sanitarios del INVIMA, buscando por nombre del producto o número de registro." },
    { q: "¿Va a cambiar la norma de suplementos?", a: "El Decreto 2240 de 2023 mantiene vigente el Decreto 3249 de 2006 mientras avanza su actualización. Revisamos esta página cuando se publique una norma nueva." },
  ],
  sources: [
    { label: "Decreto 3249 de 2006 (normograma INVIMA)", url: D3249 },
    { label: "Decreto 3863 de 2008 (normograma INVIMA)", url: D3863 },
    { label: "Resolución 3096 de 2007 (normograma INVIMA)", url: R3096 },
    { label: "Resolución 2015 de 2011, guía BPM (normograma INVIMA)", url: R2015 },
    { label: "Decreto 2240 de 2023 (Función Pública)", url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=227130" },
  ],
};
