import http from "../utils/request";

//获取权限信息
export async function getOperatorPermissionInfoApi() {
  return await http.get("/api/sys_permission/getOperatorPermissionInfo", null);
}
// 获取菜单列表
export async function getMenuListApi() {
  return await http.get('/api/sys_permission/getPermissionTree')
}
// 获取上级菜单
export async function getParentMenuApi() {
  return await http.get('/api/sys_permission/getParentPermissionTree')
}
// 新增权限
export async function addMenuApi(params) {
  return await http.post('/api/sys_permission', params)
}
// 编辑权限
export async function editMenuApi(params) {
  return await http.patch('/api/sys_permission', params)
}
// 删除权限
export async function deleteMenuApi(params) {
  return await http.delete('/api/sys_permission', params)
}
