const storage = require("@system.storage")

const PREFERENCE_KEY = "app_preferences"
const DEFAULT_COLOR = "#237bff"

const DEFAULT_PREFERENCES = {
  themeColor: DEFAULT_COLOR,
  hideTeacher: false,
  centerHomeText: false
}

// 内存缓存：应用启动时预载，页面同步读取首帧主题色
let cachedPrefs = null

function parsePreferences(raw) {
  let pref = {}
  if (typeof raw === "string") {
    try {
      pref = JSON.parse(raw) || {}
    } catch (err) {
      pref = {}
    }
  }
  return Object.assign({}, DEFAULT_PREFERENCES, pref)
}

// 应用启动时调用，预载偏好到内存缓存
function init(callback) {
  storage.get({
    key: PREFERENCE_KEY,
    success: (raw) => {
      cachedPrefs = parsePreferences(raw)
      if (callback) {
        callback(cachedPrefs)
      }
    },
    fail: () => {
      cachedPrefs = Object.assign({}, DEFAULT_PREFERENCES)
      if (callback) {
        callback(cachedPrefs)
      }
    }
  })
}

// 同步返回缓存的主题色，缓存未就绪时回退默认色
function getCachedThemeColor() {
  return cachedPrefs ? cachedPrefs.themeColor : DEFAULT_COLOR
}

// 读取偏好，回调返回 { themeColor, hideTeacher, centerHomeText }
function getPreferences(callback) {
  storage.get({
    key: PREFERENCE_KEY,
    success: (raw) => {
      cachedPrefs = parsePreferences(raw)
      callback(cachedPrefs)
    },
    fail: () => {
      cachedPrefs = Object.assign({}, DEFAULT_PREFERENCES)
      callback(cachedPrefs)
    }
  })
}

// 合并写入偏好，回调接收是否成功
function setPreferences(patch, callback) {
  const write = (pref) => {
    storage.set({
      key: PREFERENCE_KEY,
      value: JSON.stringify(pref),
      success: () => {
        cachedPrefs = pref
        if (callback) {
          callback(true)
        }
      },
      fail: () => {
        if (callback) {
          callback(false)
        }
      }
    })
  }
  storage.get({
    key: PREFERENCE_KEY,
    success: (raw) => {
      write(Object.assign(parsePreferences(raw), patch))
    },
    fail: () => {
      write(Object.assign({}, DEFAULT_PREFERENCES, patch))
    }
  })
}

module.exports = {
  getPreferences,
  setPreferences,
  init,
  getCachedThemeColor,
  DEFAULT_COLOR
}
