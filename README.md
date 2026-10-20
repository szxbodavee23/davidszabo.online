# davidszabo.online — statikus portfólió

Szabó Dávid személyes portfólióoldala. Tiszta HTML + CSS + vanilla JS,
a GitHub repókat kliens oldalról tölti a publikus GitHub API-ból.
Hoszt: **Vercel** (ingyenes), domain: davidszabo.online.

## Fájlok

- `index.html` — az egyoldalas site (hero, rólam, szolgáltatások, portfólió, kapcsolat)
- `404.html` — a Vercel automatikusan ezt szolgálja hibás URL-ekre
- `assets/css/main.css` — a Creative Studio téma stíluslapja (dark/light mód)
- `assets/js/main.js` — menü, téma kapcsoló, GitHub repók, Web3Forms űrlap
- `assets/img/about.jpg` — bemutatkozó kép

## Beállítás

### 1. Web3Forms kulcs (kapcsolat űrlap)
1. Menj a https://web3forms.com oldalra, add meg az e-mail címed → kapsz egy access keyt.
2. `assets/js/main.js` → `CST_CONFIG.web3formsKey = 'IDE_A_KULCS'`.

### 2. GitHub felhasználónév
`assets/js/main.js` → `CST_CONFIG.githubUser` (alapból `szxbodavee23`).

## Deploy — Vercel

**A leggyorsabb (Vercel CLI):**

```bash
cd davidszabo.online
npx vercel login
npx vercel --prod
```

Az első futtatásnál válaszd a meglévő Vercel projektedet (amihez a
davidszabo.online már hozzá van rendelve) — a `--prod` azonnal élesíti.

**Vagy Git-repóból (automatikus deploy minden push után):**

1. Pushold fel ezt a mappát egy GitHub repóba.
2. Vercel → Add New → Project → Import a repót → Deploy.
3. Settings → Domains → davidszabo.online hozzárendelve (már kész).
