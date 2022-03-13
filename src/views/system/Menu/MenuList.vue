<template>
  <div>
    <!-- 新增菜单弹框 -->
    <sys-dialog :title="addMenuDialog.title" :visible="addMenuDialog.dialogVisible" :width="addMenuDialog.width" :height="addMenuDialog.height" @onClose="addMenuDialogClose" @onConfirm="MenuDialogConfirm">
      <template #content>
        <el-form :model="menuModel" ref="addMenuForm" :rules="menuFormRules" label-width="80px" size="small" inline>
          <el-form-item label="菜单类型" prop="type" style="width:400px">
            <el-radio-group v-model="menuModel.type">
              <el-radio :label="'0'">目录</el-radio>
              <el-radio :label="'1'">菜单</el-radio>
              <el-radio :label="'2'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上级菜单" @click.native="selectParentMenuDialogOpen" prop="parentName">
            <el-input v-model="menuModel.parentName" placeholder="请选择上级菜单"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="label">
            <el-input v-model="menuModel.label"></el-input>
          </el-form-item>
          <el-form-item label="权限字段" prop="code">
            <el-input v-model="menuModel.code"></el-input>
          </el-form-item>
          <el-form-item label="路由地址" prop="path" v-if="menuModel.type!=='2'">
            <el-input v-model="menuModel.path"></el-input>
          </el-form-item>
          <el-form-item label="路由名称" prop="name" v-if="menuModel.type==='1'">
            <el-input v-model="menuModel.name" placeholder="请填写路由名称"></el-input>
          </el-form-item>
          <el-form-item label="组件路径" prop="url" v-if="menuModel.type==='1'">
            <el-input v-model="menuModel.url"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" v-if="menuModel.type!=='2'">
            <el-input v-model="menuModel.icon"></el-input>
          </el-form-item>
          <el-form-item label="权限备注" prop="remark">
            <el-input v-model="menuModel.remark"></el-input>
          </el-form-item>
          <el-form-item label="权限序号" prop="orderNum" style="width:400px">
            <el-input-number v-model="menuModel.orderNum"></el-input-number>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
    <!-- 选择上级菜单弹出框 -->
    <sys-dialog :title="selectParentMenuDialog.title" :visible="selectParentMenuDialog.dialogVisible" :width="selectParentMenuDialog.width" :height="selectParentMenuDialog.height" @onClose="selectParentMenuDialogClose" @onConfirm="selectParentMenuDialogConfirm">
      <template #content>
        <el-tree class="container" ref="parentTree" :expand-on-click-node="false" :data="parentTree" node-key="id" default-expand-all :props="defaultProps" @node-click="handleNodeClick">
          <template slot-scope="{node,data}">
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
    <!-- 主体 -->
    <el-main style=" padding-top :20px;">
      <!-- 上面的搜索框 -->
      <el-form :model="searchForm" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="searchForm.searchName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="danger" icon="el-icon-close">重置</el-button>
          <!-- v-if="$hasPermission('sys:menu:add')" -->
          <el-button type="warning" icon="el-icon-plus" @click="addMenuDialogOpen">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 菜单表格 -->
      <el-table :height="tableHeight" :data="menuList" row-key="id" :tree-props="{children: 'children'}" default-expand-all border stripe>
        <el-table-column prop="label" label="菜单名称" width="160"></el-table-column>
        <el-table-column prop="type" align="center" label="菜单类型" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==='0'" effect="dark" type="danger" size="small">目录</el-tag>
            <el-tag v-if="scope.row.type==='1'" effect="dark" type="info" size="small">菜单</el-tag>
            <el-tag v-if="scope.row.type==='2'" effect="dark" type="" size="small">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="菜单图标" align="center" width="80">
          <template slot-scope="scope">
            <i v-if="scope.row.type!=='2'" :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="路由名称" align="center"></el-table-column>
        <el-table-column prop="url" label="组件路径" align="center"></el-table-column>
        <el-table-column prop="code" label="权限字段" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope='scope'>
            <!-- v-if="$hasPermission('sys:menu:edit')"
v-if="$hasPermission('sys:menu:delete')" -->
            <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="editMenu(scope.row)">编辑</el-button>
            <el-button icon="el-icon-close" type="danger" size="small" @click="deleteMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

  </div>
</template>

<script>
import { getMenuListApi, getParentMenuApi, addMenuApi, editMenuApi, deleteMenuApi } from '../../../api/permission'
import SysDialog from '../../../components/SysDialog.vue'
export default {
  data() {
    return {
      // 菜单列表数据
      menuList: [],
      // 表格高度
      tableHeight: 0,
      // 搜索框
      searchForm: { searchName: '' },
      // 菜单数据模型
      menuModel: {
        id: 17,
        parentId: 0,
        parentName: '顶级菜单',
        label: '系统管理', // 菜单名称
        code: 'sys:manage', // 权限字段,用于权限鉴定
        path: '/system', // 路由地址
        name: 'system', // 路由名称
        url: '/system/system', // 组件地址,用于动态路由生成
        orderNum: 1,
        type: '0', // "0":目录, "1":菜单, "2":按钮
        icon: 'el-icon-menu',
        remark: null,
        optionType: '0' // 0表示新增,1表示修改
      },
      // 新增菜单弹框属性
      addMenuDialog: {
        dialogVisible: false,
        title: '添加菜单',
        width: 590,
        height: 290
      },
      // 新增菜单表单验证规则
      menuFormRules: {
        parentName: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
        label: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入权限字段', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        orderNum: [{ required: true, message: '请输入权限序号', trigger: 'change' }],
        type: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
        icon: [{ required: true, message: '请输入菜单图标', trigger: 'blur' }]
      },
      // 选择上级菜单弹出框属性
      selectParentMenuDialog: {
        dialogVisible: false,
        title: '选择上级菜单',
        width: 300,
        height: 400
      },
      // 上级菜单列表数据
      parentTree: [],
      // el-tree绑定上级部门树列表的属性
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 查询菜单
    async getMenuList() {
      const { data: res } = await getMenuListApi()
      this.menuList = res.data
    },
    // 编辑菜单
    editMenu(row) {
      console.log('本行的数据', row)
      // 清空表单
      this.$resetForm('addMenuForm', this.menuModel)
      // 把当前行的数据复制到
      this.$objCopy(row, this.menuModel)
      // 编辑标志设置为"编辑"
      this.menuModel.optionType = '1'
      // 设置弹出框标题
      this.addMenuDialog.title = '编辑菜单'
      // 打开弹框
      this.addMenuDialog.dialogVisible = true
    },
    // 删除菜单
    async deleteMenu(row) {
      const confirm = await this.$message.confirm('您确定要删除?')
      if (confirm) {
        const { data: res } = await deleteMenuApi({ id: row.id })
        if (res) {
          if (res.code === 200) {
            this.$message.success(res.msg)
            // 刷新数据
            this.getMenuList()
          }
          if (res.code !== 200) this.$message.error(res.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 打开新增菜单对话框
    addMenuDialogOpen() {
      this.$resetForm('addMenuForm', this.menuModel)
      this.addMenuDialog.title = '新增菜单'
      this.menuModel.optionType = '0'
      this.addMenuDialog.dialogVisible = true
    },
    // 关闭新增菜单对话框
    addMenuDialogClose() {
      this.addMenuDialog.dialogVisible = false
    },
    // 确认对话框
    MenuDialogConfirm() {
      this.$refs.addMenuForm.validate(async valid => {
        if (valid) {
          var res = null
          if (this.menuModel.optionType === '0') {
            res = await addMenuApi(this.menuModel)
          } else {
            // 编辑菜单提交
            res = await editMenuApi(this.menuModel)
          }
          if (res) {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.getMenuList()
            }
            if (res.data.code !== 200) this.$message.error(res.data.msg)
          } else {
            this.$message.error('操作失败!')
          }
          this.addMenuDialog.dialogVisible = false
        }
      })
    },
    // 打开选择上级菜单弹框
    async selectParentMenuDialogOpen() {
      var { data: res } = await getParentMenuApi()
      if (res && res.code === 200) {
        this.parentTree = res.data
      }
      this.selectParentMenuDialog.dialogVisible = true
    },
    // 选择上级菜单弹框关闭
    selectParentMenuDialogClose() {
      this.selectParentMenuDialog.dialogVisible = false
    },
    // 选择上级菜单弹框确认
    selectParentMenuDialogConfirm() {
      this.selectParentMenuDialog.dialogVisible = false
    },
    // 上级部门树节点的点击事件处理
    handleNodeClick(data) {
      console.log(data)
      this.menuModel.parentId = data.id
      this.menuModel.parentName = data.label
    },
    // 展开菜单加减号
    openChildrenNodeBtn(data) {
      data.open = !data.open
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 243
      console.log(this.tableHeight)
    })
  },
  components: { SysDialog }
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
