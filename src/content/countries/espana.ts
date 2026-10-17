import type { PageInput } from "../types";

const RD1487 = "https://www.boe.es/eli/es/rd/2009/09/26/1487/con";
const RD191 = "https://www.boe.es/eli/es/rd/2011/02/18/191/con";
const R1169 = "https://www.boe.es/doue/2011/304/L00018-00063.pdf";
const RDL1 = "https://www.boe.es/boe/dias/2015/07/25/pdfs/BOE-A-2015-8343.pdf";
const AESAN_DC = "https://www.aesan.gob.es/AECOSAN/web/seguridad_alimentaria/ampliacion/declaraciones_nutricionales.htm";
const EU_REG = "https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register";

export const espana: PageInput = {
  id: "complementos-espana-es", group: "country-es", locale: "es", slug: ["fabricacion-complementos-alimenticios", "espana"],
  type: "country", status: "published", intent: "transactional", cluster: "marca-blanca-complementos", country: "ES",
  title: "Fabricación de complementos alimenticios con marca propia en España",
  metaTitle: "Fabricantes de complementos alimenticios con marca propia",
  description: "Cómo lanzar tu complemento alimenticio con un fabricante a terceros en España: notificación, RGSEAA, etiquetado y quién responde de qué.",
  primaryKeyword: "fabricante complementos alimenticios marca blanca España",
  reviewedAt: "2026-10-17", editor: "Equipo editorial",
  lead: "En España un complemento alimenticio no necesita autorización previa, pero sí notificarse antes de venderlo, y la marca responde de la etiqueta aunque fabrique otro. Te explicamos el proceso y buscamos fabricantes a terceros que encajen con tu producto.",
  body: [
    { kind: "h2", text: "Qué es un complemento alimenticio" },
    { kind: "p", text: `El [Real Decreto 1487/2009](${RD1487}) los define como productos alimenticios cuyo fin es complementar la dieta normal, hechos con fuentes concentradas de nutrientes u otras sustancias con efecto nutricional o fisiológico, y vendidos en forma dosificada: cápsulas, pastillas, tabletas, sobres de polvo, ampollas, cuentagotas y formas similares que se toman en pequeñas cantidades unitarias. Las gominolas no se nombran expresamente; se entiende que entran como «formas similares», y conviene confirmarlo con el fabricante y la autoridad que recibe la notificación.` },
    { kind: "p", text: `La frontera con el medicamento importa: si un producto se presenta con propiedades para tratar o prevenir enfermedades, o actúa por acción farmacológica, es medicamento, y en caso de duda se aplica la ley del medicamento ([Real Decreto Legislativo 1/2015](${RDL1}), arts. 2 y 8.6).` },
    { kind: "h2", text: "Cómo se pone en el mercado" },
    { kind: "table", head: ["Paso", "Qué dice la norma"], rows: [
      ["Notificación", "El responsable de la comercialización en España notifica la puesta en el mercado enviando la etiqueta, antes o a la vez que la primera venta (RD 1487/2009, art. 9.1). No es una autorización."],
      ["Ante quién", "Ante la comunidad autónoma del domicilio social; si la empresa no tiene domicilio en España o el producto viene de un tercer país, ante la AESAN."],
      ["Quién la presenta", "El fabricante, el responsable de la primera puesta en el mercado o, si viene de fuera de la UE, el importador."],
      ["Sin notificar", "Es infracción grave (art. 11.2)."],
      ["Registro sanitario", `La empresa debe estar inscrita en el Registro General Sanitario de Empresas Alimentarias y Alimentos ([Real Decreto 191/2011](${RD191})).`],
    ] },
    { kind: "h2", text: "La marca responde de la etiqueta aunque fabrique otro" },
    { kind: "p", text: `El responsable de la información alimentaria es el operador con cuyo nombre o razón social se comercializa el alimento, y debe garantizar que esa información está y es exacta ([Reglamento (UE) 1169/2011](${R1169}), art. 8). En marca blanca, eso es tu empresa. El fabricante a terceros no debe suministrar productos que sepa que no cumplen, pero la norma no reparte el resto de responsabilidades: hay que fijarlas en el contrato de fabricación.` },
    { kind: "h2", text: "Qué debe llevar la etiqueta" },
    { kind: "list", items: [
      "La denominación «complemento alimenticio» (RD 1487/2009, art. 5.2).",
      "Las categorías de nutrientes o sustancias que caracterizan el producto y la dosis recomendada para consumo diario.",
      "La advertencia de no superar la dosis diaria expresamente recomendada.",
      "La afirmación de que los complementos alimenticios no deben utilizarse como sustituto de una dieta equilibrada.",
      "La indicación de mantener el producto fuera del alcance de los niños más pequeños, y las advertencias específicas del anexo cuando correspondan.",
      "Las cantidades por dosis en forma numérica y, para vitaminas y minerales, también en porcentaje de los valores de referencia (art. 6).",
      "Las menciones generales del Reglamento 1169/2011 (ingredientes, alérgenos, cantidad neta, fecha, operador) con una altura de la «x» de al menos 1,2 mm.",
    ] },
    { kind: "p", text: `Está prohibido atribuir al producto la propiedad de prevenir, tratar o curar una enfermedad (art. 5.4). Las declaraciones de salud solo pueden ser las autorizadas en el [Registro de la UE](${EU_REG}), en sus condiciones de uso; las de plantas pendientes de decisión se rigen por un régimen transitorio ([AESAN](${AESAN_DC})).` },
    { kind: "h2", text: "Límites de ingredientes" },
    { kind: "list", items: [
      "Vitaminas y minerales: solo los del anexo I y en las formas del anexo II del Reglamento (CE) 1170/2009 (RD 1487/2009, art. 3.1).",
      "Otras sustancias: la dosis diaria no puede superar los máximos del anexo del real decreto; por ejemplo, 200 mg de coenzima Q-10 o 500 mg de glucosamina.",
      "Ingredientes sin consumo significativo en la UE antes del 15 de mayo de 1997: necesitan autorización como nuevo alimento (Reglamento (UE) 2015/2283).",
      "Plantas: la armonización en la UE es parcial y el Ministerio de Consumo consultó en 2025 una modificación del real decreto para incorporar plantas; revisamos esta página cuando se apruebe.",
    ] },
    { kind: "h2", text: "Qué necesitamos para pedirte presupuestos" },
    { kind: "list", items: [
      "Forma y presentación: cápsulas, comprimidos, gominolas o polvo; unidades por envase y tipo de envase.",
      "Cantidad del primer pedido y la que esperas en recompras.",
      "Tu fórmula, o el objetivo del producto si necesitas que la desarrollen.",
      "Si quieres que el fabricante se encargue de la notificación y del diseño técnico de la etiqueta.",
    ] },
  ],
  faqs: [
    { q: "¿Necesito autorización sanitaria para vender un complemento alimenticio en España?", a: "No. Hay que notificar la puesta en el mercado enviando la etiqueta, y esa notificación no es una autorización (RD 1487/2009, art. 9)." },
    { q: "¿Quién presenta la notificación, mi marca o el fabricante?", a: "El responsable de la comercialización en España. La puede presentar el fabricante, el responsable de la primera puesta en el mercado o el importador si el producto viene de fuera de la UE." },
    { q: "Mi empresa no está en España. ¿Ante quién se notifica?", a: "Ante la AESAN (RD 1487/2009, art. 9.1.b)." },
    { q: "¿Quién responde de lo que dice la etiqueta si fabrica otra empresa?", a: "La empresa con cuyo nombre se comercializa el producto, es decir, tu marca (Reglamento (UE) 1169/2011, art. 8)." },
    { q: "¿Puedo decir que mi complemento previene o cura algo?", a: "No. Está prohibido (RD 1487/2009, art. 5.4). Solo se pueden usar declaraciones de salud autorizadas en el Registro de la UE." },
    { q: "¿Hay un tamaño mínimo de letra en la etiqueta?", a: "Sí: la altura de la «x» debe ser igual o superior a 1,2 mm (Reglamento (UE) 1169/2011, art. 13.2)." },
  ],
  sources: [
    { label: "Real Decreto 1487/2009, texto consolidado (BOE)", url: RD1487 },
    { label: "Real Decreto 191/2011, Registro General Sanitario (BOE)", url: RD191 },
    { label: "Reglamento (UE) 1169/2011 (BOE)", url: R1169 },
    { label: "Real Decreto Legislativo 1/2015, ley del medicamento (BOE)", url: RDL1 },
    { label: "Declaraciones nutricionales y de salud (AESAN)", url: AESAN_DC },
    { label: "Registro de la UE de declaraciones de salud (Comisión Europea)", url: EU_REG },
  ],
};
