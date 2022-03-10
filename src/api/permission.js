import http from "../utils/request";

//获取权限信息
export async function getOperatorPermissionInfoApi() {
  return await http.get("/api/sys_permission/getOperatorPermissionInfo", null);
}