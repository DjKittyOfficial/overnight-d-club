import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Inbox, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, refCode } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ConfirmDelete } from "./ConfirmDelete";
import { StatusBadge } from "./StatusBadge";

type Row = Record<string, unknown> & { id: string; status: string; created_at: string; admin_notes: string | null; reviewed?: boolean };

export type RecordsConfig = {
  table: "applications" | "alliances" | "contact_messages";
  noun: string;
  prefix: string;
  statuses: readonly { value: string; label: string }[];
  hasReviewed: boolean;
  primary: (r: Row) => string;
  secondary: (r: Row) => string;
  fields: { key: string; label: string; long?: boolean }[];
};

export function RecordsManager({ config }: { config: RecordsConfig }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const key = ["admin", config.table];
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(config.table as "applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as unknown as Row[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from(config.table as "applications").update(patch as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Cambios guardados");
    },
    onError: () => toast.error("No se pudieron guardar los cambios"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table as "applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setOpenId(null);
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Registro eliminado");
    },
    onError: () => toast.error("No se pudo eliminar"),
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!term || `${config.primary(r)} ${config.secondary(r)} ${String(r["email"] ?? "")}`.toLowerCase().includes(term)),
    );
  }, [data, filter, q, config]);

  const current = data?.find((r) => r.id === openId) ?? null;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="h-10 rounded-none pl-9" aria-label="Buscar" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-10 w-full rounded-none md:w-56" aria-label="Filtrar por estado">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="all">Todos los estados</SelectItem>
            {config.statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-none" />)}</div>
      ) : error ? (
        <p role="alert" className="border border-destructive/60 bg-destructive/10 p-4 text-sm">No se pudieron cargar los datos.</p>
      ) : rows.length === 0 ? (
        <div className="panel-hud p-12 text-center">
          <Inbox className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-steel">No hay registros{filter !== "all" || q ? " con estos filtros" : " todavía"}.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setOpenId(r.id)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/40"
              >
                {config.hasReviewed && (
                  r.reviewed ? <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Revisada" /> : <Circle className="size-4 shrink-0 text-warning" aria-label="Sin revisar" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-frost">{config.primary(r)}</p>
                  <p className="truncate text-sm text-muted-foreground">{config.secondary(r)}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="font-hud text-[0.58rem] text-steel">{refCode(r.id, config.prefix)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.created_at, true)}</p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!current} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-none border-border bg-popover">
          {current && (
            <Detail
              key={current.id}
              row={current}
              config={config}
              saving={update.isPending}
              deleting={remove.isPending}
              onSave={(patch) => update.mutate({ id: current.id, patch })}
              onDelete={() => remove.mutate(current.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({
  row,
  config,
  saving,
  deleting,
  onSave,
  onDelete,
}: {
  row: Row;
  config: RecordsConfig;
  saving: boolean;
  deleting: boolean;
  onSave: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.admin_notes ?? "");

  return (
    <>
      <DialogHeader>
        <p className="font-hud text-[0.6rem] text-neon-soft">{refCode(row.id, config.prefix)} · {formatDate(row.created_at, true)}</p>
        <DialogTitle className="font-display text-2xl uppercase text-frost">{config.primary(row)}</DialogTitle>
        <DialogDescription>Expediente completo de {config.noun}.</DialogDescription>
      </DialogHeader>
      <dl className="mt-2 space-y-4">
        {config.fields.map((f) => {
          const v = row[f.key];
          const text = v === null || v === undefined || v === "" ? "—" : String(v);
          return (
            <div key={f.key} className={cn(!f.long && "grid gap-1 sm:grid-cols-[180px_1fr]")}>
              <dt className="font-hud text-[0.58rem] text-muted-foreground">{f.label}</dt>
              <dd className={cn("text-sm text-frost", f.long && "mt-1 whitespace-pre-wrap border border-border bg-void/50 p-3")}>
                {f.key === "email" && text !== "—" ? <a className="text-neon-soft" href={`mailto:${text}`}>{text}</a> : text}
              </dd>
            </div>
          );
        })}
      </dl>
      <div className="mt-4 space-y-4 border-t border-border pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-hud text-[0.6rem]">Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-none">
                {config.statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {config.hasReviewed && (
            <div className="flex items-end">
              <Button
                variant={row.reviewed ? "hud" : "outline"}
                className="w-full rounded-none"
                disabled={saving}
                onClick={() => onSave({ reviewed: !row.reviewed })}
              >
                {row.reviewed ? <><CheckCircle2 /> Revisada · desmarcar</> : <><Circle /> Marcar como revisada</>}
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes" className="font-hud text-[0.6rem]">Notas internas</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} className="rounded-none" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ConfirmDelete what={`este registro`} onConfirm={onDelete} disabled={deleting} />
          <Button variant="neon" disabled={saving} onClick={() => onSave({ status, admin_notes: notes.trim() || null })}>
            {saving && <Loader2 className="animate-spin" />} Guardar cambios
          </Button>
        </div>
      </div>
    </>
  );
}
