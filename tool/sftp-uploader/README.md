# sftp上傳工具

設定相關參數，便於透過sftp上傳檔案。

> 於 `sftp-uploader/` 資料夾內新增 `config.js` 檔案。

## `config.js` 範例

```js
module.exports = {
  // testing環境
  testing: {
    host: "60.123.123.123",
    port: 22,
    username: "********",
    password: "********",
    localDirectory: "dist/spa",
    remoteDirectory: "/var/www/html/dist"
  },
  // staging環境
  staging: {
    host: "",
    port: 22,
    username: "",
    password: "",
    localDirectory: "",
    remoteDirectory: ""
  },
  // 其他環境...
}
```
