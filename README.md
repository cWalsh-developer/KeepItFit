# Workout App workspace

The product is split across two independent repositories:

- `mobile/` — Expo/React Native application
- `D:\KeepItFitBackend` — deployable FastAPI/PostgreSQL API (separate folder)

Each has its own Git history, CI, dependencies, environment template, and README. There is deliberately no monorepo workspace or shared build package.
