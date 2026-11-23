import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Loader2, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { LogoEmblem } from '@/components/brand/Logo';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { initialRegistrationOpen } from '@/lib/access.functions';

export const Route = createFileRoute('/registro-inicial')({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Registro inicial del Director — OverNight D Club' },
    { name: 'description', content: 'Creación de la única cuenta inicial de dirección de la copia de OverNight.' },
    { property: 'og:title', content: 'Registro inicial del Director — OverNight D Club' },
    { property: 'og:description', content: 'Alta inicial privada de la dirección de OverNight.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  loader: () => initialRegistrationOpen(),
  component: InitialRegistration,
});

function InitialRegistration() {
  const open = Route.useLoaderData();
  const router = useRouter();
  const checkOpen = useServerFn(initialRegistrationOpen);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const parsed = z.object({ email: z.string().trim().email(), password: z.string().min(8) }).safeParse({ email, password });
    if (!parsed.success) return setError('Introduce un correo válido y una contraseña de al menos 8 caracteres.');
    if (password !== confirmation) return setError('Las contraseñas no coinciden.');
    setBusy(true);
    try {
      if (!await checkOpen()) {
        await router.invalidate();
        return;
      }
      const { error: signupError } = await supabase.auth.signUp({
        ...parsed.data, options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setPassword('');
      setConfirmation('');
      if (signupError) {
        setError('No se pudo completar el registro. Puede estar cerrado o el correo no estar disponible.');
        await router.invalidate();
        return;
      }
      setCreated(true);
      await router.invalidate();
    } catch {
      setError('No se pudo conectar. Comprueba tu correo antes de volver a intentarlo.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-16">
    <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
    <div className="panel-hud relative w-full max-w-md p-8 md:p-10">
      <LogoEmblem className="mx-auto size-20" eager />
      <h1 className="mt-6 text-center font-display text-2xl font-bold uppercase text-frost">{created ? 'Cuenta Director creada' : open ? 'Registro inicial · Director' : 'Registro cerrado'}</h1>
      {created ? <div role="status" className="mt-6 text-center text-sm text-steel"><ShieldCheck className="mx-auto mb-4 size-8 text-success" /><p>Revisa tu correo y confirma la cuenta antes de iniciar sesión. El registro inicial ha quedado cerrado.</p></div>
        : !open ? <p role="status" className="mt-6 text-center text-sm text-steel">La cuenta inicial ya fue creada. No se admiten nuevos registros públicos.</p>
        : <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          <TextField id="director-email" label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <TextField id="director-password" label="Contraseña" type="password" autoComplete="new-password" value={password} onChange={setPassword} />
          <TextField id="director-confirmation" label="Confirmar contraseña" type="password" autoComplete="new-password" value={confirmation} onChange={setConfirmation} />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="neon" size="lg" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Crear cuenta Director</Button>
        </form>}
      <Button asChild variant="quiet" className="mt-6 w-full"><Link to="/auth">Ir al acceso de la dirección</Link></Button>
    </div>
  </section>;
}