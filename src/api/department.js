import http from "../utils/request";

//获取部门信息
export async function getDeptListApi() {
  return await http.get("/api/department/getDepartmentList", null);
}