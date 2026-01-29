$env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot'
$env:ANDROID_HOME = 'C:\Users\jonny\AppData\Local\Android\Sdk'
$env:NODE_BINARY = 'C:\Users\jonny\Anaconda3\node.exe'
$env:Path = "C:\Users\jonny\Anaconda3;C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot\bin;C:\Users\jonny\AppData\Local\Android\Sdk\platform-tools;$env:Path"

Write-Host "📱 The Don's Launch Script" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Check for ADB devices
$devices = adb devices
if ($devices -match "\tdevice") {
    Write-Host "✅ Device/Emulator detected. Installing APK..." -ForegroundColor Green
    adb install -r "android/app/build/outputs/apk/debug/app-debug.apk"
    if ($?) {
        Write-Host "🚀 Install successful! Starting Metro Bundler..." -ForegroundColor Green
        npx expo start
    } else {
        Write-Host "❌ Install failed. Check your device connection." -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ No device found. Please launch an Android Emulator first." -ForegroundColor Yellow
    Write-Host "Once the emulator is running, run this script again." -ForegroundColor Yellow
    Write-Host "Or manually drag this file to the emulator:" -ForegroundColor Gray
    Write-Host "android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Gray
}
