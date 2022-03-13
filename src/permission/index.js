// 按钮权限判断工具
export default function hasPermission(params) {
  let hasTag = false
  const authList = JSON.parse(sessionStorage.getItem('authList'))
  for (let i = 0; i < authList.length; i++) {
    // 每一项与权限比对
    if (authList[i] === params) {
      hasTag = true
      break
    }
  }
  // 将标志返回出去
  return hasTag
}
