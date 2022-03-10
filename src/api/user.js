import http from "../utils/request";

// 登录
export async function loginApi(params) {
  return await http.login("/api/sys_user/login", params);
}
// 获取验证码
export async function getImageApi() {
  return await http.getImage("/api/sys_user/image");
}
// 获取所有用户
export async function getUserListApi() {
  return await http.get("/api/sys_user");
}
// 根据部门id获取用户列表
export async function getUserListByDeptIdApi(params) {
  return await http.getRestApi("/api/sys_user/list", params);
}
// 根据用户ID删除指定用户
export async function deleteUserByUserId(params) {
  return await http.delete("/api/sys_user", params);
}