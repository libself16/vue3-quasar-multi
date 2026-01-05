# git tag 產生器

用於自動產生 git tag，產生後 push origin，並觸發 Whitelabel_GSI_Platform_Multiverse 的 CI/CD。

## 步驟一：在 tool/deploy/ 底下新增 .env.deploy 檔案

###### tool/deploy/.env.deploy
```env
GITLAB_ACCESS_TOKEN=
USER_NAME=
```

- GITLAB_ACCESS_TOKEN：你的 gitlab access token，需先到[此網址](https://gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse/-/settings/access_tokens)進行建立，權限可以全開，有效時限可以設置無。
- USER_NAME：下這個tag的使用者，可直接輸入你的英文名即可。

###### 範例：

```env
# tool/deploy/.env.deploy

GITLAB_ACCESS_TOKEN=XXXXXXXX
USER_NAME=wayne
```

## 步驟二：將你當前版本切換到欲進版的版本


## 步驟三：執行 yarn run deploy

接著按照腳本一步一步執行即可。

---

