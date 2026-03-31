import { FormWithMessage } from "@/app/ui/form-message";
import { register } from "@/app/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "register | pats vainīgs",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="page-title">join the collective disappointment</h1>
      <FormWithMessage action={register} className="form-stack">
        <div className="form-field">
          <label htmlFor="username">username</label>
          <input id="username" name="username" type="text" required autoFocus />
        </div>
        <div className="form-field">
          <label htmlFor="nickname">nickname</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            placeholder="how others will know you"
          />
        </div>
        <div className="form-field">
          <label htmlFor="tag">tag (optional)</label>
          <input
            id="tag"
            name="tag"
            type="text"
            placeholder="e.g. cynic, realist, optimist-in-denial"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit" className="form-submit">
          create account
        </button>
        <p className="form-footer">
          already miserable? <Link href="/login">log in</Link>
        </p>
      </FormWithMessage>
    </div>
  );
}
