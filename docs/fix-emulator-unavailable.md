# aiot-toolkit 模拟器启动报错 "this emulator is unavailable"

## 现象

执行 `npm run start`（即 `aiot start --watch`）选择模拟器后，立即报错：

```
❌ [toolkit]: this emulator is unavailable, please create a new emulator.
```

但单独启动模拟器再手动安装 RPK 是正常的。

## 根因

`aiot-toolkit` 的 `isAvailableEmulator()` 方法只检查 VVD 配置中的 `image.sysdir.2` 字段来判断镜像是否可用：

```js
// aiot-toolkit/lib/starter/VelaUxStarter.js
isAvailableEmulator(avdName) {
    const { imageDir } = vvdManager.getVvdInfo(avdName);
    // imageDir 来自 config.ini 的 image.sysdir.2
    if (!imageDir || !existsSync(resolve(imageDir, 'nuttx'))) {
        return false;  // ← 在这里失败
    }
    return true;
}
```

而 `@aiot-toolkit/emulator` 的 `getVvdInfo()` 读取配置时：

```js
vvdInfo.imageDir = config['image.sysdir.2'];        // ← 只取这个
vvdInfo.customImagePath = config['image.sysdir.1'];  // ← 没人用
```

**问题在于**：模拟器启动后会将 VVD 的 `config.ini` 重写，把镜像路径写入 `image.sysdir.1` 而非 `image.sysdir.2`，导致下次检查时 `image.sysdir.2` 为空 → 检查失败。

配置变化过程：

```ini
# 初始状态（手动修复后）
image.sysdir.2=%USERPROFILE%\.vela\sdk\system-images\vela-pre-4.0
image.sysdir.1=%USERPROFILE%\.vela\sdk\system-images\vela-pre-4.0

# 模拟器启动后（被重写）
image.sysdir.1=%USERPROFILE%\.vela\sdk\system-images\vela-pre-4.0
# image.sysdir.2 消失了
```

## 解决办法

Patch 两个文件，让检查逻辑兼容 `image.sysdir.1` 作为回退：

### 1. `node_modules/aiot-toolkit/lib/starter/VelaUxStarter.js`

找到 `isAvailableEmulator` 方法，将：

```js
isAvailableEmulator(avdName) {
    const { imageDir } = _VelaAvdUtils.default.vvdManager.getVvdInfo(avdName);
    if (!imageDir || !_fsExtra.default.existsSync(_path.default.resolve(imageDir, 'nuttx'))) {
        return false;
    }
    return true;
}
```

改为：

```js
isAvailableEmulator(avdName) {
    const { imageDir, customImagePath } = _VelaAvdUtils.default.vvdManager.getVvdInfo(avdName);
    const resolvedDir = imageDir || customImagePath;
    if (!resolvedDir || !_fsExtra.default.existsSync(_path.default.resolve(resolvedDir, 'nuttx'))) {
        return false;
    }
    return true;
}
```

### 2. `node_modules/@aiot-toolkit/emulator/lib/vvd/index.js`

在 `getVvdStartCmd` 方法中，找到：

```js
const vvdInfo = this.getVvdInfo(vvdName);
await this.oldEmulatorMigrate(vvdName);
if (!vvdInfo.imageDir) {
    const errMsg = `${vvdName} is not supported`;
    _ColorConsole.default.throw(errMsg);
    throw new Error(errMsg);
}
```

改为：

```js
const vvdInfo = this.getVvdInfo(vvdName);
await this.oldEmulatorMigrate(vvdName);
const resolvedImageDir = vvdInfo.imageDir || vvdInfo.customImagePath;
if (!resolvedImageDir) {
    const errMsg = `${vvdName} is not supported`;
    _ColorConsole.default.throw(errMsg);
    throw new Error(errMsg);
}
if (!vvdInfo.imageDir && vvdInfo.customImagePath) {
    vvdInfo.imageDir = vvdInfo.customImagePath;
}
```

## 重新应用

Patch 位于 `node_modules/` 中，执行 `npm install` 后会被覆盖，需要重新应用。

可自行通过脚本快速 patch。

## 关联信息

- VVD 配置目录：`%USERPROFILE%\.vela\vvd\<设备名>.vvd\config.ini`
- 镜像目录：`%USERPROFILE%\.vela\sdk\system-images\`
- 相关工具包：`aiot-toolkit`、`@aiot-toolkit/emulator`
