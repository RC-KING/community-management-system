<template>
  <div>
    <el-container style="height: 100%;">
      <el-header class="header">
        <div>高校社团管理平台</div>
        <div class="user-info">
          <div class="user-avatar">
            <!-- 下拉菜单 -->
            <el-dropdown placement="bottom-start" @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fd0%2F5e%2F2c%2Fd05e2c240453f8bd3b52436d6bb03ec2.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646370238&t=8a15b68be2478a6fabc405633c846632">
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="user-name-box">
            <div class="user-name">
              金大大
            </div>
            <div class="current-time">
              {{date}}
            </div>
          </div>

        </div>
      </el-header>
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="auto" style="border-right: 1px solid #e6e6e6;">
          <menu-bar></menu-bar>
        </el-aside>
        <el-container>
          <!-- 主内容区域 -->
          <el-main class="main">
            <!-- 菜单折叠图标 -->
            <i class="arrow-icon" :class="isCollapse ? 'el-icon-s-unfold ':'el-icon-s-fold'" @click="iconClick"></i>
            <tab></tab>
            <!-- 路由展示 -->
            <router-view></router-view>
          </el-main>
          <el-footer class="footer">
            Copyright © 2022 - 2077 . 金大大的管理平台.All Rights Reserved
          </el-footer>

        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>
var $vueIndex
import { mapState } from 'vuex'
import MenuBar from '../components/MenuBar.vue'
import Cookies from 'js-cookie'
import Tab from '../components/Tab.vue'
export default {
  name: 'Home',
  components: {
    MenuBar,
    Tab
  },
  data() {
    return {
      date: '',
      avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F02%2F20180802091236_jictp.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638950328&t=496466bcea7aed659ea8e05a42b96cd9'
    }
  },
  mounted() {
    $vueIndex = this
    this.showTime()
    setInterval(function () {
      $vueIndex.showTime()
    }, 1000)
  },
  methods: {
    showTime() {
      var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minutes = date.getMinutes()
      var second = date.getSeconds()
      this.date = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '' + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (second < 10 ? '0' + second : second) + ' ' + (week[date.getDay()] || '')
    },
    iconClick() {
      console.log('点击图标')
      this.$store.commit('setIsCollapse')
      console.log(this.isCollapse)
    },
    async handleCommand(command) {
      if (command === 'logout') {
        // 清除相关信息
        Cookies.set('token', '')
        // 跳转到登录页面
        this.$router.push('/')
      }
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.MenuStore.isCollapse
    })
  }
}
</script>

<style lang="less" scoped>
.header {
  font-size: 21px;
  background-color: #167bd8;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .user-info {
    display: flex;
    justify-content: center;
    align-items: center;
    .user-avatar {
      height: 50px;
      margin-right: 10px;
      img {
        height: 50px;
        border-radius: 25px;
      }
    }
    .user-name-box {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: baseline;
      .user-name {
        font-size: 18px;
      }
      .current-time {
        font-size: 13px;
      }
    }
  }
}
.aside {
  background-color: teal;
}
.main {
  padding: 0;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: cadetblue;
  height: 50px;
  color: #fff;
}

//解决图标不能点击的问题
/deep/.el-tabs__header {
  position: static;
}

.arrow-icon {
  float: left;
  background: #eaedf1;
  border: 1px solid transparent;
  font-size: 23px;
  height: 39px;
  line-height: 39px !important;
  width: 40px;
  text-align: center;
  z-index: 9999;
}
</style>