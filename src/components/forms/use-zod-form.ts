import { useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/schemas";

type Status = "idle" | "submitting" | "success" | "error";

/** Minimal form state: client-side zod validation, then a server submit. */
export function useZodForm<S extends z.ZodTypeAny>(
  schema: S,
  initial: z.input<S>,
  submit: (data: z.output<S>) => Promise<{ ok: true } | { ok: false; error: string }>,
) {
  const [values, setValues] = useState<z.input<S>>(initial);
  const [errors, setErrors] = useState<{ [K in keyof z.input<S>]?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function set<K extends keyof z.input<S>>(key: K, value: z.input<S>[K]) {
    setValues((v: z.input<S>) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe as { [K in keyof z.input<S>]?: string });
      const first = Object.keys(fe)[0];
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await submit(parsed.data);
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setFormError(res.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFormError("No se ha podido completar el envío. Revisa los datos e inténtalo de nuevo.");
    }
  }

  function reset() {
    setValues(initial);
    setErrors({});
    setStatus("idle");
    setFormError(null);
  }

  return { values, set, errors, status, formError, onSubmit, reset };
}
