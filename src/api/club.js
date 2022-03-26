import http from "../utils/request";

//获取部门列表
export async function getClubListApi(params) {
  return await http.post("/api/club/list", params);
}
// 新增部门
export async function addClubApi(param) {
  return await http.post('/api/club', param)
}
// 编辑部门
export async function editClubApi(param) {
  return await http.patch('/api/club', param)
}
// 删除部门
export async function deleteClubApi(params) {
  return await http.delete('/api/club', params)
}


