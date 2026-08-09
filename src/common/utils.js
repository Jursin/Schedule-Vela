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
  if (!normalized.config.semesterStartDate) {
    normalized.config.semesterStartDate = ""
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

module.exports = {
  formatTime,
  createEmptySchedule,
  normalizeScheduleData,
  showToast,
  timeToMinutes,
  startClock,
  stopClock
}
