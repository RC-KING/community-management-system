// 对菜单权限列表进行判断,是否是末级菜单
// 若是不是叶子节点, 则将该节点的open属性设置为false
// 若是叶子节点, 则将该节点的open属性设置为true
export function setTreeNodeOpen() {
  const setLeaf = (arr) => {
    if (arr && arr.length > 0) {
      // 对其中的所有元素进行遍历
      for (let index = 0; index < arr.length; index++) {
        // 如果长度大于0,说明还有下级,就不是叶子节点
        if (arr[index].children && arr[index].children.length > 0) {
          arr[index].open = false
          // 递归调用
          setLeaf(arr[index].children)
        } else {
          // 是叶子节点,就将open属性设置为true
          arr[index].open = true
        }
      }
    }
    return arr
  }
  return {
    setLeaf
  }
}

// 生成LikeId
let nodes = []
function getParentNodes(id, tree) {
  _getParentNodes([], id, tree)
  return nodes
}
function _getParentNodes(his, targetId, tree) {
  tree.some((list) => {
    const children = list.children || []
    if (list.id === targetId) {
      nodes = his
      return true
    } else if (children.length > 0) {
      const history = [...his]
      history.push(list)
      return _getParentNodes(history, targetId, children)
    }
  })
}
export function generateLikeId(id, tree) {
  getParentNodes(id, tree)
  return [...nodes.map(item => item.id), id]
}

// 树查找元素
export function treeFind(tree, func) {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}
