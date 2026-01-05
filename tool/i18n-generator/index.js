const { google } = require("googleapis");
const fs = require("fs");

// gcp key
const keyFile = "tool/i18n-generator/key.json";
const key = JSON.parse(fs.readFileSync(keyFile));

// 设置 Google Sheets API 客户端
const sheets = google.sheets({
  version: "v4",
  auth: new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]),
});

// Google 表单 ID 和数据范围
const spreadsheetId = "1_h5-lhnTey6XA4BIFps32we0-E_kXvjHDxyU7FfLefs";
const range = "Sheet1!A1:Z5000";

// 下载数据
sheets.spreadsheets.values.get(
  {
    spreadsheetId: spreadsheetId,
    range: range,
  },
  (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
    const rows = res.data.values;
    if (rows.length) {
      const jsonData = rows.map((row) => {
        const obj = {};

        row.forEach((value, index) => {
          const header = rows[0][index]; // 使用第一行作为 JSON 对象的属性名
          obj[header] = value;
        });
        return obj;
      });
      const keys = jsonData.shift();
      Object.keys(keys).forEach((e) => {
        if (e != "key") {
          formatJsonData(jsonData, e);
        }
      });
    } else {
      console.log("No data found.");
    }
  }
);

const formatJsonData = (json, langKey) => {
  let obj = {};
  let currentKey = null;
  let currentSubKey = null;
  let isKeyIndex = true;
  let isInSubKey = false;
  json.map((item) => {
    // console.log(item);
    let key = String(item.key);
    isKeyIndex = false;
    if (key !== "") {
      if (key.indexOf("[") > -1) {
        // 處理大分類
        let categoryKey = item.key.replace("[", "").replace("]", "");
        currentKey = categoryKey;
        obj[categoryKey] = {};
        isKeyIndex = true;
        isInSubKey = false;
      }
      if (key.indexOf("--") > -1) {
        let subKey = item.key.replace("-- ", "");
        currentSubKey = subKey;
        obj[currentKey][currentSubKey] = {};
        isInSubKey = true;
      } else {
        if (isInSubKey) {
          obj[currentKey][currentSubKey][key] = item[langKey];
          if (currentSubKey == "bindEmail") {
            // bindEmail 處理一次即跳出
            isInSubKey = false;
          }
          if (
            currentKey == "wallet" &&
            currentSubKey == "link" &&
            key == "tipText"
          ) {
            // 避免重複出現
            isInSubKey = false;
          }
          // 例外處理
        } else {
          if (!isKeyIndex) {
            obj[currentKey][key] = item[langKey];
          }
        }
      }
    }
  });

  // 将对象转为字符串形式
  const objectAsString = `export default ${JSON.stringify(obj, null, 2)};`;

  // 将字符串写入文件
  const filePath = `src/i18n/locales/${langKey}.ts`; // 替换为你希望保存的文件路径
  fs.writeFileSync(filePath, objectAsString);
};
