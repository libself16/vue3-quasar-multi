//node.js 的檔案系統，能夠幫助存取、讀取檔案
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

let siteKey

async function main() {
  const args = process.argv.slice(2)
  for (const arg of args) {
    if (arg.startsWith("SITE_KEY=")) {
        siteKey = arg.split("=")[1];
    }
  }
  // https://api-stagingagent.gsiwl.com
  const envData = {
    baseApi: "",
    staticResourceUrl: "https://stagingagent.gsiwl.com/statics/staging",
    apiPath: "/v1/player",
    version: "1.0.0",
    siteKey:siteKey,
  }

  const prompts = [
    {
      type: "input",
      name: "baseApi",
      message: "請輸入api網址",
    },
  ]

  if(!siteKey){
    const siteKeys =  await getFoldersInDirectory(path.join(__dirname, '../../template'));

    // 檢查所需要的檔案是否存在
    if (!siteKeys.length) {
      throw new Error("找不到版型，停止執行");
    }

    prompts.push({
      type: "list",
      name: "siteKey",
      message: "請選擇版型:",
      choices: siteKeys,
    })
  }

  inquirer.prompt(prompts).then((answers) => {

    if(!answers.baseApi){
      throw new Error("請正確輸入api網址");
    }

    if(!siteKey && !answers.siteKey){
      throw new Error("請正確輸入siteKey");
    }

    envData.baseApi = answers.baseApi
    if(answers.siteKey){
      envData.siteKey = answers.siteKey
    }

    writeJSON(envData);
  })
  return
}

//寫入以上 json 文件選項
function writeJSON(envData) {
  // convert JSON object to string
  const data = JSON.stringify(envData);

  // write JSON string to a file
  fs.writeFile("environment.json", data, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}

async function getFoldersInDirectory(directoryPath) {
  try {
    // 讀取指定目錄下的所有項目
    const items = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    // 取出資料夾名稱
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    return folders;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}
main();
