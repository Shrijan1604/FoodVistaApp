# Food Vista architecture

- Expo SDK 58 and Expo Router routes live in `src/app`; Zustand holds the local demo session and scan result.
- The demo login accepts `test@test.com` / `test1234`. The session is persisted with AsyncStorage.
- Meal records are persisted on-device with AsyncStorage at the store layer. History reads the last seven days and groups meals by local date.
- The scan route checks gravity with the accelerometer to guide a top-down angle and uses gyroscope movement to check steadiness. The user reviews the resized JPEG before upload.
- Set `EXPO_PUBLIC_AI_MODEL_API_URL` to an optional model endpoint. No prediction server is included in this project.

## Prediction API contract

Send `POST` multipart/form-data with an `image` field (`image/jpeg`). Return a JSON object like:

```json
{
  "dishName": "Roasted vegetable bowl",
  "ingredients": ["quinoa", "chickpeas", "roasted squash"],
  "portion": "1 bowl · 420 g",
  "macros": { "calories": 520, "protein": 21, "carbs": 68, "fats": 18 },
  "micros": { "fiber": 12, "sodium": 640, "vitamins": ["A", "C"] },
  "imageUrl": "https://..."
}
```

`imageUrl` and `micros` are optional. The app keeps the processed image URI for display when the endpoint omits an image URL. The endpoint should reject blurry or dark photos with HTTP `422` and a JSON `{ "message": "..." }` response. Nutrition values are estimates.
