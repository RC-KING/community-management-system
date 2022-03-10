<template>
  <div>
    <!-- 用户弹框
      title:弹出框标题
      visible:控制弹出框的显示和影藏
      width:弹出框的宽度,不需要带上px
      before-close：弹出框右上角关闭事件
      close-on-click-modal:防止点击弹出框以外的区域造成弹出框关闭 
    -->
    <sys-dialog :title="userDialog.title" :visible="userDialog.visible" :width="userDialog.width" @onClose="userDialogClose" @onConfirm="userDialogConfirm">

    </sys-dialog>
    <!-- 选择部门弹框 -->
    <!-- 分配角色弹框 -->
    <el-container :style="{height:containerHeight+'px'}">
      <!-- 左侧部门树 -->
      <el-aside width="200px" style="background:#fff;border-right:1px solid #dfe6ec;border-top:1px solid #dfe6ec;padding:10px 0px 0px 0px;">
        <el-tree ref="leftTree" style="font-size:14px" :data="deptList" node-key="id" :props="{children: 'children', label: 'name'}" :expand-on-click-node='false' default-expand-all highlight-current @node-click="nodeClick">
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <div>
              <!-- 如果没有下级，就是最后一层 -->
              <span v-if="data.children.length == 0">
                <i style="margin-right: 3px" class="el-icon-document" />
              </span>
              <!-- 有下级，需要判断是展开还是关闭 -->
              <span v-else @click.stop="openBtn(data)">
                <!-- 展开图标 -->
                <i v-if="data.open" style="margin-right: 3px" class="el-icon-circle-plus-outline" />
                <!-- 折叠图标 -->
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
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <el-button type="danger" icon="el-icon-close">重置</el-button>
            <el-button type="warning" icon="el-icon-plus" @click="addDialogOpen">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 用户列表 -->
        <el-table :height="tableHeight" :data="userList" border stripe>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <!-- <el-table-column prop="deptName" label="所属部门"></el-table-column> -->
          <el-table-column prop="birth" label="电话"></el-table-column>
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
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getDeptListApi } from '../../../api/department'
import { getUserListApi, getUserListByDeptIdApi, deleteUserByUserId } from '../../../api/user'
import SysDialog from '../../../components/SysDialog.vue'
import {} from '../../../utils/auth'
export default {
  data() {
    return {
      userDialog: {
        title: '默认标题',
        visible: false,
        width: 200,
        type: 'add' // add表示新增对话框,edit表示编辑对话框
      },
      // 左侧树组件的容器高度
      containerHeight: 0,
      // 用户列表高度
      tableHeight: 0,
      deptList: [],
      userList: [],
      searchForm: {
        name: ''
      },
      getUserListByDeptIdApiParams: {
        deptId: 1,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    userDialogClose() {
      this.userDialog.visible = false
    },
    userDialogConfirm() {
      this.userDialog.visible = false
    },
    addDialogOpen() {
      this.userDialog.visible = true
    },
    editDialogOpen() {
      this.userDialog.visible = true
    },
    assignUser() {},
    // 删除用户
    async deleteUser(row) {
      const { data: res } = await deleteUserByUserId({ id: row.id })
      if (res && res.code === 200) {
        this.$message.success('删除成功!')
      }
      this.getUserList()
    },
    // 获取部门树
    async getDeptTree() {
      const { data: res } = await getDeptListApi()
      console.log(res.data)
      this.deptList = res.data
    },
    // 获取用户列表
    async getUserList() {
      if (this.getUserListByDeptIdApiParams.deptId === 1) {
        // TODO 这个地方需要重新修改
        const { data: res } = await getUserListApi()
        if (res && res.code === 200) {
          this.userList = res.data
          //this.total = res.data.total
        }
      } else {
        const params = {
          deptId: this.getUserListByDeptIdApiParams.deptId,
          currentPage: this.getUserListByDeptIdApiParams.currentPage,
          pageSize: this.getUserListByDeptIdApiParams.pageSize
        }
        const { data: res } = await getUserListByDeptIdApi(params)
        console.log(res.data.records)
        if (res && res.code === 200) {
          this.userList = res.data.records
          //this.total = res.data.total
        }
      }
    },

    // 左侧部门树节点单击事件
    async nodeClick(data) {
      this.getUserListByDeptIdApiParams.deptId = data.id
      this.getUserList()
    },
    // 加减号图标点击事件
    openBtn(data) {
      data.open = !data.open
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open
    }
  },
  created() {
    this.getDeptTree()
    this.getUserList()
  },
  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 176
      this.tableHeight = window.innerHeight - 300
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
