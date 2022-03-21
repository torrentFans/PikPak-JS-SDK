# PikPak-SDK

## 1.使用方法

使用`data-pikpak`属性输入资源链接

```html
<div class="link-button" data-pikpak="magnet:?xt=urn:btih:C1DC6E79765D547BC5FAF382FDB11F1FCB2C4DB3">保存到PikPak</div>

<script src="./pikpak-sdk.umd.js"></script>
<script>
	// init接受两个参数(apk下载地址, 不填将使用默认apk下载地址), source值
	PikPak.init('https://xxxx/PikPak.apk', 'PikPak-SDK');
</script>
```

## 2.开发启动流程

```shell
cd pikpak-sdk
yarn # 或者 npm install
# 启动开发服务器
yarn dev # 或者 npm run dev
# 打包产物
yarn build # 或者 npm run build
```