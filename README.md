# WebRadio Desktop

Application Electron pour WebRadio Chat — notifs système même navigateur fermé.

## Structure

```
webradio-app/
├── main.js          # Process principal Electron
├── preload.js       # Bridge renderer ↔ main
├── package.json
├── build/
│   └── icon.ico     # Icône (à ajouter)
└── .github/
    └── workflows/
        └── build.yml
```

## Build local

```bash
npm install
npm start          # Dev
npm run build:win  # Package Windows
```

## Release

Push un tag pour déclencher le build automatique :

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions buildера le `.exe` et le `.zip` et les attachera à la release.

## Icône

Place un fichier `build/icon.ico` (256x256 recommandé) dans le repo.
