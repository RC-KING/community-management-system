<template>
  <div>
    <!-- 新增通知弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>
        <el-form label-position="left" :model="noticeModel" ref="addnoticeForm" :rules="noticeFormRules" label-width="80px" size="small" inline>
          <el-form-item label="通知名称" prop="title">
            <el-input v-model="noticeModel.title"></el-input>
          </el-form-item>
          <el-form-item label="通知简介" prop="intro">
            <el-input v-model="noticeModel.intro"></el-input>
          </el-form-item>
          <el-form-item label="通知详情" prop="details">
            <el-input v-model="noticeModel.details"></el-input>
          </el-form-item>
          <el-form-item label="通知序号" prop="orderNum">
            <el-input-number v-model="noticeModel.orderNum"></el-input-number>
          </el-form-item>
          <el-form-item label="创建者ID" prop="userId">
            <el-input disabled v-model="noticeModel.userId"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入通知名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchnotice">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:notice:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 通知列表 -->
      <el-table :height="tableHeight" :data="noticeList" border stripe>
        <el-table-column prop="title" label="通知标题"></el-table-column>
        <el-table-column prop="intro" label="通知简介"></el-table-column>
        <el-table-column prop="creator" label="创建者"></el-table-column>
        <!-- //TODO: 做成查看详情按钮 -->
        <el-table-column prop="details" label="通知细节"></el-table-column>
        <el-table-column prop="orderNum" label="通知排序码"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!-- v-if="$hasPermission('sys:notice:edit')"
                  v-if="$hasPermission('sys:notice:delete')"  //TODO: 最后添加到下面的按钮上-->
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
import { getNoticeListApi, deleteNoticeApi, addNoticeApi, editNoticeApi } from '../../../api/notice'
export default {
  data() {
    return {
      // 通知ID
      noticeId: '',
      // 通知列表
      noticeList: [],
      // 通知分页查询数据域
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
        title: '新增通知',
        width: 610,
        height: 200
      },
      // 通知数据域
      noticeModel: {
        id: '',
        userId: 11,
        title: '',
        intro: '',
        creator: '',
        details: '',
        orderNum: '',
        editType: ''
      },
      // 添加通知表单验证
      noticeFormRules: {
        title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入通知简介', trigger: 'blur' }],
        orderNum: [{ required: true, message: '请输入通知管理员名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取通知列表
    async getNoticeList() {
      this.noticeModel.userId = getUserId()
      const { data: res } = await getNoticeListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.noticeList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除通知
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该通知吗?')
      if (confirm) {
        const res = await deleteNoticeApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getNoticeList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑通知打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addnoticeForm', this.noticeModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.noticeModel)
      this.noticeModel.userId = getUserId()
      this.noticeModel.editType = '1'
      this.addDialog.title = '编辑通知'
      this.addDialog.dialogVisible = true
    },
    // 新增通知打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addnoticeForm', this.noticeModel)
      this.noticeModel.userId = getUserId()
      this.noticeModel.editType = '0'
      this.addDialog.title = '添加通知'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getNoticeList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getNoticeList(this.paginationParams)
    },
    // 查询通知
    searchnotice() {
      this.paginationParams.currentPage = 1
      this.getNoticeList(this.paginationParams)
    },
    // 重置通知搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getNoticeList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.noticeModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该通知吗?' : '您确认要修改该通知吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addnoticeForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addNoticeApi(this.noticeModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editNoticeApi(this.noticeModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getNoticeList()
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
    this.getNoticeList()
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
