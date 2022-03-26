<template>
  <div>
    <!-- 新增社团弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>
        <el-form label-position="left" :model="clubModel" ref="addclubForm" :rules="clubFormRules" label-width="80px" size="small" inline>
          <el-form-item label="社团名称" prop="name">
            <el-input v-model="clubModel.name"></el-input>
          </el-form-item>
          <el-form-item label="社团简介" prop="intro">
            <el-input v-model="clubModel.intro"></el-input>
          </el-form-item>
          <el-form-item label="社团管理员" prop="managerName" label-width="auto">
            <el-input v-model="clubModel.managerName" style="width:160px"></el-input>
          </el-form-item>
          <el-form-item label="社团指导老师" prop="guideTeacher" label-width="auto">
            <el-input v-model="clubModel.guideTeacher" style="width:160px"></el-input>
          </el-form-item>
          <el-form-item label="社团口号" prop="slogan">
            <el-input v-model="clubModel.slogan"></el-input>
          </el-form-item>
          <el-form-item label="社团Logo" prop="logo">
            <el-input v-model="clubModel.logo"></el-input>
          </el-form-item>
          <el-form-item label="社团指导老师电话" prop="guideTeacherPhone" label-width="auto">
            <el-input v-model="clubModel.guideTeacherPhone" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="社团地址" prop="address">
            <el-input type="textarea" autosize placeholder="请输入内容" style="width:200px" v-model="clubModel.address">>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入社团名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchclub">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:club:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 社团列表 -->
      <el-table :height="tableHeight" :data="clubList" border stripe>
        <el-table-column prop="name" label="社团名称"></el-table-column>
        <!-- //TODO:这个地方应该是显示logo的图片 -->
        <el-table-column prop="logo" label="社团logo"></el-table-column>
        <el-table-column prop="managerName" label="社团管理员"></el-table-column>
        <el-table-column prop="guideTeacher" label="社团指导老师"></el-table-column>
        <el-table-column prop="guideTeacherPhone" label="社团指导老师电话"></el-table-column>

        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!--  v-if="$hasPermission('sys:club:assign')"
                  v-if="$hasPermission('sys:club:edit')"
                  v-if="$hasPermission('sys:club:delete')"  //TODO: 最后添加到下面的按钮上-->
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
import SysDialog from '../../../components/SysDialog.vue'
import { getClubListApi, deleteClubApi, addClubApi, editClubApi } from '../../../api/club'
export default {
  data() {
    return {
      // 社团ID
      clubId: '',
      // 社团列表
      clubList: [],
      // 社团分页查询数据域
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
        title: '新增社团',
        width: 610,
        height: 200
      },
      // 社团数据域
      clubModel: {
        id: '1',
        name: 'club1',
        slogan: 'xxx',
        logo: 'xxxx',
        intro: 'xxx',
        details: 'xx',
        address: 'xxx',
        managerName: 'jdd',
        guideTeacher: 'jxx',
        guideTeacherPhone: '1111111',
        editType: '' // 标识
      },
      // 添加社团表单验证
      clubFormRules: {
        name: [{ required: true, message: '请输入社团名称', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入社团简介', trigger: 'blur' }],
        managerName: [{ required: true, message: '请输入社团管理员名称', trigger: 'blur' }],
        guideTeacher: [{ required: true, message: '请输入社团指导老师姓名', trigger: 'blur' }],
        guideTeacherPhone: [{ required: true, message: '请输入社团指导老师电话', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取社团列表
    async getClubList() {
      const { data: res } = await getClubListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.clubList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除社团
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该社团吗?')
      if (confirm) {
        const res = await deleteClubApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getClubList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑社团打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addclubForm', this.clubModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.clubModel)
      this.clubModel.editType = '1'
      this.addDialog.title = '编辑社团'
      this.addDialog.dialogVisible = true
    },
    // 新增社团打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addclubForm', this.clubModel)
      this.clubModel.editType = '0'
      this.addDialog.title = '添加社团'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getClubList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getClubList(this.paginationParams)
    },
    // 查询社团
    searchclub() {
      this.paginationParams.currentPage = 1
      this.getClubList(this.paginationParams)
    },
    // 重置社团搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getClubList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.clubModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该社团吗?' : '您确认要修改该社团吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addclubForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addClubApi(this.clubModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editClubApi(this.clubModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getClubList()
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
    this.getClubList()
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
