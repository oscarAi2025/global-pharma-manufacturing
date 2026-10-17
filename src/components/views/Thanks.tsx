import type { PageDoc } from "@/content/types";
import { t } from "@/content/ui";

export function Thanks({ page }: { page: PageDoc }) {
  const L = t(page.locale);
  return (
    <div className="wrap py-20">
      <h1>{L.form.sent}</h1>
      <p className="lead mt-6">{L.form.sentText}</p>
    </div>
  );
}
