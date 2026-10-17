"use client";
import { useActionState } from "react";
import { login } from "@/server/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="sheet-body">
      <div className="row"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full border-b border-dashed border-rule bg-transparent py-1 text-lg" /></div>
      {state?.error && <p className="field-error px-6 pt-3" role="alert">{state.error}</p>}
      <div className="sheet-actions"><button className="btn" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button></div>
    </form>
  );
}
