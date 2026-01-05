const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const ncp = require('ncp').ncp;

let version = "unknown"
let mode = "all"

function main() {
  try {

    const args = process.argv.slice(2)
    for (const arg of args) {

      if (arg.startsWith("VERSION=")) {
        version = arg.split("=")[1];
      }

      if (arg.startsWith("MODE=")) {
        mode = arg.split("=")[1];
      }
    }

    buildFile()
  } catch (error) {
    console.error("執行出錯:", error);
    process.exit(1);
  }
}

// quasar 打包
function buildFile(){
  // 執行 npm build
  const buildProcess = spawn.sync("quasar", ["build", `--env.VITE_APP_SITE_VERSION=${version}`, `--env.VITE_APP_BUILD_MODE=${mode}`], { stdio: "inherit" });
  if(buildProcess.status){
    throw buildProcess;
  }

  console.log("編譯完畢！！！");
  backupIndexHtml()
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
