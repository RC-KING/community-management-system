import http from "../utils/request";

//获取社团风采列表
export async function getClubPresenceListApi(params) {
  return await http.post("/api/club_presence/list", params);
}
// 新增社团风采
export async function addClubPresenceApi(param) {
  return await http.post('/api/club_presence', param)
}
// 编辑社团风采
export async function editClubPresenceApi(param) {
  return await http.patch('/api/club_presence', param)
}
// 删除社团风采
export async function deleteClubPresenceApi(params) {
  return await http.delete('/api/club_presence', params)
}


