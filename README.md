# Workout App Mobile

Independent Expo/React Native client for Workout App. It uses Expo Router, TanStack Query, Zustand, SQLite offline storage, SecureStore, and local notifications.

Copy `.env.example` to `.env`, set the API URL (use your computer's LAN IP for a physical device), then run:

```sh
npm install
npm start
```

Run `npm run typecheck`, `npm test`, and `npm run lint` before pushing. Backend types are represented locally at the API boundary so this repository has no package or build dependency on the backend repository.

### Windows certificate troubleshooting

If npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, keep TLS verification enabled and use the Windows certificate store for that terminal:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
```
