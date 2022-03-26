<template>
  <div>
    <!-- 新增常规课弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>

        <el-form label-position="left" :model="curriculumModel" ref="addcurriculumForm" :rules="curriculumFormRules" label-width="80px" size="small" inline>

          <!-- 获取用户的社团ID -->
          <!-- TODO:选择框弹出 -->
          <el-form-item label="选择社团" prop="clubName">
            <el-input v-model="curriculumModel.clubName"></el-input>
          </el-form-item>
          <el-form-item label="选择物资" prop="suppliesName">
            <el-input v-model="curriculumModel.suppliesName"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="managerName">
            <el-input v-model="curriculumModel.managerName"></el-input>
          </el-form-item>
          <el-form-item label="选择助教" prop="assistantName">
            <el-input v-model="curriculumModel.assistantName"></el-input>
          </el-form-item>
          <el-form-item label="选择指导老师" prop="leaderName">
            <el-input v-model="curriculumModel.leaderName"></el-input>
          </el-form-item>
          <el-form-item label="常规课名称" prop="title">
            <el-input v-model="curriculumModel.title"></el-input>
          </el-form-item>
          <!-- 提供点击,markdown输入 -->
          <el-form-item label="常规课细节" prop="details">
            <el-input v-model="curriculumModel.details"></el-input>
          </el-form-item>
          <el-form-item label="实际人数" prop="realNum">
            <el-input v-model="curriculumModel.realNum"></el-input>
          </el-form-item>
          <el-form-item label="早退人数" prop="leaveNum">
            <el-input v-model="curriculumModel.leaveNum"></el-input>
          </el-form-item>
          <el-form-item label="缺席人数" prop="absenceNum">
            <el-input v-model="curriculumModel.absenceNum"></el-input>
          </el-form-item>
          <el-form-item label="理想人数" prop="totalNum">
            <el-input v-model="curriculumModel.totalNum"></el-input>
          </el-form-item>
          <!-- 时间选择 -->
          <el-form-item label="开始时间" prop="beginTime">
            <el-input v-model="curriculumModel.beginTime"></el-input>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-input v-model="curriculumModel.endTime"></el-input>
          </el-form-item>

          <el-form-item label="常规课地址" prop="address">
            <el-input type="textarea" autosize placeholder="请输入内容" style="width:200px" v-model="curriculumModel.address">>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入常规课名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchcurriculum">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:curriculum:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 常规课列表 -->
      <el-table :height="tableHeight" :data="curriculumList" border stripe>
        <el-table-column prop="clubName" label="所属社团"></el-table-column>
        <el-table-column prop="title" label="常规课名称"></el-table-column>
        <el-table-column prop="managerName" label="负责人"></el-table-column>
        <el-table-column prop="details" label="常规课详情"></el-table-column>
        <el-table-column prop="address" label="常规课地址"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!--  v-if="$hasPermission('sys:curriculum:assign')"
                  v-if="$hasPermission('sys:curriculum:edit')"
                  v-if="$hasPermission('sys:curriculum:delete')"  //TODO: 最后添加到下面的按钮上-->
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
import { getCurriculumListApi, deleteCurriculumApi, addCurriculumApi, editCurriculumApi } from '../../../api/curriculum'
export default {
  data() {
    return {
      // 常规课ID
      curriculumId: '',
      // 常规课列表
      curriculumList: [],
      // 常规课分页查询数据域
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
        title: '新增常规课',
        width: 610,
        height: 200
      },
      // 常规课数据域
      curriculumModel: {
        id: 1,
        clubId: '',
        clubName: '',
        managerId: '',
        managerName: '',
        assistantId: '',
        assistantName: '',
        leaderId: '',
        leaderName: '',
        title: '',
        details: '',
        address: '',
        task: '',
        realNum: '',
        leaveNum: '',
        absenceNum: '',
        totalNum: '',
        beginTime: '',
        endTime: '',
        editType: '' // 标识
      },
      // 添加常规课表单验证
      curriculumFormRules: {
        name: [{ required: true, message: '请输入常规课名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取常规课列表
    async getCurriculumList() {
      const { data: res } = await getCurriculumListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.curriculumList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除常规课
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该常规课吗?')
      if (confirm) {
        const res = await deleteCurriculumApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getCurriculumList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑常规课打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addcurriculumForm', this.curriculumModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.curriculumModel)
      this.curriculumModel.editType = '1'
      this.addDialog.title = '编辑常规课'
      this.addDialog.dialogVisible = true
    },
    // 新增常规课打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addcurriculumForm', this.curriculumModel)
      this.curriculumModel.editType = '0'
      this.addDialog.title = '添加常规课'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getCurriculumList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getCurriculumList(this.paginationParams)
    },
    // 查询常规课
    searchcurriculum() {
      this.paginationParams.currentPage = 1
      this.getCurriculumList(this.paginationParams)
    },
    // 重置常规课搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getCurriculumList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.curriculumModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该常规课吗?' : '您确认要修改该常规课吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addcurriculumForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addCurriculumApi(this.curriculumModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editCurriculumApi(this.curriculumModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getCurriculumList()
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
    this.getCurriculumList()
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
