import http from "../utils/request";

//获取班级列表
export async function getClassListApi(params) {
  return await http.post("/api/class/list", params);
}
// 新增班级
export async function addClassApi(param) {
  return await http.post('/api/class', param)
}
// 编辑班级
export async function editClassApi(param) {
  return await http.patch('/api/class', param)
}
// 删除班级
export async function deleteClassApi(params) {
  return await http.delete('/api/class', params)
}


