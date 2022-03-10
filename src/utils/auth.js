import Cookies from 'js-cookie'
// 定义token的key
const tokenKey = 'token'
// 定义用户id的key
const userIdKey = 'userId'
// 定义Token过期时间
const tokenExpireTimeKey = 'expireTime'
// 设置token到cookies里面
export function setToken(params) {
  Cookies.set(tokenKey, params)
}
// 获取token
export function getToken() {
  return Cookies.get(tokenKey)
}
// 移除token
export function removeToken() {
  Cookies.remove(tokenKey)
}
// 设置用户id到cookies里面
export function setUserId(params) {
  Cookies.set(userIdKey, params)
}
// 获取用户id
export function getUserId() {
  return Cookies.get(userIdKey)
}
// 移除用户id
export function removeUserId() {
  Cookies.remove(userIdKey)
}
// 清除sessionStorage
export function removeSession() {
  sessionStorage.clear()
}
// 设置token过期时间
export function setTokenTime(params) {
  Cookies.set(tokenExpireTimeKey, params)
}
// 获取token过期时间
export function getTokenTime() {
  return Cookies.get(tokenExpireTimeKey)
}
// 清空token过期时间
export function removeTokenTime() {
  Cookies.set(tokenExpireTimeKey, 0)
}
