# Food Vista

Food Vista is an Expo SDK 58 app for scanning meals and tracking estimated nutrition. It currently uses a built-in demo sign-in and stores meal history on the device.

## Run locally

1. Run `npm install`.
2. Optionally set `EXPO_PUBLIC_AI_MODEL_API_URL` in `.env` to connect a prediction service. The expected request and response are described in [docs/architecture.md](docs/architecture.md).
3. Run `npx expo start` and open the app in an Expo development build on a physical device for camera and sensor access.

Use **test@test.com** and **test1234** to sign in. See [docs/deployment.md](docs/deployment.md) for setup notes.
