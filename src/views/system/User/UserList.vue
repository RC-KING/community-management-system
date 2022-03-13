<template>
  <div>
    <!-- 用户弹框 -->
    <sys-dialog :title="userDialog.title" :visible="userDialog.dialogVisible" :width="userDialog.width" :height="userDialog.height" @onClose="userDialogClose" @onConfirm="userDialogConfirm">
      <template #content>
        <!-- 用户表单 -->
        <el-form :model="userModel" ref="userForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item prop="deptName" label="部门名称">
            <el-input @click.native="openDeptDialog" placeholder="请选择部门" v-model="userModel.deptName"></el-input>
          </el-form-item>
          <el-form-item prop="username" label="登录名">
            <el-input placeholder="请填写姓名" v-model="userModel.username"></el-input>
          </el-form-item>
          <el-form-item prop="mobilePhone" label="电话">
            <el-input placeholder="请填写电话" v-model="userModel.mobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input placeholder="请填写邮箱" v-model="userModel.email"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请填写登录密码" :disabled="isDisabledPassword" v-model="userModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="userModel.gender">
              <el-radio label="M">男</el-radio>
              <el-radio label="F">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
    <!-- 选择部门弹框 -->
    <sys-dialog :title="deptDialog.title" :height="deptDialog.height" :width="deptDialog.width" :visible="deptDialog.visible" @onClose="deptDialogClose" @onConfirm="deptDialogConfirm">
      <div slot="content">
        <el-tree ref="deptTree" :data="deptList" node-key="id" :props="{children:'children', label: 'name' }" default-expand-all :show-checkbox="false" :highlight-current="true" :expand-on-click-node="false" @node-click="selectDeptTreeNode">
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <div>
              <!-- 如果没有下级，就是最好一层 -->
              <span v-if="data.children.length == 0">
                <i style="margin-right: 3px" class="el-icon-document" />
              </span>
              <!-- 有下级，需要判断是展开还是关闭 -->
              <span v-else @click.stop="openParentBtn(data)">
                <i v-if="data.open" style="margin-right: 3px" class="iconfont icon-jia" />
                <i v-else style="margin-right: 3px" class="iconfont icon-jian" />
              </span>
              <!-- 树节点的名称 -->
              <span>{{ node.label }}</span>
            </div>
          </div>
        </el-tree>
      </div>
    </sys-dialog>
    <!-- 分配角色弹框 -->
    <sys-dialog :title="assignRoleDialog.title" :height="assignRoleDialog.height" :width="assignRoleDialog.width" :visible="assignRoleDialog.visible" @onClose="assignRoleDialogClose" @onConfirm="assignRoleDialogConfirm">
      <div slot="content">
        <el-table :data="assignList" border stripe :height="assignRoleDialog.height-30">
          <el-table-column label="选择" width="50px" align="center">
            <template slot-scope="scope">
              <el-radio v-model="assignRadio" :label="scope.row.id" @change="getCurrentRow(scope.row)">{{ }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="角色备注" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="assignPaginationSizeChange" @current-change="assignPaginationCurrentChange" :current-page="assignRoleParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="assignRoleParams.pageSize" :total="assignRoleParams.total" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </sys-dialog>
    <el-container :style="{height:containerHeight+'px'}">
      <!-- 左侧部门树 -->
      <el-aside width="200px" style="background:#fff;border-right:1px solid #dfe6ec;border-top:1px solid #dfe6ec;padding:10px 0px 0px 0px;">
        <el-tree ref="leftTree" style="font-size:14px" :data="deptList" node-key="id" :props="{children: 'children', label: 'name'}" :expand-on-click-node='false' default-expand-all highlight-current @node-click="nodeClick">
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <div>
              <!-- 如果没有下级，就是最好一层 -->
              <span v-if="data.children.length == 0">
                <i style="margin-right: 3px" class="el-icon-document" />
              </span>
              <!-- 有下级，需要判断是展开还是关闭 -->
              <span v-else @click.stop="openBtn(data)">
                <i v-if="data.open" style="margin-right: 3px" class="el-icon-circle-plus-outline" />
                <i v-else style="margin-right: 3px" class="el-icon-remove-outline" />
              </span>
              <!-- 树节点的名称 -->
              <span>{{ node.label }}</span>
            </div>
          </div>
        </el-tree>
      </el-aside>
      <!-- 右侧用户列表 -->
      <el-main>
        <!-- 上面的搜索框 -->
        <el-form :model="searchForm" label-width="80px" :inline="true" size="small">
          <el-form-item>
            <el-input v-model="searchForm.name" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- //TODO:待实现 -->
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <el-button type="danger" icon="el-icon-close">重置</el-button>
            <el-button type="warning" icon="el-icon-plus" @click="addDialogOpen">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 用户列表 -->
        <el-table :height="tableHeight" :data="userList" border stripe>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="gender" label="性别" width="49"></el-table-column>
          <el-table-column prop="deptName" label="所属部门"></el-table-column>
          <el-table-column prop="majorName" label="所属专业"></el-table-column>
          <el-table-column prop="clubName " label="所属社团"></el-table-column>
          <el-table-column prop="mobilePhone" width="113" label="电话"></el-table-column>
          <el-table-column prop="presentAddress" label="居住地址"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" width="290" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="editDialogOpen(scope.row)">编辑</el-button>
              <el-button type="primary" icon="el-icon-setting" size="small" @click="assignUser(scope.row)">分配角色</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { getDeptListApi } from '../../../api/department'
import { assignSaveApi, getUserListApi, deleteUserByUserId, addUserApi, editUserApi, getRoleIdByUserIdApi, getRolistForAssignApi } from '../../../api/user'
import SysDialog from '../../../components/SysDialog.vue'
import { getUserId } from '../../../utils/auth'
export default {
  data() {
    return {
      // 角色分配参数
      assignParams: {
        roleId: '',
        userId: ''
      },
      // 角色表格单选按钮数据
      assignRadio: '',
      // 权限分配列表
      assignList: [],
      // 分配角色列表分页参数
      assignRoleParams: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        userId: ''
      },
      // 表单验证规则
      rules: {
        deptName: [
          {
            required: true,
            trigger: 'change',
            message: '请选择部门'
          }
        ],
        mobilePhone: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写电话'
          }
        ],
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写登录名'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写登录密码'
          }
        ],
        gender: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择性别'
          }
        ]
      },
      // 用户数据域
      userModel: {
        id: '',
        deptId: 43, // 部门id
        deptName: '会员部门',
        email: '',
        optionType: '', // 0 新增 1编辑
        mobilePhone: '',
        username: '',
        password: '',
        gender: ''
      },
      // 用户弹框属性
      userDialog: {
        dialogVisible: false,
        title: '添加菜单',
        width: 590,
        height: 290
      },
      // 部门弹框
      deptDialog: {
        title: '选择所属部门',
        height: 450,
        width: 300,
        visible: false
      },
      // 分配角色弹框
      assignRoleDialog: {
        title: '分配角色',
        height: 320,
        width: 590,
        visible: false
      },
      // 搜素框
      searchForm: { name: '' },
      // 用户列表
      userList: [],
      // 获取用户列表参数
      deptId: '',
      currentPage: 1,
      pageSize: 10,
      // 总页数
      total: 0,
      // 左侧树组件的容器高度
      containerHeight: 0,
      // 用户列表高度
      tableHeight: 0,
      // 部门树数据
      deptList: [],
      isDisabledPassword: false
    }
  },
  methods: {
    // 权限分配弹框分页------分页大小改变
    assignPaginationSizeChange(val) {
      this.assignRoleParams.pageSize = val
      this.assignRoleParams.currentPage = 1
      this.getAssignRoleList(this.assignRoleParams)
    },
    // 权限分配弹框分页------页面改变
    assignPaginationCurrentChange(val) {
      this.assignRoleParams.currentPage = val
      this.getAssignRoleList(this.assignRoleParams)
    },
    // 表格单选按钮选中事件
    getCurrentRow(row) {
      console.log(row)
      this.assignParams.roleId = row.id
      console.log('this.assignParams', this.assignParams)
    },
    // 分配角色弹框打开
    async assignUser(row) {
      console.log(row)
      this.assignRadio = ''
      this.assignRoleDialog.title = `为【${row.username}】分配角色`
      // 获取用户id
      this.assignRoleParams.userId = getUserId()
      this.assignParams.userId = row.id
      // 查询所有角色
      this.getAssignRoleList(this.assignRoleParams)
      // 查询该用户拥有的角色
      const { data: res } = await getRoleIdByUserIdApi({ userId: row.id })
      console.log('查询该用户拥有的角色', res)
      if (res && res.code === 200) {
        if (res.data) {
          // 回显单选框数据
          this.assignRadio = res.data.roleId
          this.assignParams.roleId = res.data.roleId
        } else {
          // data为null
          this.assignRadio = ''
          this.$message.warning('该用户未分配角色!')
        }
        this.assignRoleDialog.visible = true
      }
    },
    // 获取角色列表
    async getAssignRoleList(parm) {
      const param = {
        currentPage: parm.currentPage,
        pageSize: parm.pageSize,
        userId: parm.userId
      }
      const { data: res } = await getRolistForAssignApi(param)
      console.log(res)
      if (res.code === 200) {
        this.assignList = res.data.records
        this.assignRoleParams.total = res.data.total
        console.log(this.assignRoleParams)
      }
    },
    // 分配角色弹框关闭
    assignRoleDialogClose() {
      this.assignRoleDialog.visible = false
    },
    // 分配角色弹框确认
    async assignRoleDialogConfirm() {
      if (!this.assignParams.roleId) {
        this.assignRoleDialog.visible = false
        // 如果角色id不存在,则需要提示给用户分配角色
        this.$message.warning('请分配角色!')
        return
      }
      console.log(this.assignParams)
      // TODO: 理论上角色分配操作需要表明角色的分配者id,但是这里却没有记录进去
      // TODO: 这里设计的用户和角色是多对一的关系,一个用户只能拥有一个角色,一个角色能够被多个用户使用
      const { data: res } = await assignSaveApi(this.assignParams)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
      }
    },
    // 删除用户
    async deleteUser(row) {
      const { data: res } = await deleteUserByUserId({ id: row.id })
      if (res && res.code === 200) {
        this.$message.success('删除成功!')
      }
      this.getUserList()
    },
    // 选择所属部门
    selectDeptTreeNode(data) {
      this.userModel.deptId = data.id || 43
      this.userModel.deptName = data.name || '会员部门'
    },
    // 部门弹框打开
    openDeptDialog() {
      this.deptDialog.visible = true
    },
    // 部门弹框关闭
    deptDialogClose() {
      this.deptDialog.visible = false
    },
    // 部门弹框确认
    deptDialogConfirm() {
      this.deptDialog.visible = false
    },
    editDialogOpen(row) {
      // 清空表单
      this.$resetForm('userForm', this.userModel)
      // 把当前行的数据复制到
      this.$objCopy(row, this.userModel)
      // 编辑标志设置为"编辑"
      this.userModel.optionType = '1'
      // 设置弹出框标题
      this.userDialog.title = '编辑用户'
      // 打开弹框
      this.userDialog.dialogVisible = true
      // 禁用密码输入
      this.isDisabledPassword = true
    },
    // 打开新增用户对话框
    addDialogOpen() {
      this.$resetForm('userForm', this.userModel)
      this.userDialog.title = '新增用户'
      this.userModel.optionType = '0'
      this.userDialog.dialogVisible = true
      this.isDisabledPassword = false
    },
    // 关闭新增用户对话框
    userDialogClose() {
      this.userDialog.dialogVisible = false
    },
    // 确认用户对话框
    userDialogConfirm() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          var res = null
          if (this.userModel.optionType === '0') {
            res = await addUserApi(this.userModel)
          } else {
            // 编辑菜单提交
            res = await editUserApi(this.userModel)
          }
          if (res) {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getUserList()
            }
            if (res.data.code !== 200) this.$message.error(res.data.msg)
          } else {
            this.$message.error('操作失败!')
          }
          this.userDialog.dialogVisible = false
        }
      })
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUserList()
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    // 获取用户列表
    async getUserList() {
      const params = {
        deptId: this.deptId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      const { data: res } = await getUserListApi(params)
      if (res && res.code === 200) {
        this.userList = res.data.records
        this.total = res.data.total
      }
    },
    // 获取部门树
    async getDeptList() {
      const { data: res } = await getDeptListApi()
      if (res && res.code === 200) {
        this.deptList = res.data
        this.$nextTick(() => {
          // 设置默认选中的树节点
          this.$refs.leftTree.setCurrentKey(this.deptList[0].id)
          this.deptId = this.deptList[0].id
          this.getUserList()
        })
      }
    },
    // 左侧部门树节点单击事件
    nodeClick(data) {
      this.deptId = data.id
      this.getUserList()
    },
    // 加减号图标点击事件
    openBtn(data) {
      console.log(data)
      data.open = !data.open
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open
    },

    // 编辑按钮
    editUser() {}
  },
  created() {
    this.getDeptList()
  },
  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 152
      this.tableHeight = window.innerHeight - 276
    })
  },
  components: { SysDialog }
}
</script>

<style lang="less" scoped>
.el-aside ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
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
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
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
.el-aside ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
.el-dialog__wrapper ::v-deep .el-tree {
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
.el-dialog__wrapper ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
