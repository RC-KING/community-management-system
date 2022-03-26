<template>
  <div>
    <!-- 新增活动弹出框 -->
    <sys-dialog :title="addDialog.title" :visible="addDialog.dialogVisible" :width="addDialog.width" :height="addDialog.height" @onClose="addDialogClose" @onConfirm="addDialogConfirm">
      <template #content>

        <el-form label-position="left" :model="activityModel" ref="addactivityForm" :rules="activityFormRules" label-width="80px" size="small" inline>

          <!-- 获取用户的社团ID -->
          <el-form-item label="选择社团" prop="clubId">
            <el-input v-model="activityModel.clubId"></el-input>
          </el-form-item>
          <el-form-item label="物资ID" prop="suppliesId">
            <el-input v-model="activityModel.suppliesId"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="title">
            <el-input v-model="activityModel.title"></el-input>
          </el-form-item>
          <el-form-item label="活动规则" prop="rule">
            <el-input v-model="activityModel.rule"></el-input>
          </el-form-item>
          <el-form-item label="活动简介" prop="intro">
            <el-input v-model="activityModel.intro"></el-input>
          </el-form-item>
          <!-- 提供点击,markdown输入 -->
          <el-form-item label="活动细节" prop="details">
            <el-input v-model="activityModel.details"></el-input>
          </el-form-item>
          <el-form-item label="实际人数" prop="realNum">
            <el-input v-model="activityModel.realNum"></el-input>
          </el-form-item>
          <el-form-item label="早退人数" prop="leaveNum">
            <el-input v-model="activityModel.leaveNum"></el-input>
          </el-form-item>
          <el-form-item label="缺席人数" prop="absenceNum">
            <el-input v-model="activityModel.absenceNum"></el-input>
          </el-form-item>
          <el-form-item label="理想人数" prop="totalNum">
            <el-input v-model="activityModel.totalNum"></el-input>
          </el-form-item>
          <!-- 时间选择 -->
          <el-form-item label="开始时间" prop="beginTime">
            <el-input v-model="activityModel.beginTime"></el-input>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-input v-model="activityModel.endTime"></el-input>
          </el-form-item>
          <!-- TODO:应当是页面跳转 -->
          <el-form-item label="活动策划方案" prop="planningCases">
            <el-input v-model="activityModel.planningCases"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="activityModel.manager"></el-input>
          </el-form-item>
          <el-form-item label="活动地址" prop="address">
            <el-input type="textarea" autosize placeholder="请输入内容" style="width:200px" v-model="activityModel.address">>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <el-main style=" padding-top :20px;">
      <!-- 搜索框 -->
      <el-form :model="paginationParams" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="paginationParams.searchKeyWord" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchactivity">查询</el-button>
          <el-button type="danger" icon="el-icon-close" @click="resetSearchFrom">重置</el-button>
          <!-- v-if="$hasPermission('sys:activity:add')" // TODO:最后完成代码之后添加到下面-->
          <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 活动列表 -->
      <el-table :height="tableHeight" :data="activityList" border stripe>

        <!-- //TODO:这个地方应该是显示logo的图片 -->
        <el-table-column prop="title" label="活动名称"></el-table-column>
        <el-table-column prop="intro" label="活动简介"></el-table-column>
        <el-table-column prop="details" label="活动详情"></el-table-column>
        <el-table-column prop="address" label="活动地址"></el-table-column>
        <el-table-column prop="clubName" label="所属社团"></el-table-column>
        <el-table-column prop="manager" label="负责人"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <!-- TODO:审批的状态 -->
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <!--  v-if="$hasPermission('sys:activity:assign')"
                  v-if="$hasPermission('sys:activity:edit')"
                  v-if="$hasPermission('sys:activity:delete')"  //TODO: 最后添加到下面的按钮上-->
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
import { getActivityListApi, deleteActivityApi, addActivityApi, editActivityApi } from '../../../api/activity'
export default {
  data() {
    return {
      // 活动ID
      activityId: '',
      // 活动列表
      activityList: [],
      // 活动分页查询数据域
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
        title: '新增活动',
        width: 610,
        height: 200
      },
      // 活动数据域
      activityModel: {
        id: 1,
        clubId: 8,
        suppliesId: 1,
        title: '春蕾表演',
        rule: 'xxx',
        intro: '晚会表演',
        details: '1',
        address: '1',
        realNum: 11,
        leaveNum: 12,
        absenceNum: 2,
        totalNum: 330,
        beginTime: '',
        endTime: '',
        planningCases: '222',
        manager: 'jdd',
        editType: '' // 标识
      },
      // 添加活动表单验证
      activityFormRules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入活动简介', trigger: 'blur' }],
        managerName: [{ required: true, message: '请输入活动管理员名称', trigger: 'blur' }],
        guideTeacher: [{ required: true, message: '请输入活动指导老师姓名', trigger: 'blur' }],
        guideTeacherPhone: [{ required: true, message: '请输入活动指导老师电话', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取活动列表
    async getActivityList() {
      const { data: res } = await getActivityListApi(this.paginationParams)
      console.log(res)
      if (res && res.code === 200) {
        this.activityList = res.data.records
        this.paginationParams.total = res.data.total
      }
    },
    handleNodeClick() {},

    // 删除活动
    async deleteBtnClick(row) {
      const confirm = await this.$message.confirm('您确认要删除该活动吗?')
      if (confirm) {
        const res = await deleteActivityApi({ id: row.id })
        if (res) {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg)
            this.getActivityList()
          }
          if (res.data.code !== 200) this.$message.error(res.data.msg)
        } else {
          this.$message.error('操作失败!')
        }
      }
    },
    // 编辑活动打开弹出框
    openEditDialog(row) {
      // 清空表单
      this.$resetForm('addactivityForm', this.activityModel)
      // 将数据拷贝一份到数据域中
      this.$objCopy(row, this.activityModel)
      this.activityModel.editType = '1'
      this.addDialog.title = '编辑活动'
      this.addDialog.dialogVisible = true
    },
    // 新增活动打开弹出框
    openAddDialog() {
      // 清空表单
      this.$resetForm('addactivityForm', this.activityModel)
      this.activityModel.editType = '0'
      this.addDialog.title = '添加活动'
      this.addDialog.dialogVisible = true
    },
    // 分页容量改变
    handleSizeChange(val) {
      this.paginationParams.pageSize = val
      this.paginationParams.currentPage = 1
      this.getActivityList(this.paginationParams)
    },
    // 分页当前页面改变
    handleCurrentChange(val) {
      this.paginationParams.currentPage = val
      this.getActivityList(this.paginationParams)
    },
    // 查询活动
    searchactivity() {
      this.paginationParams.currentPage = 1
      this.getActivityList(this.paginationParams)
    },
    // 重置活动搜索框
    resetSearchFrom() {
      this.paginationParams.searchKeyWord = ''
      this.paginationParams.currentPage = 1
      this.getActivityList(this.paginationParams)
    },
    // 关闭新增对话框
    addDialogClose() {
      this.addDialog.dialogVisible = false
    },
    // 确认新增 / 修改
    async addDialogConfirm() {
      const optionType = this.activityModel.editType
      console.log(optionType)
      // 这个地方结合了自己封装的message组件
      var confirm = await this.$message.confirm(optionType === '0' ? '您确认要新增该活动吗?' : '您确认要修改该活动吗?')
      if (confirm) {
        // 表单验证
        this.$refs.addactivityForm.validate(async valid => {
          let res = null
          if (valid) {
            if (optionType === '0') {
              // 添加操作
              res = await addActivityApi(this.activityModel)
            } else if (optionType === '1') {
              // 编辑操作
              res = await editActivityApi(this.activityModel)
            }
            if (res) {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg)
                this.getActivityList()
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
    this.getActivityList()
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
