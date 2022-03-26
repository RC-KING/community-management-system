import http from "../utils/request";

//获取通知列表
export async function getNoticeListApi(params) {
  return await http.post("/api/notice/list", params);
}
// 新增通知
export async function addNoticeApi(param) {
  return await http.post('/api/notice', param)
}
// 编辑通知
export async function editNoticeApi(param) {
  return await http.patch('/api/notice', param)
}
// 删除通知
export async function deleteNoticeApi(params) {
  return await http.delete('/api/notice', params)
}


