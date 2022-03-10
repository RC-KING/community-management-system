// 重置表单数据
export default function resetForm(formName, modelData) {
  // 清空表单
  // 若存在表单
  // formName: 表单名(需添加进入$refs)
  if (this.$refs[formName]) {
    this.$refs[formName].resetFields()
  }
  // 清空数据
  // modelData: data中的表单数据
  // 如:
  // dept数据模型
  // deptModel: {
  //   editType: 0, // 0表示新增,1表示编辑
  //   id: '',
  //   pid: 0,
  //   parentName: '',
  //   manager: '',
  //   deptAddress: '',
  //   deptPhone: '',
  //   name: '',
  //   deptCode: '',
  //   orderNum: 0
  // },
  Object.keys(modelData).forEach(item => {
    modelData[item] = ''
  })
}
