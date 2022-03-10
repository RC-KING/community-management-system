// 快速复制工具
// 把obj1中的数据快速复制一份到obj2中
export default function objCopy(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    obj2[key] = obj1[key]
  })
}
