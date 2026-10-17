import type { PageDoc } from "@/content/types";
import { site } from "@/config/site";
import { Inline } from "@/components/Blocks";

/** Aviso legal y privacidad. Los datos del operador salen de la configuración (variables de entorno en Netlify). */
const pending = "[pendiente]";

const copy = {
  es: {
    who: "Quién opera este sitio",
    whoRows: ["Titular", "Identificación fiscal", "Domicilio", "Contacto"],
    what: "Qué datos recogemos y para qué",
    whatText: "Los datos de la solicitud de presupuesto (producto, cantidades, mercado, nombre, empresa, correo y, si lo das, teléfono) y su procedencia (página de entrada y parámetros de campaña). Los usamos solo para gestionar tu solicitud: estudiarla, contactarte y, con tu permiso, presentar el proyecto a fabricantes compatibles.",
    basis: "Base legal",
    basisText: "Tu consentimiento al enviar el formulario y la aplicación de medidas precontractuales a petición tuya (artículo 6.1, letras a y b, del Reglamento General de Protección de Datos).",
    share: "Con quién se comparten",
    shareText: "Con ningún fabricante sin tu permiso expreso. El formulario y el sitio se alojan en Netlify, Inc. (Estados Unidos), que trata los datos por cuenta nuestra como proveedor técnico.",
    keep: "Cuánto tiempo los guardamos",
    keepText: "Mientras gestionamos tu solicitud y hasta 24 meses después del último contacto, salvo que nos pidas antes que los borremos.",
    rights: "Tus derechos",
    rightsText: "Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al contacto indicado arriba. Si consideras que no hemos atendido bien tu petición, puedes reclamar ante la autoridad de protección de datos; en España, la Agencia Española de Protección de Datos ([aepd.es](https://www.aepd.es)).",
    activity: "Actividad",
    activityText: "Este sitio presta un servicio de intermediación comercial entre marcas y fabricantes por contrato. No vende medicamentos, suplementos ni ningún otro producto. La información regulatoria publicada es orientativa y enlaza a la norma oficial, que prevalece.",
  },
  pt: {
    who: "Quem opera este site",
    whoRows: ["Titular", "Identificação fiscal", "Endereço", "Contato"],
    what: "Que dados coletamos e para quê",
    whatText: "Os dados da solicitação de orçamento (produto, quantidades, mercado, nome, empresa, e-mail e, se informado, telefone) e sua origem (página de entrada e parâmetros de campanha). Usamos apenas para gerenciar sua solicitação: analisá-la, contatar você e, com sua permissão, apresentar o projeto a fabricantes compatíveis.",
    basis: "Base legal",
    basisText: "Seu consentimento ao enviar o formulário e a execução de procedimentos preliminares a pedido seu (LGPD, art. 7º, I e V; RGPD, art. 6.1, a e b).",
    share: "Com quem compartilhamos",
    shareText: "Com nenhum fabricante sem sua permissão expressa. O formulário e o site são hospedados pela Netlify, Inc. (Estados Unidos), que trata os dados por nossa conta como fornecedor técnico.",
    keep: "Por quanto tempo guardamos",
    keepText: "Enquanto gerenciamos sua solicitação e até 24 meses após o último contato, salvo se você pedir antes a exclusão.",
    rights: "Seus direitos",
    rightsText: "Você pode solicitar acesso, correção, exclusão, oposição e portabilidade escrevendo para o contato indicado acima, e reclamar perante a autoridade de proteção de dados competente (no Brasil, a ANPD).",
    activity: "Atividade",
    activityText: "Este site presta um serviço de intermediação comercial entre marcas e fabricantes terceirizados. Não vende medicamentos, suplementos nem qualquer outro produto. A informação regulatória publicada é orientativa e remete à norma oficial, que prevalece.",
  },
  en: {
    who: "Who runs this site",
    whoRows: ["Operator", "Tax ID", "Address", "Contact"],
    what: "What data we collect and why",
    whatText: "The details in your quote request (product, quantities, market, name, company, email and, if given, phone) and where it came from (landing page and campaign parameters). We use them only to handle your request: review it, contact you and, with your permission, present the project to compatible manufacturers.",
    basis: "Legal basis",
    basisText: "Your consent when submitting the form and steps taken at your request before entering into a contract (Article 6(1)(a) and (b) GDPR).",
    share: "Who we share it with",
    shareText: "No manufacturer, without your express permission. The form and site are hosted by Netlify, Inc. (United States), which processes the data on our behalf as a technical provider.",
    keep: "How long we keep it",
    keepText: "While we handle your request and for up to 24 months after our last contact, unless you ask us to delete it sooner.",
    rights: "Your rights",
    rightsText: "You can request access, rectification, erasure, objection, restriction and portability by writing to the contact above, and you can complain to your data protection authority.",
    activity: "Activity",
    activityText: "This site provides commercial intermediation between brands and contract manufacturers. It does not sell medicines, supplements or any other products. Regulatory information is for guidance and links to the official regulation, which prevails.",
  },
} as const;


export function Legal({ page }: { page: PageDoc }) {
  const C = copy[page.locale];
  const o = site.operator;
  const vals = [o.legalName, o.taxId, o.address, site.contactEmail].map((v) => v || pending);
  const sections: [string, string][] = [[C.what, C.whatText], [C.basis, C.basisText], [C.share, C.shareText], [C.keep, C.keepText], [C.rights, C.rightsText], [C.activity, C.activityText]];
  return (
    <article className="wrap py-14">
      <h1>{page.title}</h1>
      <h2 className="mt-12">{C.who}</h2>
      <dl className="mt-4 max-w-prose border-t border-rule">
        {C.whoRows.map((r, i) => (
          <div key={r} className="grid grid-cols-[11rem_1fr] gap-3 border-b border-rule py-2">
            <dt className="font-semibold text-muted">{r}</dt><dd>{vals[i]}</dd>
          </div>
        ))}
      </dl>
      {sections.map(([h, p]) => (
        <section key={h}><h2 className="mt-12">{h}</h2><p className="mt-4 max-w-prose"><Inline text={p} /></p></section>
      ))}
    </article>
  );
}
