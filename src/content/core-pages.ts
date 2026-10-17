import type { PageInput } from "./types";

const R = "2026-10-17";
const E = "Equipo editorial";

/** Páginas estructurales (portada, cómo funciona, presupuesto, gracias, aviso legal) en los tres idiomas. */
export const corePages: PageInput[] = [
  // Portadas
  { id: "home-es", group: "home", locale: "es", slug: [], type: "home", status: "published", intent: "commercial", cluster: "home",
    title: "Fabricación de suplementos por contrato", metaTitle: "Fabricantes de suplementos por contrato | Presupuestos gratis",
    description: "Cuéntanos qué suplemento quieres fabricar y te presentamos presupuestos de fabricantes por contrato compatibles. Gratis y sin registro.",
    primaryKeyword: "fabricantes de suplementos por contrato", reviewedAt: R, editor: E },
  { id: "home-pt", group: "home", locale: "pt", slug: [], type: "home", status: "published", intent: "commercial", cluster: "home",
    title: "Fabricação terceirizada de suplementos", metaTitle: "Fabricação terceirizada de suplementos | Orçamentos grátis",
    description: "Conte qual suplemento você quer fabricar e apresentamos orçamentos de fabricantes terceirizados compatíveis. Gratuito e sem cadastro.",
    primaryKeyword: "fabricação terceirizada de suplementos", reviewedAt: R, editor: E },
  { id: "home-en", group: "home", locale: "en", slug: [], type: "home", status: "published", intent: "commercial", cluster: "home",
    title: "Supplement contract manufacturing", metaTitle: "Supplement contract manufacturers | Free quotes",
    description: "Tell us what supplement you need to manufacture and we present quotes from compatible contract manufacturers. Free, no sign-up.",
    primaryKeyword: "supplement contract manufacturers", reviewedAt: R, editor: E },

  // Cómo funciona
  { id: "how-es", group: "how", locale: "es", slug: ["como-funciona"], type: "how", status: "published", intent: "informational", cluster: "servicio",
    title: "Cómo funciona", metaTitle: "Cómo funciona la búsqueda de fabricante | Paso a paso",
    description: "De tu solicitud al contrato con el fabricante: qué hacemos en cada paso, qué datos necesitas y quién paga el servicio.",
    reviewedAt: R, editor: E },
  { id: "how-pt", group: "how", locale: "pt", slug: ["como-funciona"], type: "how", status: "published", intent: "informational", cluster: "servico",
    title: "Como funciona", metaTitle: "Como funciona a busca de fabricante | Passo a passo",
    description: "Da sua solicitação ao contrato com o fabricante: o que fazemos em cada etapa, que dados você precisa e quem paga o serviço.",
    reviewedAt: R, editor: E },
  { id: "how-en", group: "how", locale: "en", slug: ["how-it-works"], type: "how", status: "published", intent: "informational", cluster: "service",
    title: "How it works", metaTitle: "How finding a contract manufacturer works | Step by step",
    description: "From your request to the contract with the manufacturer: what we do at each step, what details you need and who pays for the service.",
    reviewedAt: R, editor: E },

  // Solicitud de presupuesto
  { id: "quote-es", group: "quote", locale: "es", slug: ["solicitar-presupuesto"], type: "quote", status: "published", intent: "transactional", cluster: "conversion",
    title: "Pide presupuesto de fabricación", metaTitle: "Pide presupuesto de fabricación de suplementos | Gratis",
    description: "Describe tu producto en dos minutos: forma, cantidad y país de venta. Buscamos fabricantes compatibles y te presentamos los presupuestos.",
    reviewedAt: R, editor: E },
  { id: "quote-pt", group: "quote", locale: "pt", slug: ["solicitar-orcamento"], type: "quote", status: "published", intent: "transactional", cluster: "conversao",
    title: "Peça orçamento de fabricação", metaTitle: "Peça orçamento de fabricação de suplementos | Grátis",
    description: "Descreva seu produto em dois minutos: forma, quantidade e país de venda. Buscamos fabricantes compatíveis e apresentamos os orçamentos.",
    reviewedAt: R, editor: E },
  { id: "quote-en", group: "quote", locale: "en", slug: ["request-quote"], type: "quote", status: "published", intent: "transactional", cluster: "conversion",
    title: "Get manufacturing quotes", metaTitle: "Get supplement manufacturing quotes | Free",
    description: "Describe your product in two minutes: dosage form, quantity and target market. We find compatible manufacturers and present the quotes.",
    reviewedAt: R, editor: E },

  // Directorio de capacidades (fabricantes con acuerdo, anonimizados)
  { id: "dir-es", group: "directory", locale: "es", slug: ["fabricantes"], type: "directory", status: "published", intent: "commercial", cluster: "directorio",
    title: "Fabricantes por contrato", metaTitle: "Fabricantes por contrato: capacidades y certificaciones",
    description: "Capacidades documentadas de los fabricantes por contrato con los que trabajamos: formas, certificaciones verificadas y pedido mínimo. Filtra y pide presupuesto.",
    reviewedAt: R, editor: E },
  { id: "dir-pt", group: "directory", locale: "pt", slug: ["fabricantes"], type: "directory", status: "published", intent: "commercial", cluster: "diretorio",
    title: "Fabricantes terceirizados", metaTitle: "Fabricantes terceirizados: capacidades e certificações",
    description: "Capacidades documentadas dos fabricantes terceirizados com quem trabalhamos: formas, certificações verificadas e lote mínimo. Filtre e peça orçamento.",
    reviewedAt: R, editor: E },
  { id: "dir-en", group: "directory", locale: "en", slug: ["manufacturers"], type: "directory", status: "published", intent: "commercial", cluster: "directory",
    title: "Contract manufacturers", metaTitle: "Contract manufacturers: capabilities and certifications",
    description: "Documented capabilities of the contract manufacturers we work with: dosage forms, verified certifications and minimum orders. Filter and request quotes.",
    reviewedAt: R, editor: E },

  // Gracias (sin indexar)
  { id: "thanks-es", group: "thanks", locale: "es", slug: ["gracias"], type: "thanks", status: "noindex", intent: "navigational", cluster: "conversion",
    title: "Solicitud enviada", metaTitle: "Solicitud enviada | Global Pharma Manufacturing",
    description: "Hemos recibido tu solicitud de presupuesto de fabricación. Te escribiremos al correo indicado con los siguientes pasos.", reviewedAt: R, editor: E },
  { id: "thanks-pt", group: "thanks", locale: "pt", slug: ["obrigado"], type: "thanks", status: "noindex", intent: "navigational", cluster: "conversao",
    title: "Solicitação enviada", metaTitle: "Solicitação enviada | Global Pharma Manufacturing",
    description: "Recebemos sua solicitação de orçamento de fabricação. Vamos escrever para o e-mail informado com os próximos passos.", reviewedAt: R, editor: E },
  { id: "thanks-en", group: "thanks", locale: "en", slug: ["thank-you"], type: "thanks", status: "noindex", intent: "navigational", cluster: "conversion",
    title: "Request sent", metaTitle: "Request sent | Global Pharma Manufacturing",
    description: "We've received your manufacturing quote request. We'll email you at the address you gave us with the next steps.", reviewedAt: R, editor: E },

  // Aviso legal y privacidad (sin indexar; datos del operador desde la configuración)
  { id: "legal-es", group: "legal", locale: "es", slug: ["aviso-legal"], type: "legal", status: "noindex", intent: "navigational", cluster: "legal",
    title: "Aviso legal y privacidad", metaTitle: "Aviso legal y política de privacidad",
    description: "Quién opera este sitio, para qué usamos los datos de las solicitudes de presupuesto, cuánto tiempo los guardamos y cómo ejercer tus derechos.", reviewedAt: R, editor: E },
  { id: "legal-pt", group: "legal", locale: "pt", slug: ["aviso-legal"], type: "legal", status: "noindex", intent: "navigational", cluster: "legal",
    title: "Aviso legal e privacidade", metaTitle: "Aviso legal e política de privacidade",
    description: "Quem opera este site, para que usamos os dados das solicitações de orçamento, por quanto tempo os guardamos e como exercer seus direitos.", reviewedAt: R, editor: E },
  { id: "legal-en", group: "legal", locale: "en", slug: ["legal"], type: "legal", status: "noindex", intent: "navigational", cluster: "legal",
    title: "Legal notice and privacy", metaTitle: "Legal notice and privacy policy",
    description: "Who runs this site, what we use quote-request data for, how long we keep it and how to exercise your data protection rights.", reviewedAt: R, editor: E },
];
