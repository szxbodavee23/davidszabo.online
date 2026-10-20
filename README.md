# davidszabo.online — statikus portfólió

Szabó Dávid személyes portfólióoldala. Tiszta HTML + CSS + vanilla JS,
a GitHub repókat kliens oldalról tölti a publikus GitHub API-ból.

## Fájlok

- `index.html` — az egyoldalas site (hero, rólam, szolgáltatások, portfólió, kapcsolat)
- `404.html` — GitHub Pages automatikusan ezt szolgálja hibás URL-ekre
- `assets/css/main.css` — a Creative Studio téma stíluslapja (dark/light mód)
- `assets/js/main.js` — menü, téma kapcsoló, GitHub repók, Web3Forms űrlap
- `CNAME` — GitHub Pages custom domain (davidszabo.online)
- `.nojekyll` — kikapcsolja a Jekyll-feldolgozást a Pagesen

## Beállítás

### 1. Web3Forms kulcs (kapcsolat űrlap)
1. Menj a https://web3forms.com oldalra, add meg az e-mail címed → kapsz egy access keyt.
2. `assets/js/main.js` → `CST_CONFIG.web3formsKey = 'IDE_A_KULCS'`.

### 2. GitHub felhasználónév
`assets/js/main.js` → `CST_CONFIG.githubUser` (alapból `szxbodavee23`).

### 3. Publikálás GitHub Pages-re
1. Hozz létre egy **public** repót (pl. `davidszabo.online` vagy `szxbodavee23.github.io`).
2. Pushold fel a fájlokat.
3. Repo → **Settings → Pages → Deploy from a branch → main / root**.
4. **Custom domain**: `davidszabo.online` → Save → **Enforce HTTPS** bekapcsolása (a DNS propagáció után).

### 4. Namecheap DNS
Namecheap → Domain List → `davidszabo.online` → Manage → **Advanced DNS**:

- Töröld a default parkoló/átirányító rekordokat, majd add hozzá:

| Type  | Host | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | szxbodavee23.github.io |

~10-30 perc múlva él a https://davidszabo.online cím.
