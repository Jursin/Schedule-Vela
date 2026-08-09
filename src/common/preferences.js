const storage = require("@system.storage")

const PREFERENCE_KEY = "app_preferences"
const DEFAULT_COLOR = "#237bff"

const DEFAULT_PREFERENCES = {
  themeColor: DEFAULT_COLOR,
  hideTeacher: false,
  centerHomeText: false
}

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

// 读取偏好，回调返回 { themeColor, hideTeacher, centerHomeText }
function getPreferences(callback) {
  storage.get({
    key: PREFERENCE_KEY,
    success: (raw) => {
      callback(parsePreferences(raw))
    },
    fail: () => {
      callback(Object.assign({}, DEFAULT_PREFERENCES))
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
  DEFAULT_COLOR
}
