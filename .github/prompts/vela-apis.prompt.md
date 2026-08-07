# Vela 快应用系统 API 参考

所有 API 通过 `import xxx from '@system.xxx'` 引入，使用前必须在 manifest.json 的 features 中声明。

## 高频 API

### router — 页面路由（无需声明）
```javascript
import router from '@system.router'
router.push({ uri: '/pages/detail', params: { id: '1' } })
router.replace({ uri: '/pages/detail' })
router.back()
router.clear()
router.getLength() / router.getState() / router.getPages()
```
接收参数：目标页面 protected（应用内）或 public（应用外）中声明同名属性。

### fetch — 网络请求
声明: `{ "name": "system.fetch" }`
```javascript
import fetch from '@system.fetch'
fetch.fetch({
  url: 'https://api.example.com/data',
  method: 'GET',  // GET/POST/PUT/DELETE
  header: { 'Content-Type': 'application/json' },
  data: JSON.stringify({ key: 'value' }),
  responseType: 'json',  // text/json/file/arraybuffer
  success(res) { console.log(res.data, res.code, res.headers) },
  fail(data, code) { console.log(code) }
})
```

### storage — 键值存储
声明: `{ "name": "system.storage" }`
```javascript
import storage from '@system.storage'
storage.set({ key: 'token', value: 'xxx' })
storage.get({ key: 'token', success(data) { console.log(data) } })
storage.delete({ key: 'token' })
storage.clear()
```

### prompt — 弹窗提示
声明: `{ "name": "system.prompt" }`
```javascript
import prompt from '@system.prompt'
prompt.showToast({ message: '操作成功', duration: 2000 })
```

### audio — 音频播放
声明: `{ "name": "system.audio" }`
```javascript
import audio from '@system.audio'
audio.src = '/common/music.mp3'
audio.volume = 0.8
audio.play() / audio.pause() / audio.stop()
audio.onended = function() {}
audio.getPlayState({ success(data) { /* state, currentTime, duration */ } })
```

## 其他 API 速查

| API | 声明 | 用途 |
|-----|------|------|
| app | system.app | 应用管理 |
| configuration | system.configuration | 应用配置 |
| device | system.device | 设备信息 |
| network | system.network | 网络状态(subscribe/getType) |
| vibrator | system.vibrator | 振动 |
| brightness | system.brightness | 屏幕亮度 |
| volume | system.volume | 音量控制 |
| battery | system.battery | 电池信息 |
| geolocation | system.geolocation | 地理位置(需权限) |
| sensor | system.sensor | 传感器(加速度/陀螺仪/心率) |
| record | system.record | 录音 |
| file | system.file | 文件操作(readText/writeText/list/delete/move/copy) |
| crypto | system.crypto | 加密(rsa/aes/digest/hmac) |
| request | system.request | 下载管理 |
| interconnect | system.interconnect | 设备互联 |
| event | system.event | 系统事件 |
| alarm | system.alarm | 闹钟 |

## 通用错误码
- 200: 系统通用错误
- 201: 用户拒绝
- 202: 参数错误
- 203: 功能不支持
- 204: 请求超时
- 300: I/O 错误

## Promise 封装推荐
```javascript
function promisify(fn) {
  return (opts = {}) => new Promise((resolve, reject) => {
    fn({ ...opts, success: resolve, fail: (data, code) => reject({ data, code }) })
  })
}
```
