import { FormWithMessage } from "@/app/ui/form-message";
import { login } from "@/app/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "log in | pats vainīgs",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="page-title">laipni lūgts krīzē.</h1>
      <FormWithMessage action={login} className="form-stack">
        <div className="form-field">
          <label htmlFor="username">tavs pretenciozais lietotājvārds</label>
          <input id="username" name="username" type="text" required autoFocus />
        </div>
        <div className="form-field">
          <label htmlFor="password">droša parole</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit" className="form-submit">
          ielogoties
        </button>
        <p className="form-footer">
          nav profila? <Link href="/register">pievienojies krīzei</Link>
        </p>
      </FormWithMessage>
    </div>
  );
}
