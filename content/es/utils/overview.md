# utils — herramientas de operador

`equislinux/utils` contiene utilidades de operador para el workspace de
producción de EquisLinux. **No** son componentes runtime de la distribución:
ayudan a los maintainers a localizar el workspace, clonar todos los
repositorios, conceder los permisos sudo estrechos que necesitan los scripts de
release/validación y generar o restaurar la clave de firma del repositorio.

## Contrato del workspace

Las utilidades esperan un directorio llamado `equislinux` con todos los
repositorios al mismo nivel:

```
.../equislinux/
├── x/
├── scripts/
├── xpm/
├── xpkg/
├── x-repo/
├── web/
├── wiki/
├── wsl/
├── wsl-scripts/
├── x-arm/
├── utils/        <- este repositorio
├── ops/          <- notas privadas de operaciones (no necesarias aquí)
└── keys/         <- material de firma, nunca trackeado
```

El padre del workspace no es fijo: `~/Documents/repos/equislinux`,
`~/Documents/equislinux`, `~/repos/equislinux`, `~/src/equislinux` y
`~/equislinux` son válidos.

Orden de descubrimiento:

1. `--workspace PATH` (donde esté soportado)
2. `X_WORKSPACE`
3. `~/.config/equislinux/workspace` (una sola ruta)
4. el directorio padre de este repositorio (caso normal)
5. ubicaciones comunes bajo `$HOME`

Un marcador `.equislinux-workspace` en la raíz del workspace hace que la
detección sea inequívoca. No hay `.env` a propósito: depende del directorio
actual y es fácil commitearlo por accidente.

## Comandos

```bash
# Mostrar el workspace detectado, o fijarlo explícitamente
./bin/equislinux-workspace
./bin/equislinux-workspace --init /path/to/equislinux
./bin/equislinux-workspace --set-default

# Clonar o refrescar todos los repositorios de la organización
./bin/equislinux-clone --dest ~/repos/equislinux

# Mostrar las reglas sudo que se instalarían (sin cambios)
./bin/equislinux-sudo --dry-run

# Instalarlas (pide tu contraseña sudo)
./bin/equislinux-sudo --apply

# Inspeccionar o eliminar
sudo ./bin/equislinux-sudo status
sudo ./bin/equislinux-sudo remove

# Planificar una clave de firma y generarla fuera de todo árbol git
./bin/equislinux-keygen --dry-run
./bin/equislinux-keygen                 # protegida con passphrase (por defecto)

# Restaurar el keyring y la clave de SourceForge desde el backup offline
./bin/equislinux-restore --backup-dir /media/backup --workspace ~/repos/equislinux --apply
```

Las guías completas son las páginas de esta sección:

- [Layout del workspace](workspace-layout.md) — descubrimiento, marcador y mover el workspace.
- [Clonar el workspace](cloning.md) — `equislinux-clone`, repos privados y ramas.
- [Reglas sudo](sudo.md) — la allowlist y el modelo de seguridad.
- [Generador de claves](keygen.md) — crear y rotar la clave de `[x]`.
- [Restaurar claves](restore.md) — recuperar el backup offline.

## Notas de diseño

- `gh` debe estar instalado y autenticado para `equislinux-clone`; los scripts
  nunca leen ni almacenan tokens.
- Las reglas sudo resuelven rutas absolutas en runtime; reaplícalas después de
  mover el workspace.
- El material de firma vive en `<workspace>/keys` (modo `0700`), nunca dentro de
  un árbol git.
