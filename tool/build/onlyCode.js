const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const ncp = require('ncp').ncp;

let siteKey
let version = "unknown"
let env = "main"

function main() {
  try {
    const args = process.argv.slice(2)
    for (const arg of args) {
      if (arg.startsWith("SITE_KEY=")) {
        siteKey = arg.split("=")[1];
      }
      if (arg.startsWith("VERSION=")) {
        version = arg.split("=")[1];
      }
      if (arg.startsWith("ENV=")) {
        env = arg.split("=")[1];
      }
    }

    if (!siteKey) {
      throw new Error("SITE_KEY is not provided.");
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
  const destinationFile = path.resolve(__dirname, "../../src/router/build.ts");

  fs.readFile(sourceFile, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    // 使用fs.writeFile将内容写入目标文件
    fs.writeFile(destinationFile, data, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log(`File copied successfully from ${sourceFile} to ${destinationFile}`);
      buildFile(siteKey);
    });
  });
}

// quasar 打包
function buildFile(){
  // 執行 npm build
  const buildProcess = spawn.sync("quasar", ["build", `--env.VITE_APP_SITE_VERSION=${version}`, `--env.VITE_APP_SITE_ENV=${env}`], { stdio: "inherit" });
  if(buildProcess.status){
    throw buildProcess;
  }

  console.log("編譯完畢！！！");

  copyPublicDirectory();
  backupIndexHtml()
}

// 複製各自版型 template/{siteKey}/public 目錄裡檔案到 dist/spa/ 底下
function copyPublicDirectory(){
  const sourcePublicDir = `template/${siteKey}/public`;
  const dest = "dist/spa";

  fs.access(path.join(__dirname, `/${sourcePublicDir}`), fs.constants.F_OK, (err) => {
    if (err) {
      console.warn(`資料夾不存在: ${sourcePublicDir}`)
      return
    }

    // 檢查目錄是否存在
    ncp(sourcePublicDir, dest, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log(`template/${siteKey}/public 複製完成`);
    });
  });
}

function backupIndexHtml(){
  // 🔍 從目前腳本位置往上找專案根目錄（tool/build/../..）
  const projectRoot = path.resolve(__dirname, '..', '..');

  // 📂 來源與目標檔案路徑
  const srcPath = path.join(projectRoot, 'dist', 'spa', 'index.html');
  const destPath = path.join(projectRoot, 'dist', 'spa', 'index_backup.html');

  console.log('srcPath',srcPath);
  console.log('destPath',destPath);

  // 檢查來源檔案是否存在
  if (!fs.existsSync(srcPath)) {
    console.error('❌ 找不到 index.html，請確認已經執行打包 (quasar build)');
    process.exit(1);
  }

  // 複製檔案
  fs.copyFile(srcPath, destPath, (err) => {
    if (err) {
      console.error('❌ 複製失敗:', err);
      process.exit(1);
    } else {
      console.log('✅ index.html 已成功備份為 index_backup.html');
    }
  });
}

main();
