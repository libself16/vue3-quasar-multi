const fs = require("fs")
const path = require("path")
const inquirer = require("inquirer")
const SftpUpload = require("sftp-upload")
const ProgressBar = require("progress")

const configFileName = "config.js"
const configFile = path.join(__dirname, `./${configFileName}`)

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

class SftpUploader {
  isLegal = false
  sftp

  constructor(config, options = {}) {
    if (!this.checkConfig(config)) {
      this.isLegal = false
      return
    }

    this.isLegal = true
    const progressBar = new ProgressBar('[:bar] :percent', { total: 100 })

    this.sftp = new SftpUpload({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      path: config.localDirectory,
      remoteDir: config.remoteDirectory,
      ...options
    })
      .on("error", function (err) {
        throw err
      })
      .on("uploading", function (progress) {
        progressBar.update(progress.percent / progressBar.total)
      })
      .on("completed", function () {
        console.log("Upload Completed")
      })
  }

  checkConfig(env) {
    const requiredKeys = ["host", "port", "username", "password", "localDirectory", "remoteDirectory"]
    return requiredKeys.every((key) => env.hasOwnProperty(key) && !!env[key])
  }

  upload() {
    this.sftp.upload()
  }
}

if (!fileExists(configFile)) {
  console.log(`${configFileName}不存在`)
  return
}

function main() {
  const config = require(configFile)
  const environmentList = Object.keys(config)

  if (!environmentList.length) {
    console.log(`未在${configFileName}取得環境清單`)
    return
  }

  // 選擇環境
  inquirer
    .prompt([
      {
        type: "list",
        name: "environment",
        message: "請選擇發布的環境:",
        choices: environmentList
      }
    ])
    .then((answers) => {
      const selectedEnvironment = answers.environment
      const sftpUploader = new SftpUploader(config[selectedEnvironment])

      if (!sftpUploader.isLegal) {
        console.log(`${configFileName}欄位遺失`)
        return
      }

      sftpUploader.upload()
    })
}

main()
