import http from "../utils/request";

//获取常规课列表
export async function getCurriculumListApi(params) {
  return await http.post("/api/curriculum/list", params);
}
// 新增常规课
export async function addCurriculumApi(param) {
  return await http.post('/api/curriculum', param)
}
// 编辑常规课
export async function editCurriculumApi(param) {
  return await http.patch('/api/curriculum', param)
}
// 删除常规课
export async function deleteCurriculumApi(params) {
  return await http.delete('/api/curriculum', params)
}


