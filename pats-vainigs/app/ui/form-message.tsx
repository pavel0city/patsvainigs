"use client";

import { useActionState } from "react";

type ServerAction = (formData: FormData) => Promise<{ error?: string } | void>;

export function FormWithMessage({
  action,
  children,
  className,
}: {
  action: ServerAction;
  children: React.ReactNode;
  className?: string;
}) {
  const wrapped = async (
    _prev: { error?: string } | null,
    formData: FormData
  ): Promise<{ error?: string } | null> => {
    const result = await action(formData);
    return result ?? null;
  };

  const [state, formAction, pending] = useActionState(wrapped, null);

  return (
    <form action={formAction} className={className}>
      {state?.error && <p className="form-error">{state.error}</p>}
      {children}
      {pending && <span className="loading">working on it...</span>}
    </form>
  );
}
