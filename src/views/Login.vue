<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" ref="loginForm" :rules="loginrRules" :inline="false" size="medium">
      <el-form-item>
        <div class="login-form-title">高校社团平台登录</div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="8">
            <!-- 验证码 -->
            <img :src='imgSrc' @click="getImage" class="images" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button type="primary" @click="loginCommit" style="width:100%">登录</el-button>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button @click="resetLoginForm" style="width:100%">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginApi, getImageApi } from '../api/user'
import { setToken, setUserId, setTokenTime } from '../utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginrRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      // 验证码
      imgSrc: ''
    }
  },
  methods: {
    loginCommit() {
      this.$refs.loginForm.validate(async valid => {
        // 表单验证通过
        if (valid) {
          const { data: res } = await loginApi(this.loginForm)
          console.log('登录成功,返回的数据:', res)
          // 登录成功
          if (res.code === 200) {
            this.$message.success('登陆成功')
            // 设置tokne
            setToken(res.token)
            // 设置token过期时间
            setTokenTime(res.expireTime)
            // 设置用户id
            setUserId(res.id)
            window.location.href = '/home/desktop'
          } else {
            this.$message.error(res.msg)
            this.getImage()
          }
        }
      })
    },
    // 获取验证
    // 返回的数据是arraybuffer,需要转换为base64给img
    // 1.arraybuffer转换为二进制
    // 2.把二进制字符转换为base64字符
    async getImage() {
      const res = await getImageApi()
      const array = res.data
      const imageData = 'data:image/png;base64,' + btoa(new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      this.imgSrc = imageData
    },
    // 重置表单
    resetLoginForm() {
      this.$refs['loginForm'].resetFields()
    }
  },
  created() {
    this.getImage()
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 350px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 25px #ca6cc6;
  padding: 20px 35px;
  .login-form-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 26px;
  }
}
.images {
  height: 36px;
  width: 100px;
}
</style>
