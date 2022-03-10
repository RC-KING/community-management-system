import { Message, MessageBox } from 'element-ui'

var MessageUtils = {
  success(text = '操作成功!') {
    Message({
      message: text,
      type: 'success',
      duration: 3000
    })
  },
  error(text = '操作失败!') {
    Message({
      message: text,
      type: 'error',
      duration: 3000
    })
  },
  info(text = '您有一条消息!') {
    Message({
      message: text,
      type: 'info',
      duration: 3000
    })
  },
  warning(text = '警告!') {
    Message({
      message: text,
      type: 'warning',
      duration: 3000
    })
  },

  // 确认提示框
  confirm(text = '') {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(text, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resolve(true)
      }).catch(() => {
        Message.warning('已取消')
        reject()
      })
    })
  }
}

export default MessageUtils
