import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MailPlus, RefreshCw } from 'lucide-react';
import { AdminTitle } from '@/components/admin/AdminShell';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { deleteStaff, inviteStaff, listManagedUsers } from '@/lib/access.functions';

const usersQuery = queryOptions({ queryKey: ['admin', 'users'], queryFn: () => listManagedUsers() });

export const Route = createFileRoute('/_authenticated/admin/usuarios')({
  head: () => ({ meta: [
    { title: 'Gestión de usuarios — OverNight D Club' },
    { name: 'description', content: 'Gestión privada de las cuentas de la copia de OverNight.' },
    { property: 'og:title', content: 'Gestión de usuarios — OverNight D Club' },
    { property: 'og:description', content: 'Administración de cuentas reservada al Director.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  loader: ({ context }) => context.isAdmin ? context.queryClient.ensureQueryData(usersQuery) : undefined,
  component: UsersPage,
});

function UsersPage() {
  const { data: users, refetch } = useSuspenseQuery(usersQuery);
  const invite = useServerFn(inviteStaff);
  const remove = useServerFn(deleteStaff);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = await invite({ data: { email, origin: window.location.origin } });
      setMessage(result.message); setEmail(''); await refetch();
    } catch { setMessage('No se pudo crear la cuenta. Comprueba el correo y tus permisos.'); }
    finally { setBusy(false); }
  }

  return <>
    <AdminTitle code="06" title="Usuarios"><Button variant="hud" size="sm" onClick={() => refetch()} aria-label="Actualizar usuarios"><RefreshCw /></Button></AdminTitle>
    <form onSubmit={submit} className="mb-8 flex flex-col items-end gap-4 sm:flex-row">
      <div className="w-full sm:max-w-md"><TextField id="staff-email" label="Correo del personal" type="email" value={email} onChange={setEmail} /></div>
      <Button variant="neon" type="submit" disabled={busy}><MailPlus />Crear cuenta de personal</Button>
    </form>
    {message && <p role="status" className="mb-6 text-sm text-steel">{message}</p>}
    <ul className="divide-y divide-border border border-border bg-card">
      {users.map(user => <li key={user.id} className="flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-0 flex-1"><p className="break-all text-sm text-frost">{user.email}</p><p className="mt-1 text-xs text-steel">{user.director ? 'Director · Acceso completo' : 'Personal · Sin permisos de dirección'} · {user.confirmed ? 'Correo confirmado' : 'Pendiente de confirmación'}</p></div>
        {!user.director && <ConfirmDelete what={user.email} onConfirm={async () => {
          try { await remove({ data: { id: user.id } }); await refetch(); }
          catch { setMessage('No se pudo eliminar la cuenta.'); }
        }} />}
      </li>)}
    </ul>
  </>;
}