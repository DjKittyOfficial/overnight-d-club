import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminTitle } from "@/components/admin/AdminShell";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TextAreaField, TextField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatDate } from "@/lib/format";
import { announcementSchema, fieldErrors } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/admin/comunicados")({
  head: () => ({ meta: [
    { title: "Administración de comunicados — OverNight D Club" },
    { name: "description", content: "Administración de comunicados en el panel privado de OverNight D Club." },
    { property: "og:title", content: "Administración de comunicados — OverNight D Club" },
    { property: "og:description", content: "Administración de comunicados en el panel privado de OverNight D Club." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AnnouncementsAdmin,
});

type A = Tables<"announcements">;
const BUCKET = "announcement-images";
const KEY = ["admin", "announcements"];

function AnnouncementsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<A | "new" | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: KEY });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    qc.invalidateQueries({ queryKey: ["announcements"] });
  };

  const toggle = useMutation({
    mutationFn: async (a: A) => {
      const publish = !a.published;
      const { error } = await supabase
        .from("announcements")
        .update({ published: publish, published_at: publish ? a.published_at ?? new Date().toISOString() : a.published_at })
        .eq("id", a.id);
      if (error) throw error;
      return publish;
    },
    onSuccess: (p) => {
      invalidate();
      toast.success(p ? "Comunicado publicado" : "Comunicado despublicado");
    },
    onError: () => toast.error("No se pudo cambiar el estado"),
  });

  const remove = useMutation({
    mutationFn: async (a: A) => {
      const { error } = await supabase.from("announcements").delete().eq("id", a.id);
      if (error) throw error;
      if (a.image_url) await supabase.storage.from(BUCKET).remove([a.image_url]);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Comunicado eliminado");
    },
    onError: () => toast.error("No se pudo eliminar"),
  });

  return (
    <>
      <AdminTitle code="CM" title="Comunicados">
        <Button variant="neon" onClick={() => setEditing("new")}>
          <Plus /> Nuevo comunicado
        </Button>
      </AdminTitle>

      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-none" />)}</div>
      ) : error ? (
        <p role="alert" className="border border-destructive/60 bg-destructive/10 p-4 text-sm">No se pudieron cargar los comunicados.</p>
      ) : !data?.length ? (
        <div className="panel-hud p-12 text-center">
          <p className="text-steel">Todavía no hay comunicados.</p>
          <Button variant="hud" className="mt-6" onClick={() => setEditing("new")}>
            <Plus /> Redactar el primero
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border bg-card">
          {data.map((a) => (
            <li key={a.id} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.published ? "publicado" : "borrador"} />
                  <span className="font-hud text-[0.58rem] text-primary">{a.category}</span>
                </div>
                <p className="mt-2 truncate font-medium text-frost">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.published ? `Publicado ${formatDate(a.published_at, true)}` : `Actualizado ${formatDate(a.updated_at, true)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="hud" size="sm" onClick={() => toggle.mutate(a)} disabled={toggle.isPending}>
                  {a.published ? <><EyeOff /> Despublicar</> : <><Eye /> Publicar</>}
                </Button>
                <Button variant="outline" size="sm" className="rounded-none" onClick={() => setEditing(a)}>
                  <Pencil /> Editar
                </Button>
                <ConfirmDelete what="este comunicado" onConfirm={() => remove.mutate(a)} disabled={remove.isPending} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-none border-border bg-popover">
          {editing && (
            <Editor
              key={editing === "new" ? "new" : editing.id}
              initial={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                invalidate();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Editor({ initial, onDone }: { initial: A | null; onDone: () => void }) {
  const [v, setV] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? "General",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
  });
  const [published, setPublished] = useState(initial?.published ?? false);
  const [imagePath, setImagePath] = useState<string | null>(initial?.image_url ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useQuery({
    queryKey: ["admin", "img", imagePath],
    enabled: !!imagePath && !file,
    queryFn: async () => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(imagePath!, 3600);
      setPreview(data?.signedUrl ?? null);
      return data?.signedUrl ?? null;
    },
  });

  function pick(f: File | undefined) {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      toast.error("Formato no admitido (JPG, PNG o WEBP)");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("La imagen supera 5 MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = announcementSchema.safeParse(v);
    if (!r.success) return setErrors(fieldErrors(r.error));
    setBusy(true);
    try {
      let image_url = imagePath;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        if (initial?.image_url && initial.image_url !== path) await supabase.storage.from(BUCKET).remove([initial.image_url]);
        image_url = path;
      } else if (!imagePath && initial?.image_url) {
        await supabase.storage.from(BUCKET).remove([initial.image_url]);
      }
      const { data: u } = await supabase.auth.getUser();
      const payload = {
        ...r.data,
        excerpt: r.data.excerpt || null,
        image_url,
        published,
        published_at: published ? initial?.published_at ?? new Date().toISOString() : initial?.published_at ?? null,
      };
      const { error } = initial
        ? await supabase.from("announcements").update(payload).eq("id", initial.id)
        : await supabase.from("announcements").insert({ ...payload, author_id: u.user?.id ?? null });
      if (error) throw error;
      toast.success(initial ? "Comunicado actualizado" : "Comunicado creado");
      onDone();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar el comunicado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl uppercase text-frost">{initial ? "Editar comunicado" : "Nuevo comunicado"}</DialogTitle>
        <DialogDescription>Los comunicados en borrador solo son visibles para la dirección.</DialogDescription>
      </DialogHeader>
      <form onSubmit={save} noValidate className="mt-2 space-y-5">
        <TextField id="title" label="Título" required value={v.title} onChange={(x) => setV({ ...v, title: x })} error={errors["title"]} maxLength={160} />
        <TextField id="category" label="Categoría" required value={v.category} onChange={(x) => setV({ ...v, category: x })} error={errors["category"]} maxLength={40} hint="Ej.: General, Eventos, Afiliación…" />
        <TextAreaField id="excerpt" label="Resumen (opcional)" value={v.excerpt} onChange={(x) => setV({ ...v, excerpt: x })} error={errors["excerpt"]} maxLength={300} rows={2} />
        <TextAreaField id="content" label="Contenido" required value={v.content} onChange={(x) => setV({ ...v, content: x })} error={errors["content"]} maxLength={20000} rows={10} hint="Separa los párrafos con una línea en blanco." />
        <div className="space-y-2">
          <Label className="font-hud text-[0.65rem] text-steel">Imagen (opcional)</Label>
          {preview ? (
            <div className="relative overflow-hidden border border-border">
              <img src={preview} alt="Vista previa" className="max-h-56 w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                aria-label="Quitar imagen"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setImagePath(null);
                }}
              >
                <X />
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border p-8 text-sm text-steel transition-colors hover:border-primary hover:text-frost">
              <ImagePlus className="size-6" />
              Seleccionar imagen (JPG, PNG o WEBP, máx. 5 MB)
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
            </label>
          )}
        </div>
        <div className="flex items-center justify-between border border-border p-4">
          <Label htmlFor="pub" className="text-frost">Publicar en el sitio</Label>
          <Switch id="pub" checked={published} onCheckedChange={setPublished} />
        </div>
        <Button type="submit" variant="neon" size="lg" className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} {initial ? "Guardar cambios" : "Crear comunicado"}
        </Button>
      </form>
    </>
  );
}
