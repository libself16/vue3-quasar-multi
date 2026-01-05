# 測試結果

測試環境：模擬器 Android 14
測試結果：✅ 前景通知+背景通知 (APP 完全關閉狀態下)

測試環境：實體 Android 14
測試結果：✅ 前景通知+背景通知 (APP 完全關閉狀態下)

測試環境：實體 Android 11
測試結果：❌ 安裝 APK 執行後白畫面（需要 debug）

# 開發環境安裝：

1. 安裝 Android Studio 最新以及相關依賴工具 (Platform Tool, CLI Tools, Gradle...)
2. 安裝 Cordova CLI (12.0.0)
3. 執行 Cordova --version 檢查版本
4. 檢查環境配置
   git checkout origin feat/cordova-APP
   cd src-cordova
   cordova requirements
   系統環境配置可參考:
   https://quasar.dev/quasar-cli-vite/developing-cordova-apps/preparation#android-setup

# 開發指令：

quasar dev -m cordova -T android
版型在 src/env/environment.json 中設定 siteKey

# APK/AAB 打包：

npm run buildApp:onlyCode SITE_KEY=版型名稱
目前只能產出 aab 須轉換 apk 後才能分享給別人安裝，或使用 adb install 來直接安裝（連接 usb）或是簽名 apk

# 發送推播測試

進入網址: https://testfcm.in 1.選 HTTP V1
Projec ID : gsi-notify
Access Token：(臨時)
ya29.c.c0ASRK0GZRVCWX4vDcKdkIC1yIifRKaBMM6sj2lSnjG_J1gS7nvGqPogj03rkwKPLmFugQCslwncgr-XDMWmD2iqrIGO8RSu7hWnik2bfAt5-McobDiFcQUU1eWCSTO4-LsmrJYfyzVWTDE3Tc_I5ED0R4V6jmk9ZsTwRdldrvDexsUlvFoVcj3IU2nHuwyFb9d01ppOf00QMYN64j1NCl5jBX-J-WkhfE_sg4yPuLSQaXQBzaMK-pYY-AZY8-CTQYkvrH1kdGFYD3RHYafSzo0f5iTHzbnDh69T5L-BFp3zgQSPVyzg6uq_6O7nWA55p_CbNa7XxGwLF2L6P6tK1E1ZnQSOJ5uW6KlD0SoKvNqHKMkJwP6PFPW7IaAQE387KY0da6caMrYinOmF_s7RQ8q8cZMVeok2iSf4F7vi14jWJv0hXjumruc4BYsg86JQ9c6aFdt_S2OQn_fkXc3f1nZq-Zt2zXw5ocJVItWqgwhinc61_Wqltrmap3fqXisYnb9e6rwa-XgOkcnm3Joe02bxxJRXlFzm4c7p5lR99UecfUUSY1bF4vY4SbFXFswy4w5Xymzh6QfOX-u0avWuYuX5zlebbuqUj-yMV_dXadp03Jcv2MxZ0rqg7FurpFaX2h08ltFS-7doe_tFicd5V0aWtJMpB9WUVkdMpSSz3wMx1kfRf4Ji5ii6lW5OF8FMaz6BOpOzu6bUUSSrR92mpceVq8QqOFZ964lgWI9mFUfegnapgFRSMb1Qfmke-btS1WoFs8hcWmejaRW1Y90darMVrM-O70wjJRvbR78fviq_nMJF9ShFZkxUefdzzzjZIz_k7q13oQhJhXkSMcBygyrMomjm-x9J0XsintSmmJYqqxwal4rRwkdn9e5n43llimgt14yfrIQWQ73dqbkxhr2vSWq3vS7Jv_RcR1ZWgSYjR5WaqY_WIskMqwdpapfXl7Or13iU1m2mFI2jv_QBVrigwdpMyc2ta8rzOM7d7ZJuXtdVy3wVFquv2

Device Token：設備開啟 APP，找到取得設備 DEVICE TOKEN，並請求通知權限
發送：輸入 title / body 後即可發送

（目前用 okbet 綠版測試，可在左側選單找到取得按鈕）
（access token 取得方法需自行啟用 firebase 專案後，使用服務帳戶登入來取得，目前可暫時使用這組，不確定過期時效)
