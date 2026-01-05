const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const ncp = require('ncp').ncp;
const xml2js = require('xml2js');
const basePath = path.resolve(__dirname, '../../');
const { exec } = require("child_process");
const fsExtra = require("fs-extra"); // 用這個可以處理整個資料夾的刪除

let siteKey, agentCode

// --  打包流程： -- //
// 1. 原SPA打包流程 + 複製 environment.json 到 /public
// 2. cordova 打包 apk + 簽名
// 3. apk 打包後路徑 ../src-cordova/platforms/android/app/build/outputs/apk/release 找到signedxxxx.apk

// packageType: aab, apk (aab用於上架Google Play, apk用於下載安裝, 非特殊情況使用apk即可)
const packageType = 'apk'

const keystoreConfig = {
  // keystore用於 apk 簽名, 打包流程會自動簽名
  name: 'staging.keystore',
  // keystoreAlias 創建key時帶入的alias
  alias: 'staging',
  // keystore 密碼, 創建key時輸入的密碼 pass:密碼
  pass: 'pass:123123'
}
// --  打包流程： -- //

let version = "unknown"
let packageNamePrefix = "gsi.cordova.app"

function main() {
  try {
    const args = process.argv.slice(2)
    for (const arg of args) {
      if (arg.startsWith("SITE_KEY=")) {
        siteKey = arg.split("=")[1];
      }

      if (arg.startsWith("AGENT_CODE=")) {
        agentCode = arg.split("=")[1];
      }

      if (arg.startsWith("VERSION=")) {
        version = arg.split("=")[1];
      }
    }

    if (!siteKey) {
      throw new Error("SITE_KEY is not provided.");
    }

    if (!agentCode) {
      throw new Error("AGENT_CODE is not provided.");
    }

    writeBuildRouter();

  } catch (error) {
    console.error("執行出錯:", error);
    process.exit(1);
  }
}

// 寫入編譯路由
function writeBuildRouter() {
  const sourceFile = path.resolve(__dirname, `../../template/${siteKey}/router/routes.ts`);
  const destFile = path.resolve(__dirname, "../../src/router/build.ts");

  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    fs.writeFile(destFile, data, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log(`File copied successfully from ${sourceFile} to ${destFile}`);

      writeEnvToPublic()
    });
  });
}



function updateAndroidPackageName(packageName)  {
  return new Promise( (R) => {

    const configXmlPath = path.resolve(basePath, 'src-cordova', 'config.xml');
    const newPackageName = packageName;

    fs.readFile(configXmlPath, 'utf-8', (err, data) => {
      if (err) {
          console.error('無法讀取 config.xml:', err);
          return;
      }

      xml2js.parseString(data, (err, result) => {
          if (err) {
              console.error('解析 XML 失敗:', err);
              return;
          }

          if (!result.widget || !result.widget.$) {
              console.error('config.xml 格式不正確，未找到 <widget> 標籤');
              return;
          }

          // 修改 android-packageName
          result.widget.$['id'] = newPackageName;

          // 轉換回 XML
          const builder = new xml2js.Builder();
          const updatedXml = builder.buildObject(result);

          // 寫回文件
          fs.writeFile(configXmlPath, updatedXml, 'utf-8', (err) => {
              if (err) {
                  console.error('寫入 config.xml 失敗:', err);
                  return;
              }
              console.log(`✅ 成功更新 android-packageName 為 ${newPackageName}`);
              R()
          });
      });
    });

  })

}

// 寫入envriment.json到 public/
function writeEnvToPublic() {
  const sourceFile = path.resolve(__dirname, `../../src/env/environment.json`);
  const destFile = path.resolve(__dirname, "../../public/environment.json");
  const cordovaProjectPath = path.resolve(__dirname, "../../src-cordova");

  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    fs.writeFile(destFile, data, "utf8", async (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log(`File copied successfully from ${sourceFile} to ${destFile}`);

      await updateAndroidPackageName(`${packageNamePrefix}_${agentCode}`)

// 🔥 移除 src-cordova/www
try {
  const wwwPath = path.join(cordovaProjectPath, "www");

  if (fs.existsSync(wwwPath)) {
    const files = await fs.promises.readdir(wwwPath);
    for (const file of files) {
      const curPath = path.join(wwwPath, file);
      await fsExtra.remove(curPath);
    }
    console.log("🧹 已清空 src-cordova/www 內容");
  }
} catch (err) {
  console.error("❌ 無法清空 src-cordova/www：", err);
}

      // 移除 platform android 再新增，這樣packageName才能生效
      try {

        await runCommand("cordova platform rm android", cordovaProjectPath);
        console.log("✅ 已移除 android app...");
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("✅ 正在重建 android app...");
        await runCommand("cordova platform add android", cordovaProjectPath);
        console.log("✅ 已重建 android app...");

        // wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // ✅ 建 APK
        await buildApk();
      } catch (e) {
        console.error("Cordova platform 操作失敗", e);
      }

    });
  });
}

// quasar 打包
function buildApk(){
  console.log("🚀 正在建構 Cordova APP...");

  const buildParams = ["build", `--env.VITE_APP_SITE_VERSION=${version}`, '-m', 'cordova', '-T', 'android', '--release']

  if (packageType === 'apk') {
    buildParams.push('--')
    buildParams.push('--')
    buildParams.push('--packageType=apk')
  }

  const buildProcess = spawn.sync("quasar", buildParams, { stdio: "inherit" });
  if(buildProcess.status){
    throw buildProcess;
  }

  // 移除apk
  const oldEnvPath = path.resolve(__dirname, "../../public/environment.json");
  fs.unlinkSync(oldEnvPath);

  console.log("✅ Cordova APP 建構完畢！🎉");

  signApk()
}
function signApk(){
  console.log("🚀 正在簽名...");

  const keystorePath = path.resolve(basePath, 'src-cordova', keystoreConfig.name);
  const unsignedAPKPath = path.resolve(basePath, 'src-cordova', 'platforms', 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');
  const signedAPKPath = path.resolve(basePath, 'src-cordova', 'platforms', 'android', 'app', 'build', 'outputs', 'apk', 'release', `app-release-signed-${keystoreConfig.alias}-${agentCode}.apk`);

  const signProcess = spawn.sync("apksigner", [
    "sign",
    "--ks", keystorePath,
    "--ks-key-alias", keystoreConfig.alias,
    "--ks-pass", keystoreConfig.pass,
    "--out", signedAPKPath,
    unsignedAPKPath
  ], { stdio: "inherit" });

  if (signProcess.status !== 0) {
    throw '簽名失敗 請檢查環境設定是否有 apksigner';
  }

  console.log("✅ APK 已簽名");
}

function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running command '${cmd}': ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

main()



