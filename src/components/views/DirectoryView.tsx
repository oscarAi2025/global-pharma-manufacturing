import type { PageDoc } from "@/content/types";
import { pageOf, pathOf } from "@/content/registry";
import { publicManufacturers } from "@/server/public";
import { Directory } from "@/components/Directory";
import { t } from "@/content/ui";

export async function DirectoryView({ page }: { page: PageDoc }) {
  const items = await publicManufacturers();
  const q = pageOf(page.locale, "quote");
  return (
    <div className="wrap py-14">
      <h1>{page.title}</h1>
      <p className="lead mt-5">{t(page.locale).dir.lead}</p>
      <div className="mt-10"><Directory locale={page.locale} items={items} quotePath={q ? pathOf(q) : "/"} /></div>
    </div>
  );
}
