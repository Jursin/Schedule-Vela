const prompt = require("@system.prompt")

function formatTime(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const hh = hour < 10 ? "0" + hour : hour + ""
  const mm = minute < 10 ? "0" + minute : minute + ""
  return hh + ":" + mm
}

function createEmptySchedule() {
  return {
    courses: [],
    timeSlots: [],
    config: {
      semesterStartDate: "",
      semesterTotalWeeks: ""
    }
  }
}

function normalizeScheduleData(data) {
  if (!data || typeof data !== "object") {
    return createEmptySchedule()
  }
  const normalized = {
    courses: Array.isArray(data.courses) ? data.courses : [],
    timeSlots: Array.isArray(data.timeSlots) ? data.timeSlots : [],
    config: data.config && typeof data.config === "object" ? data.config : {}
  }
  return normalized
}

function showToast(message) {
  prompt.showToast({
    message,
    duration: 2000
  })
}

function timeToMinutes(text) {
  if (!text || typeof text !== "string") {
    return null
  }
  const match = text.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) {
    return null
  }
  const hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null
  }
  return hour * 60 + minute
}

function startClock(vm, interval) {
  stopClock(vm)
  vm.currentTime = formatTime(new Date())
  vm.timerId = setInterval(() => {
    vm.currentTime = formatTime(new Date())
  }, interval || 30000)
}

function stopClock(vm) {
  if (vm.timerId) {
    clearInterval(vm.timerId)
    vm.timerId = 0
  }
}

function pad2(value) {
  return (value + "").padStart(2, "0")
}

function getPickerIndex(event, options, fallbackIndex) {
  var raw = event && (event.newValue !== undefined ? event.newValue : event.value)
  if (raw === undefined || raw === null || raw === "") {
    return fallbackIndex >= 0 ? fallbackIndex : 0
  }
  var text = raw + ""
  var directIndex = Array.isArray(options) ? options.indexOf(text) : -1
  if (directIndex >= 0) {
    return directIndex
  }
  var numeric = parseInt(text, 10)
  if (!Number.isNaN(numeric)) {
    if (numeric >= 0 && Array.isArray(options) && numeric < options.length) {
      return numeric
    }
    if (Array.isArray(options)) {
      var plainValueIndex = options.indexOf(numeric + "")
      if (plainValueIndex >= 0) {
        return plainValueIndex
      }
      var paddedValueIndex = options.indexOf(pad2(numeric))
      if (paddedValueIndex >= 0) {
        return paddedValueIndex
      }
    }
  }
  return fallbackIndex >= 0 ? fallbackIndex : 0
}

function parseTimeRange(timeText) {
  if (!timeText || timeText.indexOf("-") < 0) {
    return null
  }
  var parts = timeText.split("-")
  var start = timeToMinutes(parts[0])
  var end = timeToMinutes(parts[1])
  if (start === null || end === null) {
    return null
  }
  return { start: start, end: end }
}

module.exports = {
  formatTime,
  createEmptySchedule,
  normalizeScheduleData,
  showToast,
  timeToMinutes,
  startClock,
  stopClock,
  pad2,
  getPickerIndex,
  parseTimeRange
}
