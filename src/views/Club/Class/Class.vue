<template>
  <div>
    <!-- 新增班级弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>
        <el-form label-position="left" :model="classModel" ref="addclassForm" :rules="classFormRules" label-width="80px" size="small" inline>
          <el-form-item label="班级名称" prop="clssName">
            <el-input v-model="classModel.clssName"></el-input>
          </el-form-item>
          <el-form-item label="大学名称" prop="collegeName">
            <el-input v-model="classModel.collegeName"></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="majorName" label-width="auto">
            <el-input v-model="classModel.majorName"></el-input>
          </el-form-item>
          <el-form-item label="班级学生数" prop="studentNumber" label-width="auto">
            <el-input v-model="classModel.studentNumber"></el-input>
          </el-form-item>
          <el-form-item label="创立时间" prop="estabDate">
            <el-input v-model="classModel.estabDate"></el-input>
          </el-form-item>
          <el-form-item label="辅导员" prop="adviser">
            <el-input v-model="classModel.adviser"></el-input>
          </el-form-item>
          <el-form-item label="学习年限" prop="yearNumber" label-width="auto">
            <el-input v-model="classModel.yearNumber" style="width:120px"></el-input>
          </el-form-item>

        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchclass">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:class:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 班级列表 -->
      <el-table :height="tableHeight" :data="classList" border stripe>
        <el-table-column prop="clssName" label="班级名称"></el-table-column>
        <el-table-column prop="collegeName" label="大学名称"></el-table-column>
        <el-table-column prop="majorName" label="专业名称"></el-table-column>
        <el-table-column prop="studentNumber" label="班级学生数"></el-table-column>
        <el-table-column prop="estabDate" label="创立时间"></el-table-column>
        <el-table-column prop="adviser" label="辅导员"></el-table-column>
        <el-table-column prop="yearNumber" label="学习年限"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!--  v-if="$hasPermission('sys:class:assign')"
                  v-if="$hasPermission('sys:class:edit')"
                  v-if="$hasPermission('sys:class:delete')"  //TODO: 最后添加到下面的按钮上-->
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
import { getClassListApi, deleteClassApi, addClassApi, editClassApi } from '../../../api/class'
export default {
  data() {
    return {
      // 班级ID
      classId: '',
      // 班级列表
      classList: [],
      // 班级分页查询数据域
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
        title: '新增班级',
        width: 610,
        height: 200
      },
      // 班级数据域
      classModel: {
        id: '1',
        collegeName: '',
        collegeId: '',
        majorName: '',
        majorId: '',
        className: '',
        studentNumber: '',
        estabDate: '',
        adviser: '',
        yearNumber: '',
        editType: '' // 标识
      },
      // 添加班级表单验证
      classFormRules: {
        name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入班级简介', trigger: 'blur' }],
        managerName: [{ required: true, message: '请输入班级管理员名称', trigger: 'blur' }],
        guideTeacher: [{ required: true, message: '请输入班级指导老师姓名', trigger: 'blur' }],
        guideTeacherPhone: [{ required: true, message: '请输入班级指导老师电话', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取班级列表
    async getClassList() {
      const { data: res } = await getClassListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.classList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除班级
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该班级吗?')
      if (confirm) {
        const res = await deleteClassApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getClassList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑班级打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addclassForm', this.classModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.classModel)
      this.classModel.editType = '1'
      this.addDialog.title = '编辑班级'
      this.addDialog.dialogVisible = true
    },
    // 新增班级打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addclassForm', this.classModel)
      this.classModel.editType = '0'
      this.addDialog.title = '添加班级'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getClassList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getClassList(this.paginationParams)
    },
    // 查询班级
    searchclass() {
      this.paginationParams.currentPage = 1
      this.getClassList(this.paginationParams)
    },
    // 重置班级搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getClassList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.classModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该班级吗?' : '您确认要修改该班级吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addclassForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addClassApi(this.classModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editClassApi(this.classModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getClassList()
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
    this.getClassList()
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
