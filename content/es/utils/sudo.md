# Utilidad de reglas sudo

`bin/equislinux-sudo` gestiona las reglas `NOPASSWD` estrechas que usan los
scripts de release y validación. Resuelve el workspace en tiempo de ejecución,
así que las rutas de las reglas siguen el checkout real en vez de un home
hardcodeado.

## Comandos

```bash
# Mostrar las reglas que se escribirían (por defecto; sin cambios)
./bin/equislinux-sudo

# Escribir /etc/sudoers.d/equislinux (pide tu contraseña sudo)
./bin/equislinux-sudo --apply

# Inspeccionar o eliminar
sudo ./bin/equislinux-sudo status
sudo ./bin/equislinux-sudo remove
```

Se aceptan las formas heredadas de `xlnux-sudo.sh`:

```bash
sudo ./bin/equislinux-sudo --create   # igual que install --apply
sudo ./bin/equislinux-sudo --status
sudo ./bin/equislinux-sudo --remove
```

## Qué concede

La allowlist es intencionadamente pequeña:

- `scripts/test/generations-btrfs.sh`
- `x/xbuild.sh`
- `wsl/publish-sf.sh`
- `wsl/build-rootfs.sh`

Para cada uno escribe ambas formas, cuando aplica:

```
<user> ALL=(root) NOPASSWD: /usr/bin/bash /absolute/path/to/script
<user> ALL=(root) NOPASSWD: /absolute/path/to/script
```

El archivo se instala como `/etc/sudoers.d/equislinux` con modo `0440` y
propiedad root. El archivo heredado `/etc/sudoers.d/xlnux-sprint` se elimina en
`--apply` salvo que uses `--keep-legacy`.

## Workspace y cambios de ruta

El workspace se descubre con `--workspace`, `X_WORKSPACE`, el archivo
`~/.config/equislinux/workspace`, el padre de este repositorio o las ubicaciones
comunes. Si el workspace se mueve o renombra, vuelve a ejecutar:

```bash
./bin/equislinux-sudo --apply
```

Si no, las rutas absolutas antiguas seguirían en sudoers.

## Seguridad

- **`NOPASSWD` sobre un script que el usuario destino puede editar equivale a
  root sin contraseña.** La utilidad imprime un aviso. `--strict` rechaza
  objetivos escribibles por el usuario para layouts root, pero es una comodidad
  para una máquina de desarrollo de un solo usuario, no una frontera de
  seguridad.
- El archivo generado se valida con `visudo -cf` antes de instalarlo.
- El archivo anterior se respalda en `/var/backups/equislinux`.
- Los cambios aplican al instante; **no hace falta reiniciar**. Eliminar el
  archivo revoca invocaciones futuras. Un proceso ya en marcha conserva sus
  privilegios.
- Después de `remove`, `sudo -k` limpia cualquier timestamp de sudo en caché.
- `--user USER` concede las reglas a otra cuenta; por defecto es `SUDO_USER` o
  el usuario invocante.

## Verificación

```bash
sudo ./bin/equislinux-sudo status
sudo -n -l | grep -i equislinux
sudo -n /usr/bin/bash /absolute/path/to/scripts/test/generations-btrfs.sh
```

El último comando debe funcionar solo mientras las reglas están instaladas.
Después de `remove`, debe fallar pidiendo contraseña.

## Problemas típicos

- `sudo: a password is required`: ejecuta el comando de forma interactiva;
  `--apply`, `status` y `remove` necesitan root.
- `workspace not found`: pasa `--workspace /path/to/equislinux`, exporta
  `X_WORKSPACE` o ejecuta `equislinux-workspace --set-default`.
- `visudo rejected the generated rules`: no se instala nada; el archivo anterior
  se restaura. Revisa la ruta reportada y vuelve a ejecutar.
- `path exists but...`: los cuatro scripts esperados deben existir en el
  workspace; clona/actualiza los repositorios primero.
