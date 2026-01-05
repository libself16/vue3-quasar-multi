/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require("quasar/wrappers")
const path = require("path")
const fs = require("fs")

// 讀取 environment.json 獲取 siteKey
const devEnvironmentPath = path.resolve(__dirname, "./src/env/environment.json")
const prodEnvironmentPath = path.resolve(__dirname, "./environment.json")
const environmentPath =
  process.env.NODE_ENV === "development" || process.env.VITE_APP_BUILD_MODE === "all"
    ? devEnvironmentPath
    : prodEnvironmentPath

let siteKey = "okbet" // 預設值

if (fs.existsSync(environmentPath)) {
  try {
    const environment = JSON.parse(fs.readFileSync(environmentPath, "utf-8"))
    siteKey = environment?.siteKey
  } catch (error) {
    console.warn(`無法讀取 environment.json: ${error.message}`)
  }
}

module.exports = configure(function (/* ctx */) {
  const buildModeArg = process.argv.find((arg) => arg.startsWith("--env.VITE_APP_BUILD_MODE="))
  const buildMode = buildModeArg ? buildModeArg.split("=")[1] : "unknown"
  const versionArg = process.argv.find((arg) => arg.startsWith("--env.VITE_APP_SITE_VERSION="))
  const version = versionArg ? versionArg.split("=")[1] : "unknown"
  const npmPackageVersion = process.env.npm_package_version || "unknown"
  const enviromentArg = process.argv.find((arg) => arg.startsWith("--env.VITE_APP_SITE_ENV="))
  const enviroment = enviromentArg ? enviromentArg.split("=")[1] : "main"
  console.log(`編譯版本: ${version}`)
  console.log(`npm package 版本: ${npmPackageVersion}`)
  console.log(`打包環境: ${enviroment}`)
  console.log(`編譯模式: ${buildMode}`)
  console.log(`編譯模板名稱: ${siteKey}`)

  return {
    eslint: {
      // fix: true,
      // include: [],
      // exclude: [],
      // rawOptions: {},
      warnings: true,
      errors: true
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ["i18n", "axios", "marquee", "dayjs", "eventbus", "directives", "cx", "vue-query"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // "mdi-v5",
      // "fontawesome-v6",
      // 'eva-icons',
      // 'themify',
      "line-awesome",
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      // "material-icons" // optional, you are not bound to it
      "roboto-font" // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
      distDir: "dist/spa",
      extendWebpack(cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          "@": path.resolve(__dirname, "./src")
        }
      },
      resolve: {
        // alias: {
        //   "/images": path.resolve(__dirname, "./public/images")
        // }
      },
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },

      vueRouterMode: "history", // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // analyze: true,
      env: {
        // 根據環境變數設置不同的 .env 檔案
        VITE_APP_BASE_API: JSON.stringify(process.env.VITE_APP_BASE_API),
        SITE_KEY: process.env.SITE_KEY,
        VITE_APP_STATIC_RESOURCE_URL: JSON.stringify(process.env.VITE_APP_STATIC_RESOURCE_URL),
        VITE_APP_SITE_VERSION: version || npmPackageVersion || "unknown",
        VITE_APP_SITE_ENV: enviroment || "main",
        VITE_APP_BUILD_MODE: buildMode || "unknown"
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        // 確保 resolve.alias 物件存在
        viteConf.resolve = viteConf.resolve || {}
        viteConf.resolve.alias = viteConf.resolve.alias || {}

        viteConf.resolve.alias["@router/build"] =
          process.env.NODE_ENV === "development"
            ? path.resolve(__dirname, `./template/${siteKey}/router/routes.ts`)
            : path.resolve(__dirname, "./src/router/build")
      },
      viteVuePluginOptions: {
        script: {
          defineModel: true
        }
      },

      vitePlugins: [
        [
          "@intlify/vite-plugin-vue-i18n",
          {
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            // compositionOnly: false,

            // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
            // you need to set `runtimeOnly: false`
            runtimeOnly: false,

            // you need to set i18n resource including paths !
            include: path.resolve(__dirname, "./src/i18n/**")
          }
        ]
      ],

      chainWebpack(chain) {
        chain.module
          .rule("css")
          .oneOf("vue")
          .use("postcss-loader")
          .tap((options) => {
            options.postcssOptions = {
              plugins: [require("tailwindcss"), require("autoprefixer")]
            }
            return options
          })
      }
    },

    // Add variables that you can use in index.template.html: https://quasar.dev/quasar-cli-webpack/quasar-config-file#property-htmlvariables
    htmlVariables: {
      meta: "meta"
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      env: {
        // 根據環境變數設置不同的 .env 檔案
        VITE_APP_BASE_API: JSON.stringify(process.env.VITE_APP_BASE_API)
        // 其他變數...
      },
      proxy: {
        // with options
        "/api": {
          target: `${process.env.VITE_APP_BASE_API}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        "admin/api": {
          target: `${process.env.VITE_APP_BASE_API}/admin`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        // Proxying websockets or socket.io
        "/socket.io": {
          target: "ws://localhost:3000",
          ws: true
        },
        "/statics/staging": {
          target: "https://dobt-dev.gsiwl.com",
          changeOrigin: true,
          secure: false
        }
      }
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        dark: "true",
        brand: {
          accent: "#FFFFFF",
          white: "#FFFFFF"
        }
      },

      iconSet: "material-icons", // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["Notify", "Loading", "Dialog"]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: ["fadeIn", "fadeOut", "fadeInLeft", "fadeInRight", "slideInDown"],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "render" // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: "generateSW", // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false
      // useFilenameHashes: true,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "wow-core"
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"]

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
