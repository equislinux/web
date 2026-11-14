# Clonar el workspace

`bin/equislinux-clone` clona (o refresca) todos los repositorios de la
organización `equislinux` de GitHub en un solo directorio llamado `equislinux`.
Usa la sesión local de `gh`, así que los repositorios privados funcionan sin
meter tokens ni contraseñas en el script.

## Uso local

```bash
# Desde este repositorio
./bin/equislinux-clone --dest ~/repos/equislinux

# Desde el directorio que debe convertirse en workspace
cd ~/repos/equislinux
./bin/equislinux-clone --here

# Solo repositorios públicos
./bin/equislinux-clone --dest ~/Documents/equislinux --no-private

# Un repositorio (útil para probar)
./bin/equislinux-clone --only ops --dest /tmp/test/equislinux
```

El destino debe llamarse `equislinux`; el script lo crea y escribe el marcador
`.equislinux-workspace` si falta. `--here` usa el directorio actual cuando su
basename ya es `equislinux`; si no, crea `./equislinux` dentro del directorio
actual. No se puede combinar con `--dest`.

## Uso remoto

El script es standalone y se puede descargar y ejecutar en una máquina nueva:

```bash
curl -fsSL \
  https://github.com/equislinux/utils/raw/refs/heads/main/bin/equislinux-clone \
  -o /tmp/equislinux-clone
bash /tmp/equislinux-clone --dest "$HOME/repos/equislinux"
```

O a través de un host SSH con el workspace montado/disponible:

```bash
ssh host 'bash -s -- --dest "$HOME/repos/equislinux"' \
  < bin/equislinux-clone
```

La máquina destino necesita `gh` instalado y autenticado (`gh auth login`) y
`git`.

## Repositorios privados

- El script lista repositorios con `gh repo list`, que incluye los privados
  visibles para la cuenta actual. `ops` se clona cuando la sesión puede verlo.
- El script no lee, imprime ni almacena tokens; `gh` suministra las credenciales
  por su protocolo git configurado. Se recomienda HTTPS:
  `gh config set git_protocol https`.
- Si el repositorio privado no es visible o falla la autenticación, la operación
  se reporta como fallo. Usa `--no-private` para omitirlos a propósito y
  clonarlos a mano.
- `gh auth status` debe funcionar antes de clonar nada.

## Ramas

Un `git clone` normal trae todas las ramas presentes en el remoto. Por defecto
este script también crea **ramas locales de tracking** para todas, así `git
branch` muestra el conjunto completo. Usa `--no-local-branches` para dejar solo
refs `origin/*`.

- Las ramas borradas en remoto no se recrean.
- Los repositorios existentes se refrescan con `git fetch --all --prune --tags`;
  el árbol de trabajo no se hace pull ni reset.
- Las ramas locales de ramas que ya no existen en remoto no se borran
  automáticamente; límpialas a mano si quieres.

## Detección del workspace

Sin `--dest`, el destino se elige de:

1. `X_WORKSPACE`
2. `~/.config/equislinux/workspace`
3. el padre de este checkout (`utils/../`)
4. el directorio actual si se llama `equislinux`
5. `~/Documents/repos/equislinux`, `~/repos/equislinux`,
   `~/Documents/equislinux` o `~/equislinux` (primer padre existente)

## Opciones

```
--dest DIR / --workspace DIR   raíz del workspace (debe llamarse equislinux)
--here                         directorio actual, o ./equislinux dentro de él
--org NAME                     organización de GitHub (por defecto: equislinux)
--no-private / --public-only   omite repositorios privados
--no-local-branches            solo trae refs origin/*
--only NAME                    un repositorio (repetible)
--dry-run                      muestra el plan sin escribir
--help                         muestra la ayuda
```

## Ejemplos

```bash
# Refrescar un workspace existente (fetch de remotos/tags, crear ramas locales
# que falten, sin tocar los árboles de trabajo)
./bin/equislinux-clone --dest ~/repos/equislinux

# Plan sin tocar el sistema de archivos
./bin/equislinux-clone --dest ~/repos/equislinux --dry-run

# Workspace solo con repositorios públicos
./bin/equislinux-clone --dest ~/repos/equislinux --no-private
```

## Problemas típicos

- `gh is not authenticated`: ejecuta `gh auth login`.
- `clone failed: ops`: el repositorio privado no es visible para la cuenta
  actual o el protocolo git no está configurado; revisa `gh auth status` y
  `gh config get git_protocol`, o usa `--no-private`.
- `workspace directory must be named 'equislinux'`: pasa una ruta cuyo último
  componente sea `equislinux`.
- Directorio no git existente con el mismo nombre que un repositorio: el script
  reporta el conflicto y continúa con los demás; muévelo y vuelve a ejecutar.
