# OverNight D Club — Auditoría inicial del ZIP

## Alcance y resultado

Se inspeccionó el archivo `overnight-web-Overnight.zip` sin ejecutar código, instalaciones ni scripts importados. Contiene 147 archivos, aproximadamente 1,60 MB descomprimidos, y 113 archivos bajo `src/`. La copia de trabajo de Lovable sigue siendo la plantilla: el ZIP todavía no se ha importado a la aplicación. No se ha modificado la web publicada ni su repositorio original, ni se han aplicado cambios a su base de datos.

**Conclusión:** el ZIP contiene la aplicación original, no una maqueta. Su arquitectura ya es compatible con TanStack Start. La ampliación debe conservar sus páginas, diseño y panel, pero exige nuevos controles de personal y permisos. El ZIP no demuestra que las conexiones o las cuentas originales estén disponibles en esta copia.

## 1. Qué contiene el proyecto

- React 19, TypeScript, TanStack Start/Router, TanStack Query, Vite y Tailwind v4.
- Componentes propios de marca, navegación, formularios y administración, además de controles Radix/shadcn.
- Diseño negro, violeta y morado, tipografías Oxanium/Saira/JetBrains Mono, animaciones y silueta anónima del fundador.
- Fotografías originales de portada en dos tamaños, imagen del fundador, logotipo e iconos.
- Páginas públicas: inicio, quiénes somos, filosofía, fundador, afiliación, alianzas, contacto, privacidad, lista y detalle de comunicados.
- Acceso de dirección y restablecimiento de contraseña.
- Panel compartido con resumen, solicitudes, alianzas, mensajes, comunicados y configuración.
- Clientes de conexión, adjunto de sesión, funciones públicas de servidor, tipos de datos y pruebas existentes.
- Tres migraciones representadas tanto en `drizzle/migrations/` como en `supabase/migrations/`. No deben ejecutarse ambas series como si fueran cambios independientes: describen los mismos cambios con diferencias de comentarios.

## 2. Funciones implementadas y estado real

| Función | Encontrada en el código | Comprobación pendiente |
|---|---|---|
| Páginas públicas y navegación | Sí | Renderizado de todas las páginas y tamaños de pantalla tras importar |
| Solicitud de afiliación | Sí; validación y escritura en servidor | Envío real y lectura en panel |
| Propuesta de alianza | Sí | Envío real y lectura en panel |
| Contacto | Sí | Envío real y lectura en panel |
| Acceso con correo y contraseña | Sí | Cuenta original, configuración alojada y sesión real |
| Recuperación/cambio de contraseña | Sí | Entrega del correo y enlaces permitidos |
| Cierre de sesión | Sí | Invalidación efectiva y alcance de sesiones |
| Gestión de solicitudes/alianzas/mensajes | Sí; búsqueda, estados, revisión, notas y eliminación | Operaciones reales y privacidad |
| Comunicados | Sí; borradores, edición, publicación e imágenes | Escritura, permisos de archivos y visualización pública |
| Configuración pública | Sí; enlaces, redes, contacto, privacidad y apertura de afiliación | Lectura/escritura real |
| Personal, rangos y permisos individuales | No | Implementación completa |
| Asignaciones | No | Implementación completa |
| Auditoría inalterable | No | Implementación completa |

**No se ha declarado superada ninguna prueba de ejecución.** Las pruebas incluidas en el ZIP son código pendiente de ejecutar en la copia importada, no evidencia de funcionamiento actual.

## 3. Autenticación y autorización existentes

`src/routes/auth.tsx` usa el servicio de autenticación existente para acceso con correo y contraseña, recuperación por correo y configuración inicial. No almacena contraseñas manualmente. `restablecer.tsx` cambia la contraseña a través del servicio seguro. El acceso privado requiere sesión y el panel consulta `has_role`.

La tabla `user_roles` admite `admin` y `moderator`, pero las operaciones administrativas dependen de `admin`; no hay matriz individual de permisos. El rango no puede reutilizarse como permiso si se quiere cumplir el encargo.

**Riesgo importante de inicialización:** `claim_first_admin()` permite al primer usuario autenticado reclamar administración cuando no existe un administrador. Hay bloqueo transaccional para evitar dos reclamaciones simultáneas, pero no identifica al director original. Una base nueva o una importación sin sus roles no debe quedar abierta a ese mecanismo. Primero hay que preservar y vincular la identidad del director de forma controlada. El ZIP no incluye esa identidad.

No se encuentran creación de miembros desde dirección, acceso por nombre de usuario, cambio obligatorio de contraseña inicial, suspensión, revocación administrativa de sesiones ni protección especial de una única cuenta directora.

## 4. Base de datos y cambios necesarios

Tablas actuales:

1. `user_roles`: relación con identidades de autenticación y roles existentes.
2. `applications`: solicitudes; datos personales, revisión, estado y `admin_notes`.
3. `alliances`: propuestas; revisión, estado y `admin_notes`.
4. `contact_messages`: mensajes, estado y notas.
5. `announcements`: contenido, publicación, autor y ruta de imagen.
6. `site_settings`: configuración pública por clave.

Las seis tablas tienen seguridad por filas en las migraciones. Los visitantes pueden insertar formularios con estado inicial y sin notas; los expedientes privados dependen de administración. Los comunicados publicados y la configuración pública son legibles públicamente.

Cambios previstos, todavía no aplicados:

- Perfiles de personal: identidad autenticada, nombre, nombre de usuario único, rango, estado, fechas y obligación de cambiar contraseña.
- Catálogo editable de cuatro rangos, separado de permisos; la identidad del director no se concede simplemente asignando rango 4.
- Catálogo y concesiones individuales de permisos, con comprobación real para cada operación.
- Vinculación controlada entre identificadores originales e identidades de la copia, si se trasladan usuarios.
- Responsables de solicitudes y alianzas; conservar los estados existentes y añadir «Necesita información» sin destruir valores históricos.
- Notas internas como registros individuales con autor y fecha; conservar el contenido de `admin_notes` al incorporar el nuevo historial.
- Registro de actividad con responsable, fecha, sección, resultado, elemento afectado y valores anteriores/nuevos, sin contraseñas ni tokens.
- Funciones y políticas que impidan cambios propios de permisos, modificación del director, creación normal de otro director y acceso de cuentas suspendidas.
- Escrituras sensibles y auditoría en una misma operación transaccional; comprobación de permisos actuales en cada petición, no solo al entrar.
- Protección frente a acceso directo a tablas que pudiera saltarse la separación entre consultar resumen, consultar expediente y ejecutar acciones.

La migración histórica final ajusta la edad mínima de afiliación a 14 años, coincidiendo con la validación actual. Debe respetarse el historial aplicado; la migración inicial aislada exige 16.

## 5. Archivos que será necesario modificar

**Conservar e importar:** estructura de `src/`, componentes originales, páginas, estilos y recursos. Mantener los paquetes TanStack fijados de la plantilla de destino al incorporar las dependencias originales; no copiar versiones a ciegas.

**Ampliar:**

- `src/routes/auth.tsx` y `restablecer.tsx`: alternativas de acceso, nombre de usuario y contraseña inicial.
- `src/routes/_authenticated/route.tsx` y `admin.tsx`: cuenta activa, permisos actuales y director protegido.
- `src/components/admin/AdminShell.tsx`: mismo menú, adaptado a permisos, con personal y actividad.
- `RecordsManager.tsx` y páginas de solicitudes/alianzas/mensajes: acciones separadas, notas por autor, responsables y estados.
- `admin.comunicados.tsx` y `admin.configuracion.tsx`: permisos independientes y auditoría de operaciones.
- Nuevas páginas de personal y actividad, módulos de autorización y operaciones seguras de servidor, pruebas y migraciones de ampliación.
- `src/routes/fundador.tsx`: origen, visión, liderazgo y legado, sin sustituir silueta o estética.
- Metadatos de cada página administrativa: algunas páginas heredan los del panel y carecen de título/descripción propios.

Los archivos generados se regenerarán con las herramientas correspondientes; no se modificarán manualmente. La configuración de Vite usa el adaptador oficial de Lovable para Cloudflare. No se detecta la necesidad de cambiar de framework.

## 6. Configuraciones y material externos

Esta copia no tiene Lovable Cloud conectado. El archivo `supabase/config.toml` contiene un identificador de proyecto, pero eso no conecta este proyecto ni prueba que pueda accederse al original.

Nombres requeridos por el código: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y, solo para operaciones privilegiadas, `SUPABASE_SERVICE_ROLE_KEY`. `LOVABLE_DB_MIGRATION_URL` aparece en configuración de migraciones. Existe un ayudante que referencia `LOVABLE_CRON_SECRET` y su valor anterior; no demuestra que existan tareas programadas activas.

**El ZIP contiene `.env`, excluido de la inspección de valores y de cualquier importación. No se copiarán ni mostrarán credenciales.** No se han verificado los valores del alojamiento ni las opciones de registro/confirmación; no pueden deducirse del código.

Faltan exportaciones de registros, usuarios con identificadores originales, perfiles/roles, manifiesto y bytes de imágenes subidas. Las imágenes de diseño sí están incluidas.

El código referencia el depósito privado `announcement-images`, políticas de acceso y enlaces firmados. La migración indica que su creación se realiza por separado; hay que comprobar su existencia y configuración. Las imágenes subidas no están dentro del ZIP.

Hay enlaces configurables a Discord/redes y carga de fuentes de Google. No se encontraron implementaciones de pagos, IA ni envío de respuestas a mensajes; un estado «respondido» no equivale a envío de correo. Deben conservarse los servicios compatibles y comprobar las configuraciones externas que no viajan en un ZIP.

## 7. Riesgos y límites

- Importar el esquema sin usuarios/roles puede dejar libre la reclamación del primer administrador.
- Eliminar cuentas con cascada podría borrar referencias históricas; el nuevo historial debe mantener la atribución aunque se elimine una identidad.
- Conservar RLS de administrador y limitar únicamente botones no permitiría permisos individuales seguros.
- Guardar notas junto con un `select('*')` hace necesario separar acceso a listas y acceso a información completa.
- Revocar tokens de renovación no invalida por sí solo todos los tokens de acceso ya emitidos: suspensión/revocación debe comprobarse en cada operación protegida.
- Las firmas de imágenes de comunicados duran hasta 24 horas en el código público; despublicar debe considerar que un enlace ya emitido puede seguir siendo válido durante su vigencia.
- La edición de comunicados elimina imágenes anteriores antes de confirmar la escritura del contenido, creando riesgo de pérdida si falla el guardado. Se deberá conservar el archivo hasta confirmar el cambio.
- El cierre de afiliaciones se consulta para mostrar el formulario, pero debe comprobarse también al procesar la petición para evitar envíos directos.
- Hay mecanismos antirobot por campo trampa, pero no se encontró limitación explícita de frecuencia en las funciones públicas.
- No hay pruebas alojadas de permisos, usuarios ni proveedores. Los 25 escenarios solicitados siguen pendientes.
- Se inspeccionó la compatibilidad en código; no se ejecutaron dependencias importadas ni se probó el entorno Cloudflare publicado.

## 8. Siguiente etapa y conservación

La siguiente etapa es importar fielmente el código original a esta copia y ampliar el mismo panel. No se sustituirá la web publicada.

Para que la copia disponga de cuentas y datos gestionados en Lovable, será necesario mover la base y los usuarios a Lovable Cloud, conservando perfiles, propiedad y datos con una correspondencia de identidades verificada. En su primera visita, los usuarios verificarán su correo y elegirán una nueva contraseña; las contraseñas y sesiones antiguas no se trasladan. **Esto no se ha ejecutado y no cambia las credenciales de la web original.** La cuenta del director original no se considerará conservada ni probada hasta disponer de su exportación y completar la comprobación.

Los datos ausentes quedarán pendientes de importación; no se inventarán registros ni usuarios reales. Las pruebas se harán en la copia aislada con cuentas de prueba, sin afectar a producción. La sección del fundador puede profundizar en los valores existentes, pero cualquier acontecimiento histórico nuevo requiere información del usuario.

**Preparado:** auditoría del código, inventario de capacidades y riesgos, y definición de la ampliación sobre el original.

**Pendiente:** importar y comprobar la aplicación, conectar la copia, añadir las funciones solicitadas, obtener datos/usuarios/archivos existentes y ejecutar las pruebas reales. La actualización no está terminada.