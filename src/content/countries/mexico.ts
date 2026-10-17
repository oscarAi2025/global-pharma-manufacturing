import type { PageInput } from "../types";

const COF = "https://www.gob.mx/cofepris/acciones-y-programas/suplementos-alimenticios";
const GUIA = "https://www.gob.mx/cms/uploads/attachment/file/910298/032822_Gu_a_SuplementosAlimenticios_FINAL_final_V3-1_compressed.pdf";
const NOM251 = "https://www.gob.mx/cms/uploads/attachment/file/130964/NOM-251.pdf";
const RCSPS = "https://faolex.fao.org/docs/pdf/mex50634.pdf";
const LGS = "https://mexico.justia.com/federales/leyes/ley-general-de-salud/titulo-decimo-segundo/capitulo-ii";
const PLANTAS = "https://farmacopea.org.mx/Repositorio/LegislacionFiles/Acuerdoplantprohibidas15dic99.pdf";

export const mexico: PageInput = {
  id: "maquila-mexico-es", group: "country-mx", locale: "es", slug: ["maquila-suplementos", "mexico"],
  type: "country", status: "published", intent: "transactional", cluster: "maquila-suplementos", country: "MX",
  title: "Maquila de suplementos alimenticios en México",
  metaTitle: "Maquila de suplementos alimenticios en México | COFEPRIS",
  description: "Cómo maquilar tu suplemento alimenticio en México: aviso de funcionamiento, NOM-251, leyendas de COFEPRIS, ingredientes prohibidos e importación.",
  primaryKeyword: "maquila de suplementos alimenticios México",
  reviewedAt: "2026-10-17", editor: "Equipo editorial",
  lead: "En México un suplemento alimenticio no necesita registro sanitario, pero sí aviso de funcionamiento, una etiqueta conforme a COFEPRIS y una maquiladora que cumpla la NOM-251. Te explicamos qué revisar y buscamos maquiladoras que encajen con tu producto.",
  body: [
    { kind: "h2", text: "Qué es un suplemento alimenticio en México" },
    { kind: "p", text: `La [Ley General de Salud](${LGS}), artículo 215, fracción V, los define como productos a base de hierbas, extractos vegetales, alimentos tradicionales, deshidratados o concentrados de frutas, adicionados o no de vitaminas o minerales, que se pueden presentar en forma farmacéutica y cuya finalidad es incrementar la ingesta dietética total, complementarla o suplir alguno de sus componentes. El [Reglamento de Control Sanitario de Productos y Servicios](${RCSPS}) (art. 168) permite formularlos además con carbohidratos, proteínas, aminoácidos, ácidos grasos, metabolitos, plantas, hierbas y algas.` },
    { kind: "p", text: "Como la ley habla de «forma farmacéutica», la maquila puede hacerse en cápsulas, tabletas, polvos, gomitas o cápsulas blandas. Las gomitas y las cápsulas blandas no se nombran expresamente; conviene confirmar con la maquiladora cómo ha clasificado productos similares." },
    { kind: "h2", text: "Registro sanitario o aviso de funcionamiento" },
    { kind: "table", head: ["Trámite", "Qué dice COFEPRIS"], rows: [
      ["Registro sanitario", `No hace falta: «Los suplementos alimenticios no requieren contar con registro sanitario» ([COFEPRIS](${COF})).`],
      ["Aviso de funcionamiento", "Trámite COFEPRIS-05-018, sin costo, 30 días antes de iniciar operaciones (Ley General de Salud, art. 200 bis)."],
      ["Publicidad", "Requiere permiso de COFEPRIS antes de anunciar el producto."],
      ["Importación", "Permiso Sanitario Previo de Importación; el primer ingreso de un producto se muestrea y libera por la autoridad."],
      ["Exportación", "Certificado para exportación de libre venta (COFEPRIS-01-007-A)."],
    ] },
    { kind: "h2", text: "Lo que tu etiqueta no puede decir" },
    { kind: "list", items: [
      "Indicaciones preventivas, rehabilitatorias o terapéuticas, ni información que confunda, exagere o engañe sobre composición, origen o efectos (Reglamento de Control Sanitario, art. 173).",
      "Nombres, figuras o declaraciones relacionadas con enfermedades, síntomas o síndromes, ni que el producto cubre por sí solo los requerimientos nutricionales o sustituye una comida (art. 174).",
      "Un producto con una sustancia de acción farmacológica reconocida no puede venderse como suplemento (art. 171).",
    ] },
    { kind: "p", text: `La [guía de etiquetado de COFEPRIS](${GUIA}) exige las leyendas «ESTE PRODUCTO NO ES UN MEDICAMENTO» y «EL CONSUMO DE ESTE PRODUCTO ES RESPONSABILIDAD DE QUIEN LO RECOMIENDA Y DE QUIEN LO USA», además de la denominación de suplemento alimenticio, lote y caducidad, fabricante o importador, modo de empleo y conservación, declaración nutrimental y las advertencias que exija cada ingrediente. Los productos importados deben llevar la información en español antes de venderse (art. 25).` },
    { kind: "h2", text: "Ingredientes que no se pueden usar" },
    { kind: "p", text: `El Reglamento de Control Sanitario (art. 169) prohíbe en suplementos, entre otros, procaína, efedrina, yohimbina, germanio y hormonas. El [Acuerdo de plantas de 1999](${PLANTAS}) prohíbe plantas como la belladona, el toloache o el hipérico, y obliga a advertir «ATENCION: NO CONSUMIRSE DURANTE EL EMBARAZO» en otras, como la gayuba o el perejil. Revisar la fórmula contra estas listas antes de pedir presupuestos evita cotizar algo que no se podrá vender.` },
    { kind: "h2", text: "Qué debe cumplir la maquiladora" },
    { kind: "list", items: [
      `La [NOM-251-SSA1-2009](${NOM251}), de prácticas de higiene para alimentos, bebidas y suplementos: registros en español guardados al menos 1.5 veces la vida de anaquel, lotificación y rastreabilidad, plan de retiro de producto, control de plagas y capacitación anual.`,
      "Aviso de funcionamiento con el giro de suplementos alimenticios.",
      "Tratamiento de las materias primas para reducir la carga microbiana (Reglamento de Control Sanitario, art. 170).",
      "Certificados de análisis por lote, que además se piden para importar.",
    ] },
    { kind: "h2", text: "Qué necesitamos para pedirte presupuestos" },
    { kind: "list", items: [
      "Forma y presentación: cápsulas, tabletas, gomitas o polvo; unidades por envase y tipo de envase.",
      "Cantidad del primer pedido y la que esperas en recompras.",
      "Tu fórmula, o el objetivo del producto si necesitas que la desarrollen.",
      "Si venderás en México, exportarás o importarás producto terminado.",
    ] },
  ],
  faqs: [
    { q: "¿Necesito registro sanitario para vender un suplemento en México?", a: "No. COFEPRIS indica que los suplementos alimenticios no requieren registro sanitario; se presenta un aviso de funcionamiento (COFEPRIS-05-018)." },
    { q: "¿Cuánto cuesta el aviso de funcionamiento?", a: "Según COFEPRIS, el trámite no tiene costo y se presenta 30 días antes de iniciar operaciones." },
    { q: "¿Puedo importar mi suplemento ya fabricado?", a: "Sí, con un Permiso Sanitario Previo de Importación. El primer ingreso de cada producto pasa por muestreo de la autoridad, y la etiqueta debe estar en español." },
    { q: "¿Puedo decir que mi producto previene o cura una enfermedad?", a: "No. El Reglamento de Control Sanitario prohíbe las indicaciones preventivas, rehabilitatorias o terapéuticas (arts. 173 y 174)." },
    { q: "¿Puedo anunciar mi suplemento en redes sociales?", a: "La publicidad de suplementos requiere permiso de COFEPRIS." },
    { q: "¿Qué norma de higiene debe cumplir la maquiladora?", a: "La NOM-251-SSA1-2009, de prácticas de higiene para el proceso de alimentos, bebidas o suplementos alimenticios." },
  ],
  sources: [
    { label: "COFEPRIS: suplementos alimenticios (trámites)", url: COF },
    { label: "COFEPRIS: guía de etiquetado de suplementos alimenticios (2022)", url: GUIA },
    { label: "NOM-251-SSA1-2009 (gob.mx)", url: NOM251 },
    { label: "Reglamento de Control Sanitario de Productos y Servicios (copia FAOLEX)", url: RCSPS },
    { label: "Ley General de Salud, título duodécimo, capítulo II", url: LGS },
    { label: "Acuerdo de plantas prohibidas o permitidas (DOF 15/12/1999)", url: PLANTAS },
  ],
};
