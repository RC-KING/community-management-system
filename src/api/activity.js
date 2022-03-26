import http from "../utils/request";

//获取活动列表
export async function getActivityListApi(params) {
  return await http.post("/api/activity/list", params);
}
// 新增活动
export async function addActivityApi(param) {
  return await http.post('/api/activity', param)
}
// 编辑活动
export async function editActivityApi(param) {
  return await http.patch('/api/activity', param)
}
// 删除活动
export async function deleteActivityApi(params) {
  return await http.delete('/api/activity', params)
}


