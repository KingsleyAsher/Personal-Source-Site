# 知隅 · GitHub Pages 资料站
纯静态网站，23 份 PDF 随网站打包，在站内 PDF.js 阅读器显示，不依赖本机目录或后端接口。支持全屏/退出全屏、翻页、页码跳转、缩放。无下载或原文件跳转按钮；公开站点资源仍可由浏览器获取。

本机预览：npm install 后 npm run dev。
构建：npm run build。静态成品目录：dist/client。
GitHub：推送到仓库 main，在仓库 Settings > Pages 中选择 GitHub Actions；.github/workflows/pages.yml 自动构建并发布。
发布仓库：KingsleyAsher/Personal-Source-Site。线上地址：https://kingsleyasher.github.io/Personal-Source-Site/

更新文件：本机运行 node scripts/sync-library.mjs，再提交 public/library.json 和 public/documents 下文件并推送。网页“刷新目录”只重新读取已发布的清单，不扫描电脑。
本机来源配置 .local/library.json 不上传；PDF 发布副本位于 public/documents。
