import { adminConfigured } from "@/server/auth";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <main className="wrap flex min-h-screen flex-col justify-center py-16">
      <div className="sheet mx-auto w-full max-w-md">
        <div className="sheet-head"><h1 className="sheet-title">CRM · acceso</h1></div>
        {adminConfigured() ? <LoginForm /> : (
          <p className="px-6 py-5 text-muted">El acceso no está configurado. Añade en Netlify las variables <code>ADMIN_PASSWORD</code> y <code>SESSION_SECRET</code> (32 caracteres o más) y vuelve a desplegar.</p>
        )}
      </div>
    </main>
  );
}
