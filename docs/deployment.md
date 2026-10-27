# Local setup and deployment

1. Install Node.js and npm, then run `npm install`.
2. Sign in with the demo account `test@test.com` / `test1234`. No backend project or credentials are needed for sign-in and local meal history.
3. For meal recognition, set `EXPO_PUBLIC_AI_MODEL_API_URL` in `.env` to a server implementing the contract in [architecture.md](./architecture.md). Keep model credentials on that server, not in the app.
4. Start development with `npx expo start`. Camera and motion sensors need a physical device or a development build.
5. Build store binaries with EAS Build when you are ready to distribute the app.

The demo credentials are embedded in the client and are for local/demo access only. Replace them with a production authentication service before releasing a public app. Meal history is local to the current device.
