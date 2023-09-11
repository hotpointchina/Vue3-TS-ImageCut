# mock

1. 使用 mockjs 和 vite-plugin-mock 开发。
2. 当 mock 接口 url 与真实接口 url 一致时，会自动使用 mock 数据。
3. 为避免不必要的数据替换，可在 vite.config 中配置开发环境不打包 mock，或者使用替换模式。

## 替换模式

从后台 api 真实数据,替换成 mock 数据。需要做以下修改

1. mock 接口的 url 前缀需要是 '/basic-api/**\***', 与 env 的 VITE_APP_BASE_URL_PREFIX 保持一致。
2. 修改 env 文件的 VITE_PROXY 代理，前缀与 env 的 VITE_APP_BASE_URL_PREFIX 保持一致。

## 补充模式

即使用后台 api，也使用 mock，mock 的一种补充，此时需要保证：

1. mock 接口的 url 前缀需要是 '/api/**\***', 与 env 的 VITE_APP_BASE_URL_PREFIX 保持一致。
2. 修改 env 文件的 VITE_PROXY 代理，前缀与 env 的 VITE_APP_BASE_URL_PREFIX 保持一致。
3. 注意 mock 接口的 url，不能与已知的后台接口重复。
