import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const fieldCls =
  "h-11 rounded-none border-input bg-void/60 text-frost placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/40 aria-[invalid=true]:border-destructive";

function Wrap({
  id,
  label,
  error,
  hint,
  required,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`f-${id}`} className="font-hud text-[0.65rem] text-steel">
        {label} {required && <span className="text-neon-soft">*</span>}
      </Label>
      {children}
      {error ? (
        <p id={`f-${id}-err`} className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle className="size-3.5" /> {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type Base = { id: string; label: string; error?: string | undefined; hint?: string | undefined; required?: boolean | undefined; className?: string | undefined };

export function TextField({
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  autoComplete,
  inputMode,
  ...b
}: Base & {
  value: string | number | undefined;
  onChange: (v: string) => void;
  type?: string | undefined;
  placeholder?: string | undefined;
  maxLength?: number | undefined;
  autoComplete?: string | undefined;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] | undefined;
}) {
  return (
    <Wrap {...b}>
      <Input
        id={`f-${b.id}`}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!b.error}
        aria-describedby={b.error ? `f-${b.id}-err` : undefined}
        className={fieldCls}
      />
    </Wrap>
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 5,
  ...b
}: Base & { value: string | undefined; onChange: (v: string) => void; placeholder?: string | undefined; maxLength?: number | undefined; rows?: number | undefined }) {
  return (
    <Wrap {...b}>
      <Textarea
        id={`f-${b.id}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={!!b.error}
        aria-describedby={b.error ? `f-${b.id}-err` : undefined}
        className={cn(fieldCls, "h-auto min-h-28 resize-y")}
      />
      {maxLength && (
        <p className="font-hud text-right text-[0.6rem] text-muted-foreground">
          {(value ?? "").length}/{maxLength}
        </p>
      )}
    </Wrap>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  ...b
}: Base & { value: string | undefined; onChange: (v: string) => void; options: readonly string[]; placeholder?: string | undefined }) {
  return (
    <Wrap {...b}>
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger id={`f-${b.id}`} aria-invalid={!!b.error} className={cn(fieldCls, "w-full")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-none border-border bg-popover">
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Wrap>
  );
}

export function PrivacyCheck({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string | undefined }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id="f-privacy_accepted"
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={!!error}
          className="mt-0.5 rounded-none border-primary/60 data-[state=checked]:bg-primary"
        />
        <Label htmlFor="f-privacy_accepted" className="text-sm font-normal leading-relaxed text-steel">
          He leído y acepto la{" "}
          <Link to="/privacidad" target="_blank" className="text-neon-soft underline underline-offset-4">
            política de privacidad
          </Link>
          .
        </Label>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

/** Invisible field for bots. */
export function Honeypot({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        No rellenar
        <input tabIndex={-1} autoComplete="off" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function FormBlock({ code, title, children }: { code: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="panel-hud p-6 md:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3">
        <span className="font-hud text-[0.65rem] text-primary">{code}</span>
        <h3 className="font-display text-lg uppercase tracking-[0.14em] text-frost">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function SubmitBar({ submitting, label, formError }: { submitting: boolean; label: string; formError: string | null }) {
  return (
    <div className="space-y-4">
      {formError && (
        <div role="alert" className="flex items-start gap-3 border border-destructive/60 bg-destructive/10 p-4 text-sm text-frost">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /> {formError}
        </div>
      )}
      <Button type="submit" variant="neon" size="xl" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Transmitiendo…
          </>
        ) : (
          label
        )}
      </Button>
    </div>
  );
}

export function SuccessPanel({ title, children, onReset, resetLabel }: { title: string; children: ReactNode; onReset?: (() => void) | undefined; resetLabel?: string | undefined }) {
  return (
    <div role="status" className="panel-hud relative overflow-hidden p-8 text-center md:p-14">
      <div aria-hidden className="scanlines absolute inset-0 opacity-30" />
      <CheckCircle2 className="relative mx-auto size-14 text-success drop-shadow-[0_0_14px_var(--success)]" />
      <p className="font-hud relative mt-6 text-[0.65rem] text-success">Transmisión recibida</p>
      <h2 className="relative mt-3 font-display text-3xl font-bold uppercase text-frost md:text-4xl">{title}</h2>
      <div className="relative mx-auto mt-4 max-w-xl text-steel">{children}</div>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="hud">
          <Link to="/">Volver al inicio</Link>
        </Button>
        {onReset && (
          <Button variant="quiet" onClick={onReset}>
            {resetLabel ?? "Enviar otro"}
          </Button>
        )}
      </div>
    </div>
  );
}
