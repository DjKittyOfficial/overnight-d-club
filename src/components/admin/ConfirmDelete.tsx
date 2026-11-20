import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDelete({ onConfirm, what, disabled }: { onConfirm: () => void; what: string; disabled?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          <Trash2 /> Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-none border-border bg-popover">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display uppercase">¿Eliminar {what}?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción es permanente y no se puede deshacer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
