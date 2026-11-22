# OverNight D Club — auditoría y ampliación controlada

## Auditoría inicial

La auditoría está disponible en el documento de revisión que acompaña esta entrega. El ZIP contiene la web y el panel originales: React/TanStack, 10 páginas públicas, acceso y recuperación de contraseña, 6 secciones administrativas, recursos de marca y 6 tablas con políticas de acceso.

La inspección ha sido estática: todavía no se ha importado la aplicación a la vista previa ni se han probado cuentas, formularios, correos o almacenamiento. No se ha tocado la web publicada ni el repositorio original.

### Hallazgos principales

- Existe acceso por correo y contraseña, pero no cuentas de personal administrables ni acceso por nombre de usuario.
- La administración depende del rol `admin`, no de permisos individuales. El rol `moderator` no tiene acceso administrativo operativo.
- Hay estados, revisión y un campo de notas por expediente; faltan responsables, notas por autor y registro de actividad inalterable.
- La configuración inicial permite reclamar administración cuando no existe un administrador. Debe cerrarse esa vía y preservar primero al director original.
- El ZIP no incluye registros, usuarios ni imágenes subidas. El identificador de conexión no conecta esta copia con el servicio original.
- Las migraciones están representadas en dos directorios y no deben aplicarse dos veces. La configuración y los proveedores alojados no están verificados.

## Qué se ampliará

1. Importar fielmente la aplicación original, sus páginas, imágenes, estilos y panel, sin rediseñar ni crear otra aplicación.
2. Preparar Lovable Cloud completamente independiente para esta copia de trabajo. No sustituir, desconectar ni modificar ningún servicio de producción.
3. Ampliar la pantalla existente con acceso de dirección y miembros, correo o usuario, recuperación y cambio obligatorio de contraseña inicial.
4. Añadir gestión de personal al mismo panel: cuatro rangos editables, estado de cuenta y permisos individuales independientes del rango.
5. Proteger cada operación, la identidad del director, los cambios de permisos, la suspensión y la revocación de acceso.
6. Incorporar responsables, estados y notas individuales a solicitudes y alianzas; conservar notas y estados históricos.
7. Añadir actividad inalterable, filtros y consulta desde la ficha del miembro, sin registrar secretos.
8. Ampliar origen, visión, liderazgo y legado de Moha Contreras usando hechos existentes y conservando su silueta.
9. Ejecutar las pruebas solicitadas con cuentas de prueba y entregar resultados reales, archivos afectados y configuraciones pendientes.

## Usuarios y datos existentes

Antes de cualquier importación de datos se presentará el inventario concreto, inclusiones, exclusiones y comprobaciones de integridad. Solo se copiarán registros a Lovable Cloud independiente, preservando perfiles, propiedad y datos mediante identidades verificadas. En su primera visita a la copia, los usuarios verificarán su correo y elegirán una nueva contraseña; las antiguas contraseñas y sesiones no se trasladan. No se modificarán las credenciales ni los servicios del sitio original.

Se continuará con código y esquema aunque falten exportaciones. Los registros y usuarios originales quedarán pendientes hasta recibir sus exportaciones; las imágenes subidas requieren también sus archivos. No se considerará preservada o probada la cuenta original del director sin esas comprobaciones.

## Detalles técnicos

- Mantener TanStack Start, componentes existentes, tokens y recursos originales; conservar versiones TanStack fijadas del destino al incorporar dependencias.
- Ampliar tablas/políticas de forma aditiva y conservar identificadores e historial. No ejecutar ambas copias de las migraciones.
- Comprobar identidad, cuenta activa y permisos actuales en servidor y base de datos. Evitar que el acceso directo a tablas eluda permisos específicos.
- Registrar mutaciones sensibles y auditoría transaccionalmente; proteger el historial contra modificación/eliminación normal.
- Importar registros solamente después de filtrar campos de credenciales y verificar relaciones y propiedad.
- No importar `.env`, modificar archivos generados manualmente ni publicar sin autorización.

## Límites de esta entrega

Primera fase ejecutada: aplicación original importada, servicios independientes y esquema vacío preparados. Pruebas públicas y de aislamiento realizadas; informe en la revisión de aislamiento. La gestión avanzada de personal no está implementada. El panel con sesión y el director original siguen sin verificarse: la cuenta de prueba propuesta no fue autorizada y no se han recibido exportaciones de identidades. No se publicarán cambios ni se modificará producción.