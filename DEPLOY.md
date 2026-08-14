# Deploy FitCoach Surya (get a real HTTPS link for your iPhone)

You need HTTPS for the full offline PWA. Corporate Wi-Fi blocks tunnels, so use a
free static host. Two easy options — pick one.

## Option A — GitHub Pages (recommended, you already have GitHub)
A workflow is included (`.github/workflows/deploy.yml`) that builds and publishes
automatically.

1. Create a new repo on GitHub, e.g. `fitcoach-surya`.
2. From this folder push the code:
   ```bash
   git init && git add -A && git commit -m "FitCoach Surya PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/fitcoach-surya.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
4. Wait ~1 min. Your app is live at:
   `https://<your-username>.github.io/fitcoach-surya/`
5. Open that URL in **Safari on iPhone → Share → Add to Home Screen**. Full offline PWA.

## Option B — Netlify Drop (no CLI, 60 seconds)
1. Unzip `fitcoach-dist.zip` (or use the `dist/` folder after `bun run build`).
2. Go to https://app.netlify.com/drop and **drag the folder in**.
3. You get an instant `https://<random>.netlify.app` link — open it in Safari on iPhone
   → Share → Add to Home Screen.

## Local network (no HTTPS, works on Amazon Wi-Fi right now)
`bun run dev` → open the printed **Network** URL in iPhone Safari → Add to Home Screen.
Installs and runs (data persists locally); offline caching just won't be active without HTTPS.

---
### About a native app (.ipa / .apk)
- **APK is Android only** — it will not install on an iPhone.
- A native **iOS .ipa** requires a **Mac + Xcode** and an Apple Developer account to be
  installable; it cannot be built on Windows. The PWA above is the practical equivalent:
  home-screen icon, full screen, offline — with none of that overhead.
- If you later get a Mac and want a native shell, this app wraps cleanly with Capacitor
  (`npm i @capacitor/core @capacitor/ios && npx cap add ios`) pointing at `dist/`.
