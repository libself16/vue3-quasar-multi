import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

const dateFormat = "YYYY-MM-DD"

export const monthMap: {
  [key: string]: string
} = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
}

export const getToday = (format = dateFormat) => {
  return dayjs().format(format)
}

export const getYesterday = (format = dateFormat) => {
  return dayjs().subtract(1, "day").format(format)
}

export const getTomorrow = (format = dateFormat) => {
  return dayjs().add(1, "day").format(format)
}

export const getThisWeekFirstDay = (format = dateFormat) => {
  return dayjs().startOf("week").format(format)
}

export const getThisWeekLastDay = (format = dateFormat) => {
  return dayjs().startOf("week").format(format)
}

export const getLastWeekFirstDay = (format = dateFormat) => {
  return dayjs().subtract(1, "week").startOf("week").format(format)
}

export const getLastWeekLastDay = (format = dateFormat) => {
  return dayjs().subtract(1, "week").startOf("week").format(format)
}

export const getThisMonthFirstDay = (format = dateFormat) => {
  return dayjs().startOf("month").format(format)
}

export const getThisMonthLastDay = (format = dateFormat) => {
  return dayjs().endOf("month").format(format)
}

export const getLastMonthFirstDay = (format = dateFormat) => {
  return dayjs().subtract(1, "month").startOf("month").format(format)
}

export const getLastMonthLastDay = (format = dateFormat) => {
  return dayjs().subtract(1, "month").endOf("month").format(format)
}

export const getNextMonthFirstDay = (format = dateFormat) => {
  return dayjs().add(1, "month").startOf("month").format(format)
}

export const getNextMonthLastDay = (format = dateFormat) => {
  return dayjs().add(1, "month").endOf("month").format(format)
}

export const getLastOrOverDay = (date: number, format = dateFormat) => {
  return dayjs().add(date, "day").format(format)
}

export const getBetweenDates = (start: string, end: string, unit: "day") => {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const diff = endDate.diff(startDate, unit)

  // 使用 Array.from 生成日期數組
  return Array.from({ length: diff + 1 }, (_, index) => startDate.add(index, unit).format(dateFormat))
}
export const isNowBetween = (start: string, end: string) => {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const now = dayjs()

  return now.isBetween(startDate, endDate)
}

export const dateformat = (start: string, format = dateFormat) => {
  const startDate = dayjs(start)

  return startDate.format(format)
}

export const adultMinDate = (format = dateFormat, age = 18) => {
  return dayjs().subtract(age, "year").startOf("day").format(format)
}

export const isBeforeNow = (dateString: string): boolean => {
  if (!dateString) return false

  const inputDate = dayjs(dateString)

  return inputDate.isBefore(dayjs(), "day")
}

export const parseTimezoneDate = (item: { time: string; timezoneOffset: number }) => {
  return dayjs(item.time).utcOffset(item.timezoneOffset).local()
}

export const padTime = (n: number): string => {
  return String(n).padStart(2, "0")
}

/**
 * 將毫秒 timestamp 轉為 Unix timestamp（秒）
 * @param millis 毫秒 timestamp，例如 1754927999999
 * @returns 秒 timestamp，例如 1754927999
 */
export function toUnixTimestamp(millis: number): number {
  return dayjs(millis).unix()
}

/**
 * 將 Unix timestamp（秒）轉為 毫秒 timestamp（ms）
 * @param unix 秒 timestamp，例如 1754927999
 * @returns 毫秒 timestamp，例如 1754927999000
 */
export function toMsUnixTimestamp(unix: number): number {
  return dayjs.unix(unix).valueOf()
}

export default {
  monthMap,
  getToday,
  getYesterday,
  getTomorrow,

  getThisWeekFirstDay,
  getThisWeekLastDay,
  getLastWeekFirstDay,
  getLastWeekLastDay,

  getThisMonthFirstDay,
  getThisMonthLastDay,
  getLastMonthFirstDay,
  getLastMonthLastDay,
  getNextMonthFirstDay,
  getNextMonthLastDay,
  getLastOrOverDay,
  getBetweenDates,
  isNowBetween,
  dateformat,
  adultMinDate,
  isBeforeNow,
  parseTimezoneDate,
  padTime,
  toUnixTimestamp,
  toMsUnixTimestamp
}
