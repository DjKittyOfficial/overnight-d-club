# Servicios independientes y traslado de datos

## Primera fase: infraestructura y código, no datos originales

Esta copia usa una nueva instancia de Lovable Cloud para autenticación, base de datos y archivos. Se comprobó antes de aplicar el esquema que contiene cero usuarios y cero tablas de aplicación. No se ha conectado al servicio original. El código conserva el mismo panel y páginas, pero usa los clientes generados para la conexión nueva; las conexiones y credenciales del ZIP no se importan.

Se conservan las fotografías y el logotipo originales mediante almacenamiento de recursos de este proyecto y las fuentes de Google. No se configuran webhooks, tareas programadas, pagos ni cambios de dominios de producción. El registro público y las cuentas anónimas se han desactivado en el servicio independiente. No se creará un director automáticamente.

La justificación de las diferencias de configuración es el aislamiento solicitado: no copiar `.env`, configuración de proyecto original ni clientes con destinos del original. Las versiones TanStack del destino se conservan. El ZIP adjunto sigue siendo la referencia intacta. Ningún registro, usuario o tabla original se ha eliminado o sustituido.

## Antes de cualquier importación de registros

Se presentará un inventario concreto del archivo recibido y sus cantidades. Se copiarán, no moverán ni borrarán: solicitudes, alianzas, mensajes, comunicados, configuración pública, perfiles y roles originales, identificadores y referencias de imágenes. Los archivos subidos requerirán su manifiesto y sus bytes. El esquema vacío independiente no equivale a importar los datos originales.

No se trasladan contraseñas, hashes, tokens, sesiones, secretos, claves ni configuración del alojamiento original. No se enviarán correos masivos durante la importación. No se mezclan las cuentas de prueba con usuarios reales ni se elige un director a partir del primer usuario que llegue.

Integridad: conservar exportaciones de origen intactas; filtrar credenciales antes de leer registros; detectar identificadores duplicados, correos ausentes/duplicados y relaciones rotas; importar en orden de dependencias; comparar cantidades por tabla y valores de ejemplos representativos; comparar referencias de propietario y roles con un mapa de identidades; verificar archivos por tamaño y hash; ejecutar una nueva escritura y lectura; comprobar que otra cuenta no puede consultar datos privados. Cualquier discrepancia bloquea la aceptación de esa importación, no se resuelve borrando registros.

## Recuperación del director original

Se necesita una exportación que identifique al director original por su identificador, correo y rol verificados. Se conservará la correspondencia entre identidad original e identidad de esta copia. Hasta tener esa evidencia, no se concederá dirección a una cuenta real ni a quien reclame primero el acceso.

La contraseña de producción sigue intacta. En la copia, el director iniciará el procedimiento de verificación de correo e invitación/recuperación; tras demostrar propiedad del correo, definirá una contraseña nueva. Solo una correspondencia inequívoca autorizará el rol protegido. No se considerará probado hasta verificar el enlace, el cambio de contraseña, el inicio posterior y el acceso a sus registros. La entrega del correo y las URL permitidas aún requieren comprobación.

## Estado

Servicios independientes creados; código en importación; esquema de pruebas por preparar. No se han importado datos ni usuarios originales. Gestión avanzada de personal, permisos, auditoría, notas y asignaciones son fases pendientes.