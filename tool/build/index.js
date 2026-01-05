const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");

let siteKey

function main() {

  const envPath = path.join("environment.json");
  try {

    // 執行 npm createEnv
    const createEnvProcess = spawn.sync("npm", ["run", "createEnv"], { stdio: "inherit" });
    if(createEnvProcess.status){
      throw createEnvProcess
    }

    // 檢查是否產生了 environment.json 檔案
    if (!fs.existsSync(envPath)) {
      throw new Error("environment.json 檔案不存在，停止執行");
    }

    // TODO: 改這裡選SITEKEY => 走 build only code
    fs.readFile(envPath, "utf8", (err,env) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return;
      }
      const envData = JSON.parse(env)
      if(!envData.siteKey){
        throw new Error("env檔siteKey為空!");
      }

      siteKey = envData.siteKey

      buildFile()
    })

  } catch (error) {
    console.error("執行出錯:", error);
    process.exit(1);
  }
}

function buildFile(){

  // 命令
  const command = 'npm';
  // 參數
  const args = ['run', 'build:onlyCode', '--', `SITE_KEY=${siteKey}`];

  // 執行 npm build
  const buildProcess = spawn.sync(command, args, { stdio: "inherit" });
  if(buildProcess.status){
    throw buildProcess
  }

  // 將 environment.json 搬移到 /dist/spa
  const source = path.join("environment.json");
  const destination = path.join("dist", "spa", "environment.json");
  fs.renameSync(source, destination);
  console.log("編譯完畢！！！");
}

main()
