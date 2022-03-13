import http from "../utils/request";

//获取部门信息
export async function getDeptListApi() {
  return await http.get("/api/department/getDepartmentList", null);
}
// 获取上级部门树数据(获取带有顶级部门的部门树)
export async function getParentDeptTreeApi() {
  return await http.get('/api/department/getParentTree', null)
}
// 新增部门
export async function addDeptSaveApi(param) {
  return await http.post('/api/department', param)
}
// 编辑部门
export async function editDeptSaveApi(param) {
  return await http.patch('/api/department', param)
}
// 删除部门
export async function deleteDeptApi(params) {
  return await http.delete('/api/department', params)
}
