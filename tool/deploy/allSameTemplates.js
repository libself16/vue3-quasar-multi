const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, './.env.deploy') });

let siteKeys = []

function checkRequireConfigs (...arrays) {
  return arrays.every(array =>
    Array.isArray(array) &&
    array.length > 0 &&
    array.every(item => typeof item === 'string')
  )
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

async function main() {
  try {
    siteKeys = await getFoldersInDirectory(path.join(__dirname, '../../template'));

    // 檢查所需要的檔案是否存在
    if (!siteKeys.length) {
      throw new Error("找不到版型，停止執行");
    }

    if (!checkRequireConfigs(siteKeys)) {
      throw new Error("版型資料異常，停止執行");
    }

    const questions = [
      {
        type:"list",
        name:"environment",
        message: "請選擇欲部屬的環境:",
        choices: ["develop", "staging", "production"],
      },
      {
        type:"list",
        name:"siteKey",
        message: "請選擇欲部屬的版型:",
        choices: siteKeys,
      }
    ]

    const { environment, siteKey } = await inquirer.prompt(questions);

    if(!environment){
      throw new Error("未選擇環境");
    }
    if(!siteKey){
      throw new Error("未選擇版型");
    }

    // 列出目前的tags清單
    await showCurrentTags({ environment, siteKey });

    const versionQuestion = [
      {
        type:"input",
        name:"version",
        message: "請輸入版本號:"
      }
    ];

    const { version } = await inquirer.prompt(versionQuestion);

    if(!version){
      throw new Error("未輸入版本號");
    }

    deploy({
      environment,
      siteKey,
      version
    });

  } catch (error) {
    console.error("執行出錯:", error);
    process.exit(1);
  }
}

async function showCurrentTags(options) {
  const accessToken = process.env.GITLAB_ACCESS_TOKEN;
  const username = process.env.USER_NAME;
  if (!username || !accessToken) {
    console.error('Error: USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .deploy-env 檔案裡');
    process.exit(1);
  }

  try {
    const remoteUrl = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;

    const existingTags = execSync(`git ls-remote --tags ${remoteUrl}`).toString();
    const tagPattern = new RegExp(`refs/tags/${options.environment}-${options.siteKey}-.*`, 'g');

    const matchingTags = [];
    let match;

    while ((match = tagPattern.exec(existingTags)) !== null) {
      // 忽略带有 ^{} 的部分
      const tag = match[0].replace('refs/tags/', '').replace('^{}', '');
      if (!matchingTags.includes(tag)) {
        matchingTags.push(tag);
      }
    }

    if (matchingTags.length) {
      console.log(`以下是目前 ${options.environment}-${options.siteKey} 存在的版本:\n`);
      matchingTags
        .sort((a, b) => {
          const aParts = a.split('-').pop().replace('v', '').split('.').map(Number);
          const bParts = b.split('-').pop().replace('v', '').split('.').map(Number);
          for (let i = 0; i < aParts.length; i++) {
            if (aParts[i] !== bParts[i]) {
              return aParts[i] - bParts[i];
            }
          }
          return 0;
        })
        .forEach(version => console.log(version));

      console.log("\n");
      return
    }

    console.log(`當前選擇的環境與版型並未存在其他版本的 tags`)
  } catch (error) {
    console.error(`取得當前選擇的環境與版型 tags 失敗: ${error.message}`);
  }
}

async function deploy(options){
  const accessToken = process.env.GITLAB_ACCESS_TOKEN;
  const username = process.env.USER_NAME;
  if (!username || !accessToken) {
    console.error('Error: USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .deploy-env 檔案裡');
    process.exit();
  };

  try {
    const remoteUrl = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;
    const tagName = `${options.environment}-${options.siteKey}-${options.version}`;

    const existingTags = execSync(`git ls-remote --tags ${remoteUrl}`).toString();
    const tagExists = existingTags.includes(tagName);

    if (tagExists) {
      console.log(`${tagName} tag 已經存在`);
    } else {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmPush",
          message: `${tagName} 允許建立，是否確認建立並推送?`,
          default: false
        }
      ])

      if (!answer.confirmPush) {
        console.log(`取消建立 tag: ${tagName}`);
        process.exit();
      }

      execSync(`git tag ${tagName}`);
      execSync(`git push ${remoteUrl} ${tagName}`, { stdio: 'inherit' });

      console.log(`${tagName} tag 已成功建立並完成推送`);
    }
  } catch(e) {
    console.error(`建立或推送 tag 失敗: ${error.message}`);
  }
}

main()
