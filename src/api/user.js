import http from "../utils/request";

// 登录
export async function loginApi(params) {
  return await http.login("/api/sys_user/login", params);
}
// 获取验证码
export async function getImageApi() {
  return await http.getImage("/api/sys_user/image");
}
// 根据部门id获取用户列表
export async function getUserListApi(params) {
  return await http.getRestApi("/api/sys_user/list", params);
}
// 根据用户ID删除指定用户
export async function deleteUserByUserId(params) {
  return await http.delete("/api/sys_user", params);
}
// 新增用户
export async function addUserApi(params) {
  return await http.post('/api/sys_user/register', params)
}
// 编辑用户
export async function editUserApi(params) {
  return await http.patch('/api/sys_user', params)
}

// 授权操作之前根据用户的ID获取该用户的角色ID,用于数据回显
export async function getRoleIdByUserIdApi(params) {
  return await http.getRestApi('/api/sys_user_role/getRoleIdByUserId', params)
}
// 在给其他用户分配角色之前,根据分配者的userID获取角色列表
export async function getRolistForAssignApi(params) {
  return await http.post('/api/sys_user_role/getRoleListForAssign', params)
}
// 在给其他用户分配角色之前,根据分配者的userID获取角色列表
export async function assignSaveApi(params) {
  return await http.post('/api/sys_user_role/assignRole', params)
}

// 刷新token
export async function refreshTokenApi(token) {
  return await http.post('/api/sys_user/refreshToken', token)
}


