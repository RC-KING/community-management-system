<template>
  <div>
    <!-- 新增社团风采弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>

        <el-form label-position="left" :model="clubPresenceModel" ref="addclubPresenceForm" :rules="clubPresenceFormRules" label-width="80px" size="small" inline>
          <el-form-item label="社团风采主题" prop="title">
            <el-input v-model="clubPresenceModel.title"></el-input>
          </el-form-item>
          <!-- TODO:点击之后是富文本输入页面 -->
          <el-form-item label="社团风采详情" prop="details">
            <el-input v-model="clubPresenceModel.details"></el-input>
          </el-form-item>
          <!-- TODO: 只能是社团内的人 -->
          <el-form-item label="请选择发布者" prop="userId">
            <el-input v-model="clubPresenceModel.userId"></el-input>
          </el-form-item>
          <!-- TODO: 选择社团,这个必须绑定自己的社团ID -->
          <el-form-item label="所属社团" prop="clubId">
            <el-input disabled v-model="clubPresenceModel.clubId"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入社团风采名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchClubPresence">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:clubPresence:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 社团风采列表 -->
      <el-table :height="tableHeight" :data="clubPresenceList" border stripe>
        <el-table-column prop="clubName" label="所属社团"></el-table-column>
        <el-table-column prop="userName" label="发布者"></el-table-column>
        <el-table-column prop="title" label="社团风采主题"></el-table-column>
        <!-- //TODO: 做成查看详情按钮 -->
        <el-table-column prop="details" label="社团风采详情"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!-- v-if="$hasPermission('sys:clubPresence:edit')"
                  v-if="$hasPermission('sys:clubPresence:delete')"  //TODO: 最后添加到下面的按钮上-->
            <el-button icon="el-icon-edit" type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteBtnClick(scope.row)">删除</el-button>
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
import { getUserId } from '../../../utils/auth'

import SysDialog from '../../../components/SysDialog.vue'
import { getClubPresenceListApi, deleteClubPresenceApi, addClubPresenceApi, editClubPresenceApi } from '../../../api/clubPresence'
export default {
  data() {
    return {
      // 社团风采ID
      clubPresenceId: '',
      // 社团风采列表
      clubPresenceList: [],
      // 社团风采分页查询数据域
      paginationParams: {
        searchKeyWord: '',
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页的数据条数容量
        total: 0 // 数据总条数
      },
      // 表格高度
      tableHeight: 0,
      // 表格属性
      addDialog: {
        dialogVisible: false,
        title: '新增社团风采',
        width: 610,
        height: 200
      },
      // 社团风采数据域
      clubPresenceModel: {
        id: '',
        userName: '',
        clubName: '',
        userId: '',
        clubId: '',
        title: '',
        details: '',
        editType: ''
      },
      // 添加社团风采表单验证
      clubPresenceFormRules: {
        title: [{ required: true, message: '请输入社团风采标题', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取社团风采列表
    async getClubPresenceList() {
      this.clubPresenceModel.userId = getUserId()
      const { data: res } = await getClubPresenceListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.clubPresenceList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除社团风采
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该社团风采吗?')
      if (confirm) {
        const res = await deleteClubPresenceApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getClubPresenceList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑社团风采打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addclubPresenceForm', this.clubPresenceModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.clubPresenceModel)
      this.clubPresenceModel.userId = getUserId()
      this.clubPresenceModel.editType = '1'
      this.addDialog.title = '编辑社团风采'
      this.addDialog.dialogVisible = true
    },
    // 新增社团风采打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addclubPresenceForm', this.clubPresenceModel)
      this.clubPresenceModel.userId = getUserId()
      this.clubPresenceModel.editType = '0'
      this.addDialog.title = '添加社团风采'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getClubPresenceList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getClubPresenceList(this.paginationParams)
    },
    // 查询社团风采
    searchClubPresence() {
      this.paginationParams.currentPage = 1
      this.getClubPresenceList(this.paginationParams)
    },
    // 重置社团风采搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getClubPresenceList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.clubPresenceModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该社团风采吗?' : '您确认要修改该社团风采吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addclubPresenceForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addClubPresenceApi(this.clubPresenceModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editClubPresenceApi(this.clubPresenceModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getClubPresenceList()
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
    async getClubByUserId() {}
  },
  components: {
    SysDialog
  },
  created() {
    this.getClubPresenceList()
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
