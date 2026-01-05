const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, './.env.deploy') });

let agentCodes = []
let masterCodes = []
let siteKeys = []

function checkRequireConfigs (...arrays) {
  return arrays.every(array =>
    Array.isArray(array) &&
    array.length > 0 &&
    array.every(item => typeof item === 'string')
  )
}

async function main() {
  const agentCodesFile = path.join(__dirname, "../configs/agentCodes.js");
  const masterCodesFile = path.join(__dirname, "../configs/masterCodes.js");
  const siteKeysFile = path.join(__dirname, "../configs/siteKeys.js");
  try {
    // 檢查所需要的檔案是否存在
    if (!fs.existsSync(agentCodesFile) || !fs.existsSync(masterCodesFile) || !fs.existsSync(siteKeysFile)) {
      throw new Error("設定檔缺失，停止執行");
    }

    agentCodes = require(agentCodesFile)
    masterCodes = require(masterCodesFile)
    siteKeys = require(siteKeysFile)

    if (!checkRequireConfigs(agentCodes, masterCodes, siteKeys)) {
      throw new Error("設定檔資料異常，停止執行");
    }

    const questions = [
      {
        type:"list",
        name:"environment",
        message: "請選擇欲部屬的環境:",
        choices: ["staging", "production"],
      },
      {
        type:"list",
        name:"siteKey",
        message: "請選擇欲部屬的版型:",
        choices: siteKeys,
      },
      {
        type:"list",
        name:"agentCode",
        message: "請選擇欲部屬的代理:",
        choices: agentCodes,
      },
      {
        type:"list",
        name:"masterCode",
        message: "請選擇欲部屬的總代:",
        choices: masterCodes,
      }
    ]

    const { environment, siteKey, agentCode, masterCode } = await inquirer.prompt(questions);

    if(!environment){
      throw new Error("未選擇環境");
    }
    if(!siteKey){
      throw new Error("未選擇版型");
    }
    if(!agentCode){
      throw new Error("未選擇代理代碼");
    }
    if(!masterCode){
      throw new Error("未選擇總代代碼");
    }

    // 列出目前的tags清單
    await showCurrentTags({ environment, siteKey, agentCode, masterCode });

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
      agentCode,
      masterCode,
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
    const tagPattern = new RegExp(`refs/tags/${options.environment}-${options.siteKey}-${options.agentCode}-${options.masterCode}.*`, 'g');

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
      console.log(`以下是目前 ${options.environment}-${options.siteKey}-${options.agentCode}-${options.masterCode} 存在的版本:\n`);
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
    const tagName = `${options.environment}-${options.siteKey}-${options.agentCode}-${options.masterCode}-${options.version}`;

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
