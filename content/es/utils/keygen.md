# Generador de claves de firma

`bin/equislinux-keygen` genera la clave ed25519 de firma del repositorio `[x]` y
su material público/revocación. El keyring privado se escribe fuera de todo
árbol git, por defecto en `<workspace>/keys`.

## Valores por defecto

- Salida: `<workspace>/keys`
- Algoritmo: ed25519, solo firma
- Caducidad: nunca (`0`); usa `--expiry 2y` etc. si quieres
- Passphrase: **protegida por defecto** (pinentry)
- Se niega a ejecutarse como root
- Se niega a escribir dentro de un árbol git
- Se niega a usar un directorio de salida no vacío salvo con `--force`

## Comandos

```bash
# Mostrar el plan; no crea directorios ni claves
./bin/equislinux-keygen --dry-run

# Generar una clave protegida con passphrase (por defecto)
./bin/equislinux-keygen

# Solo desarrollo/automatización: sin passphrase
./bin/equislinux-keygen --no-passphrase

# Ubicación, identidad o caducidad personalizadas
./bin/equislinux-keygen --out /media/offline/keys \
  --name "X Linux Repository" --email dev@xscriptor.com --expiry 2y

# Rotar: mover el directorio anterior a keys.bak.<timestamp>
./bin/equislinux-keygen --force
```

Otras opciones: `--workspace PATH`, `--protect` (por defecto explícito),
`--no-passphrase`, `--force`, `--out`, `--name`, `--email`, `--expiry`.

## Salida

| Ruta | Propósito | Compartir |
|------|-----------|-----------|
| `gnupg/` | keyring secreto y GNUPGHOME | **nunca** |
| `signing.pub` | clave pública ASCII | sí |
| `trustedkeys.gpg` | keyring binario para consumidores | sí |
| `revoke.asc` | certificado de revocación | guardar aparte |
| `env.sh` | `GNUPGHOME` + `X_REPO_SIGN_KEY` | no |
| `README.md` | notas generadas de backup/rotación | no |

`keys/` tiene modo `0700`; `env.sh` y `revoke.asc` son `0600`.

## Backup

Copia `gnupg/` y `revoke.asc` a un medio offline; usa un archivo que preserve
permisos si el destino es exFAT/NTFS. Prueba el backup listando la clave secreta
desde la copia restaurada. El keyring privado nunca debe commitearse ni subirse
sin cifrar.

Consulta el runbook privado de operaciones para el procedimiento de backup e
inventario.

## Rotación

`--force` **no** elimina la clave anterior: mueve todo el directorio de claves a
`<keys>.bak.<timestamp>` antes de generar la nueva. Una rotación sigue siendo una
transición de confianza:

1. Refirmar la DB/paquetes del repositorio con la clave nueva.
2. Actualizar el keyring embebido en el ISO/entorno live y en el rootfs de WSL.
3. Dar a las instalaciones existentes un paquete de transición firmado con la
   clave vieja, si la clave privada antigua sigue disponible.
4. Revocar la clave vieja si se comprometió.
5. Verificar instalaciones nuevas y actualizadas.

El runbook privado de operaciones contiene el procedimiento completo de rotación.

## Firma

```bash
source <workspace>/keys/env.sh
(cd <workspace>/x-repo && ./build-packages.sh --index-only)
```

`env.sh` contiene un `GNUPGHOME` absoluto. Si cambia la ruta del workspace,
actualízalo deliberadamente o regenera el archivo con el generador de claves
(sin rotar el keyring).

## Verificación

El generador hace un self-test de firma/verificación. Para comprobar un keyring
existente:

```bash
GNUPGHOME=<workspace>/keys/gnupg gpg --list-secret-keys
```

No pegues material de clave privada en logs o chats.

## Problemas típicos

- `keys directory is not empty`: usa `--force` solo si pretendes rotar; mueve el
  directorio anterior a un backup primero.
- `refusing to write keys inside a git worktree`: elige `--out` fuera de los
  repositorios (el `<workspace>/keys` por defecto ya está fuera).
- Errores de pinentry/gpg: asegúrate de tener un pinentry funcional y un
  terminal local; para automatización usa `--no-passphrase` solo en desarrollo.
- `do not run this as root`: el keyring debe pertenecer a tu usuario.
