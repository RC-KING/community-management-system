<template>
  <div>
    <!-- 新增角色弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>
        <el-form :model="roleModel" ref="addRoleForm" :rules="roleFormRules" label-width="80px" size="small" inline>
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="角色备注" prop="remark">
            <el-input v-model="roleModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
    <!-- 分配权限弹出框 -->
    <sys-dialog :title="grantDialog.title" :visible="grantDialog.dialogVisible" :width="grantDialog.width" :height="grantDialog.height" @onClose="grantDialogClose" @onConfirm="grantDialogConfirm">
      <template #content>
        <!-- 权限选择树 -->
        <el-tree ref="grantTree" :data="grantTree" node-key="id" :props="defaultProps" empty-text="暂无数据" :show-checkbox="true" :highlight-current="true" default-expand-all @node-click="handleNodeClick"></el-tree>
      </template>
    </sys-dialog>
    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchRole">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:role:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 角色列表 -->
      <el-table :height="tableHeight" :data="roleList" border stripe>
        <el-table-column prop="name" label="角色姓名"></el-table-column>
        <el-table-column prop="remark" label="角色备注"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!--  v-if="$hasPermission('sys:role:assign')"
                  v-if="$hasPermission('sys:role:edit')"
                  v-if="$hasPermission('sys:role:delete')"  //TODO: 最后添加到下面的按钮上-->
            <el-button icon="el-icon-setting" type="info" size="small" @click="openGrantDialog(scope.row)">分配权限</el-button>
            <el-button icon="el-icon-edit" type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="paginationParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationParams.total">
      </el-pagination>
    </el-main>
  </div>

</template>

<script>
// TODO:Cookie中获取角色ID import { getUserId } from '../../../utils/auth'
// import { getRoleListApi, addRoleApi, editRoleApi, deleteRoleApi, getGrantTreeApi, grantTreeApi } from '../../../api/role'
import SysDialog from '../../../components/SysDialog.vue'
import { getRoleListApi, deleteRoleApi, addRoleApi, editRoleApi, getAssignPermissionTree, roleAssignSave } from '../../../api/role'

import { setTreeNodeOpen } from '../../../utils/treeUtils'
export default {
  data() {
    return {
      // 选中的节点列表
      checkList: [],
      // el-tree绑定上级部门树列表的属性
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 权限树列表
      grantTree: [],
      // 角色ID
      roleId: '',
      // 分配权限弹框属性
      grantDialog: {
        dialogVisible: false,
        title: '分配权限',
        width: 260,
        height: 400
      },
      // 角色列表
      roleList: [],
      // 角色分页查询数据域
      paginationParams: {
        name: '',
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数容量
        total: 0, // 数据总条数
        userId: '11' // 用户Id TODO:这里写死了,需要从Cookis中获取
      },
      // 表格高度
      tableHeight: 0,
      // 表格属性
      addDialog: {
        dialogVisible: false,
        title: '新增部门',
        width: 610,
        height: 200
      },
      // 角色数据域
      roleModel: {
        id: '',
        editType: '', // 0 ：新增 1：编辑
        name: '',
        remark: '',
        createUserId: '11' // 当前登录用户id TODO:这里写死了,需要从Cookis中获取
      },
      // 添加角色表单验证
      roleFormRules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入角色备注', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 分配权限弹出框确认
    async grantDialogConfirm() {
      const checkList = this.$refs.grantTree.getCheckedKeys()
      const halfCheckList = this.$refs.grantTree.getHalfCheckedKeys()
      const ids = halfCheckList.concat(checkList)
      if (ids.length === 0) {
        this.$message.warning('至少勾选一个权限!')
        return
      }
      const { data: res } = await roleAssignSave({ roleId: this.roleId, permissionIdList: ids })
      console.log(res)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
      }
      this.grantDialog.dialogVisible = false
    },

    // 分配权限弹出框关闭
    grantDialogClose() {
      this.grantDialog.dialogVisible = false
    },
    // 获取角色列表
    async getRoleList() {
      this.roleModel.createUser = '11' //TODO:这里写死了
      this.paginationParams.userId = '11' //TODO:这里写死了
      const { data: res } = await getRoleListApi(this.paginationParams)
      if (res && res.code === 200) {
        this.roleList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除角色
    async deleteRole(row) {
      const confirm = await this.$message.confirm('您确认要删除该角色吗?')
      if (confirm) {
        const res = await deleteRoleApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getRoleList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑角色打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addRoleForm', this.roleModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.roleModel)
      this.roleModel.editType = '1'
      this.addDialog.title = '编辑角色'
      this.addDialog.dialogVisible = true
    },
    // 新增角色打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addRoleForm', this.roleModel)
      this.roleModel.editType = '0'
      this.addDialog.title = '添加角色'
      this.addDialog.dialogVisible = true
    },
    // 打开分配权限弹出框
    async openGrantDialog(row) {
      // 首先将选中的角色ID传入
      this.roleId = row.id
      const parmas = {
        // 用户的id
        userId: this.roleModel.createUserId,
        // 角色id
        roleId: row.id
      }
      // 获取该用户在某一角色上的权限集合
      const { data: res } = await getAssignPermissionTree(parmas)
      if (res && res.code === 200) {
        // 当前用户拥有的角色的拥有的权限(只显示拥有的权限)
        // 当前用户只能给下级用户分配自己拥有的权限
        const checkList = res.data.checkList
        console.log(checkList)
        // 所有权限列表
        const listmenu = res.data.listmenu
        // 处理权限列表的open属性
        var { setLeaf } = setTreeNodeOpen()
        var newMenuList = setLeaf(listmenu)
        this.grantTree = newMenuList

        // 等待Dom元素更新或者加载完成之后,才进行下一步的函数
        // 等树结构全部渲染完成之后,我们才进行选择框的设置
        this.$nextTick(() => {
          // 设置选中的节点为勾选状态
          this.setNodeShow(newMenuList, checkList)
        })
      }
      this.grantDialog.title = `为${row.name}分配权限`
      this.grantDialog.dialogVisible = true
    },
    // 分配权限树前的勾选框回显
    setNodeShow(menuList, checkList) {
      // 如果权限节点菜单存在且长度不为0
      if (menuList && menuList.length > 0) {
        // 对权限节点菜单进行循环
        for (let i = 0; i < menuList.length; i++) {
          // 根据 data 拿到 Tree 组件中的 node
          // node是Tree组件能够更好的操作节点的数据
          // node 这个数据始终和外层循环的 menuList[i] 是动态绑定一起的
          const node = this.$refs.grantTree.getNode(menuList[i])
          // 选中的节点列表存在,且有数据
          if (checkList && checkList.length > 0) {
            // 对选中的节点列表进行循环
            for (let j = 0; j < checkList.length; j++) {
              // 如果选中状态列表的id和menuList中的id相同
              if (checkList[j] === menuList[i].id) {
                // 如果是叶子节点,才去设置他的选中与否,叶子节点可以决定全部的选中状态
                // 不需要设置非叶子节点
                if (menuList[i].open) {
                  // 设置该节点的node的 Checked 为true
                  this.$refs.grantTree.setChecked(node, true)
                  // 跳出循环 选中状态列表,进行下一个节点的判断
                  break
                }
              }
            }
          }
          // 判断是否存在子节点,如果有则同样处理
          if (menuList[i].children.length > 0) {
            // 递归调用该方法
            this.setNodeShow(menuList[i].children, checkList)
          }
        }
      }
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getRoleList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getRoleList(this.paginationParams)
    },
    // 查询角色
    searchRole() {
      this.paginationParams.currentPage = 1
      this.getRoleList(this.paginationParams)
    },
    // 重置角色搜索框
    resetSearchFrom() {
      this.paginationParams.name = ''
      this.paginationParams.currentPage = 1
      this.getRoleList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.roleModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该角色吗?' : '您确认要修改该角色吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addRoleForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addRoleApi(this.roleModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editRoleApi(this.roleModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getRoleList()
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
    }
  },
  components: {
    SysDialog
  },
  created() {
    this.getRoleList()
  },
  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 176
      this.tableHeight = window.innerHeight - 300
    })
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__body {
  overflow-x: initial;
  overflow-y: auto;
}
</style>
