# Firma del repositorio

El repositorio `[x]` de pacman puede publicarse con firmas OpenPGP para que los
consumidores verifiquen cada paquete, las bases de datos de pacman y el fichero
de checksums antes de confiar en ellos. La firma es opcional y se controla con
una única variable de entorno, `X_REPO_SIGN_KEY`; esta página es el runbook
operativo detrás de [publishing.md](publishing.md).

Estado actual (octubre 2026):

- El repositorio firmado vive en la rama `feat/signing`: paquetes,
  `x.db`/`x.files` y `SHA256SUMS` tienen ficheros `.sig` detached, y el keyring
  público se publica junto a ellos.
- `x-scripts 0.1.0-19` es el payload firmado de esa rama, y la revisión que
  embebe el ISO.
- El ISO sigue configurando `[x]` como `Optional`, así que la verificación
  todavía **no se exige** (ver
  [Integración en ISO/destino](#integración-en-isodestino-pendiente)).

## 0. Crear la clave (una sola vez, offline)

Genera la clave de proyecto y exporta su fingerprint:

```bash
gpg --full-generate-key                 # RSA 4096 o ed25519
KEYID="$(gpg --list-keys --with-colons <mail> | awk -F: '/^fpr/{print $10; exit}')"
export X_REPO_SIGN_KEY="$KEYID"
```

- Guarda la clave secreta en un medio offline o en un token; solo se publica la
  parte pública.
- La clave **no caduca** por diseño: la revocación es manual, así que crea el
  certificado de revocación de inmediato y guárdalo aparte:

  ```bash
  gpg --gen-revoke "$KEYID" > revoke.asc
  ```

  Perder la clave *sin* `revoke.asc` es el único escenario realmente complicado.

## 1. Firmar y publicar

Con `X_REPO_SIGN_KEY` exportada, `build-packages.sh` se encarga de firmar
durante el build local normal:

```bash
X_REPO_SIGN_KEY="$KEYID" ./build-packages.sh              # build + firma + indexa
X_REPO_SIGN_KEY="$KEYID" ./build-packages.sh --index-only # solo reindexa/firma
```

El script:

1. firma cada tarball del directorio del repositorio: los construidos
   localmente ya vienen firmados por `makepkg --sign --key
   "$X_REPO_SIGN_KEY"`, y el tarball importado de `x-scripts` se firma con
   `gpg --detach-sign`, produciendo `*.pkg.tar.zst.sig`;
2. ejecuta `repo-add -s -k "$X_REPO_SIGN_KEY"`, con lo que `x.db`/`x.files`
   quedan firmados, y espeja `x.db.sig`/`x.files.sig` desde las firmas de los
   `.tar.gz`;
3. firma `SHA256SUMS`, produciendo `SHA256SUMS.sig`;
4. exporta `trustedkeys.gpg` y `signing.pub` en `public/repo/x86_64/`.

Sin `X_REPO_SIGN_KEY` el repositorio se publica **sin firmar** y el script
avisa. Revisa, commitea y despliega como se describe en
[publishing.md](publishing.md). Ver [repo-layout.md](repo-layout.md) para los
ficheros resultantes.

## 2. Lado consumidor

Configura pacman en `/etc/pacman.conf`:

```ini
[x]
SigLevel = Required DatabaseOptional
Server = https://equislinux.github.io/x-repo/repo/x86_64
```

`Required DatabaseOptional` verifica las firmas de paquetes y de la base de
datos firmada, a la vez que tolera una base de datos local sin firmar.

Haz bootstrap del keyring **antes** de pasar a `Required`:

```bash
sudo pacman-key --init
sudo pacman-key --add signing.pub
sudo pacman-key --lsign-key "$KEYID"
```

Para el endpoint nativo `xpm`, coloca el keyring binario en
`/etc/xpm/gnupg/trustedkeys.gpg` y define `sig_level = "required"`.

## 3. Integración en ISO/destino (pendiente)

El bloque `[x]` del ISO sigue en `Optional TrustAll`, que es la razón de que
las firmas publicadas no exijan todavía acción al consumidor. Lo pendiente es
el camino de distribución del keyring:

- embeber `signing.pub`/`trustedkeys.gpg` en `airootfs` (entorno live) y en el
  destino instalado;
- publicar un paquete `x-keyring` actualizable para que los cambios de clave
  lleguen a los sistemas instalados;
- recién entonces cambiar el ISO y el bloque `[x]` del instalador a `Required`.

## 4. Rotación y cambio de clave

Las firmas se publican mientras `[x]` sigue en `Optional` durante el
desarrollo, así que un cambio de clave no rompe a nadie todavía. El
procedimiento, planificado o de emergencia:

1. **Cambio planificado**: genera la clave nueva, **firmala con la vieja**
   (prueba continuidad para los clientes que confían en la anterior), publica
   ambas en `trustedkeys.gpg`, re-firma bases de datos/paquetes con la nueva y
   mantén la vieja en el keyring al menos un ciclo de release.
2. **Compromiso**: publica el `revoke.asc` de la clave vieja, publica la nueva,
   re-firma todo y distribuye el keyring actualizado como en (1). Los
   consumidores en `Optional` no se ven afectados; los de `Required`
   necesitan el keyring nuevo antes del primer paquete firmado con la clave
   nueva.
3. **Pérdida (sin compromiso)**: igual que un cambio planificado; las firmas
   viejas siguen válidas, pero no se pueden firmar updates nuevos hasta que se
   distribuya la clave nueva.
4. **Higiene**: nunca borres firmas de paquetes viejas antes de que los
   clientes tengan la clave nueva, y anuncia el cambio de fingerprint en el
   changelog.
