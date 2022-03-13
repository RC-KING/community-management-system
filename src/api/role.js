import http from '../utils/request'
// 获取角色列表
//TODO:根据用户Id来查询
export async function getRoleListApi(params) {
  return await http.post('/api/sys_role/list', params)
}
// 新增权限
export async function addRoleApi(params) {
  return await http.post('/api/sys_role', params)
}
// 编辑权限
export async function editRoleApi(params) {
  return await http.patch('/api/sys_role', params)
}
// 删除权限
export async function deleteRoleApi(params) {
  return await http.delete('/api/sys_role', params)
}
// 给角色分配资源之前获取的树形"资源数据"(参数:用户id,角色id)
export async function getAssignPermissionTree(params) {
  return await http.post("/api/sys_role_permission/getAssignPermissionTree", params);
}

// 分配权限保存(参数:角色id,权限列表)
export async function roleAssignSave(params) {
  return await http.post('/api/sys_role_permission/roleAssignSave', params)
}
