<template>
  <div>
    <!-- 新增部门弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>
        <el-form :model="deptModel" ref="addDeptForm" :rules="deptFormRules" label-width="80px" size="small" inline>
          <el-form-item @click.native="selectParentDeptDialogOpen" label="上级部门" prop="parentName">
            <el-input v-model="deptModel.parentName"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="deptModel.name"></el-input>
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input v-model="deptModel.code"></el-input>
          </el-form-item>
          <el-form-item label="部门电话" prop="phone">
            <el-input v-model="deptModel.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门经理" prop="manager">
            <el-input v-model="deptModel.manager"></el-input>
          </el-form-item>
          <el-form-item label="部门地址" prop="address">
            <el-input v-model="deptModel.address"></el-input>
          </el-form-item>
          <el-form-item label="部门序号" prop="orderNum">
            <el-input v-model="deptModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
    <!-- 选择上级部门弹出框 -->
    <sys-dialog :title="selectParentDeptDialog.title" :visible="selectParentDeptDialog.dialogVisible" :width="selectParentDeptDialog.width" :height="selectParentDeptDialog.height" @onClose="selectParentDeptDialogClose" @onConfirm="selectParentDeptDialogConfirm">
      <template #content>
        <el-tree class="container" ref="parentTree" :expand-on-click-node="false" :data="parentTree" node-key="id" :props="defaultProps" @node-click="handleNodeClick">
          <template class="customer-tree-node" slot-scope="{node,data}">
            <div>
              <!-- 若节点没有下级菜单,就显示文件图标 -->
              <span v-if="data.children.length===0">
                <i class="el-icon-document"></i>
              </span>
              <!-- 若节点还有下级菜单,则需要展示展开图标和收缩图标 -->
              <span v-else @click="openChildrenNodeBtn(data)">
                <!-- 是展开图标还是关闭图标 -->
                <!-- 若该节点是打开状态 -->
                <i v-if="data.open" class="el-icon-remove-outline"></i>
                <!-- 若该节点是关闭状态 -->
                <i v-else class="el-icon-circle-plus-outline"></i>
              </span>
              <!-- 树节点的名称 -->
              <span>{{node.label}}</span>
            </div>
          </template>
        </el-tree>
      </template>
    </sys-dialog>
    <!-- 主体区域 -->
    <el-main style="padding-top :20px;">
      <!-- 上面的搜索框 -->
      <el-form :model="searchForm" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="searchForm.searchName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="danger" icon="el-icon-close">重置</el-button>
          <el-button type="warning" icon="el-icon-plus" @click="addDialogOpen" v-if="$hasPermission('sys:department:add')">新增</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :height="tableHeight+'px'" :data="deptList" border stripe row-key="id" :tree-props="{children: 'children'}" default-expand-all>
        <!-- prop要和数据库表的名字一致 -->
        <el-table-column prop="name" label="部门名称"></el-table-column>
        <el-table-column prop="code" label="部门编码"></el-table-column>
        <el-table-column prop="address" label="部门地址"></el-table-column>
        <el-table-column prop="phone" label="部门电话"></el-table-column>
        <el-table-column prop="orderNum" label="序号"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope='scope'>
            <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="editHandler(scope.row)" v-if="$hasPermission('sys:department:edit')">编辑</el-button>
            <el-button icon="el-icon-close" type="danger" size="small" @click="deleteHandler(scope.row)" v-if="$hasPermission('sys:department:delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import { getDeptListApi, getParentDeptTreeApi, addDeptSaveApi, editDeptSaveApi, deleteDeptApi } from '../../../api/department'
import SysDialog from '../../../components/SysDialog.vue'
import { generateLikeId, treeFind } from '../../../utils/treeUtils'

export default {
  created() {
    this.getDeptList()
  },
  data() {
    return {
      // 表格的最大高度
      tableHeight: 0,
      deptList: [],
      // 搜索框
      searchForm: { searchName: '' },
      // 新增弹出框属性
      addDialog: {
        dialogVisible: false,
        title: '新增部门',
        width: 610,
        height: 200
      },
      // 选择上级部门弹出框属性
      selectParentDeptDialog: {
        dialogVisible: false,
        title: '选择上级部门',
        width: 280,
        height: 400
      },
      // dept数据模型
      deptModel: {
        editType: 0, // 0表示新增,1表示编辑
        id: '',
        parentId: 0,
        parentName: '',
        manager: '',
        address: '',
        phone: '',
        name: '',
        code: '',
        likeId: '',
        orderNum: 0
      },
      // 表单验证规则
      deptFormRules: {
        parentName: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      // 上级部门树列表
      parentTree: [],
      // el-tree绑定上级部门树列表的属性
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    async getDeptList() {
      const { data: res } = await getDeptListApi()
      this.deptList = res.data
    },
    // Table行操作---编辑
    editHandler(row) {
      // 清空数据
      this.$resetForm('editDeptForm', this.deptModel)
      // 数据回显(把要编辑的数据复制到表单数据域)
      this.$objCopy(row, this.deptModel)
      // 设置弹框显示
      this.deptModel.editType = '1' // 表示编辑
      // 复用新增部门弹框
      this.addDialog.title = '编辑部门'
      this.addDialog.dialogVisible = true
    },
    // Table行操作---删除
    async deleteHandler(row) {
      const confirm = await this.$message.confirm('您确定要删除这条数据吗?')
      if (confirm) {
        console.log(row.id)
        const obj = { id: row.id }
        const { data: res } = await deleteDeptApi(obj)
        if (res) {
          if (res.code === 200) {
            console.log('删除成功')
            this.$message.success(res.msg)
            this.getDeptList()
          }
          if (res.code !== 200) this.$message.error(res.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 打开新增部门对话框
    addDialogOpen() {
      this.$resetForm('addDeptForm', this.deptModel)
      this.deptModel.editType = '0'
      this.addDialog.dialogVisible = true
    },
    // 关闭新增部门对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认 新增部门 / 修改部门
    async addDialogConfirm() {
      const optionType = this.deptModel.editType
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该部门吗?' : '您确认要修改该部门吗')
      if (confirm) {
        // 表单验证
        this.$refs.addDeptForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加部门操作
              res = await addDeptSaveApi(this.deptModel)
            } else if (optionType === '1') {
              // 编辑部门操作
              res = await editDeptSaveApi(this.deptModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                await this.getDeptList()
                await this.$nextTick()
                // 当是新增操作的时候,id是数据库自动生成的,需要手动获取
                if (optionType === '0') {
                  // 通过 部门编码 进行获取 部门id
                  const findRes = treeFind(this.deptList, data => data.code === this.deptModel.code)
                  if (findRes) {
                    this.deptModel.id = findRes.id
                  } else {
                    console.log('树查找失败,无元素返回')
                  }
                }

                // 生成likeId
                const likeId = generateLikeId(this.deptModel.id, this.deptList)
                this.deptModel.likeId = '0,' + likeId.toString()
                console.log(this.deptModel)
                const { data: res1 } = await editDeptSaveApi(this.deptModel)
                if (res1.code !== 200) console.log('likeID保存失败')
              }
              if (res.data.code !== 200) this.$message.error(res.data.msg)
            } else {
              this.$message.error('操作失败!')
            }
            this.addDialog.dialogVisible = false
          } else {
            this.$message.warning('请正确填写表单!')
          }
        })
      }
    },
    // 打开选择上级部门对话框
    async selectParentDeptDialogOpen() {
      const { data: res } = await getParentDeptTreeApi()
      if (res && res.code === 200) {
        this.parentTree = res.data
      }
      this.selectParentDeptDialog.dialogVisible = true
    },
    // 关闭选择上级部门对话框
    selectParentDeptDialogClose() {
      this.selectParentDeptDialog.dialogVisible = false
    },
    // 确认选择上级部门对话框
    async selectParentDeptDialogConfirm() {
      this.selectParentDeptDialog.dialogVisible = false
    },
    // 上级部门树节点的点击事件处理
    handleNodeClick(data) {
      this.deptModel.parentId = data.id
      this.deptModel.parentName = data.name
    },
    // 展开菜单加减号
    openChildrenNodeBtn(data) {
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
      data.open = !data.open
    }
  },
  components: {
    SysDialog
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 243
    })
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__body {
  overflow-x: initial;
  overflow-y: auto;
}

// /////////////////////////////////////////////////////////////////////////////
::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
