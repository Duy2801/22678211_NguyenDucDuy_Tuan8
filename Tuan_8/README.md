# Image Editor (Expo)

This is a small Expo app that lets you pick an image from your device, perform a simple edit (rotate), save the edited image to the device gallery and keep a list of edited images inside the app.

Required packages (already added to package.json):
- expo-image-picker
- expo-image-manipulator
- expo-media-library
- @react-native-async-storage/async-storage

How to run (Windows PowerShell):

1. Install dependencies:

```powershell
npm install
```

2. Start Expo:

```powershell
npm run start
```

3. Use the Expo Go app on your phone or an emulator to open the project. The app requests media permissions at startup.

Notes:
- The app uses simple rotate edit as an example. You can extend editing with crop, flip or filters using `expo-image-manipulator`.
- Permission prompts are required on a device. On iOS simulators, saving to camera roll may not work; use a real device or Android emulator with Google Play services.
