# Poundtrades App Build Tasks

- [ ] **Build Android APK** (@Donny)
    - [ ] Set `ANDROID_HOME` environment variable
    - [ ] Run `npx expo prebuild --platform android --clean`
    - [ ] Run `./gradlew assembleRelease`
- [ ] **Verify Build**
    - [ ] Locate APK in `android/app/build/outputs/apk/release`
