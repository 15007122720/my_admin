<template>

  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 侧边栏区 -->
    <el-container>
      <el-aside :width="isCOllapse ? '64px': '200px' " >
        <div class="toggleButton" @click="toggleCOllapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"   :collapse="isCOllapse"  :unique-opened="true" :router="true" 
        :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+' '" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index=" '/' + subItem.path"   v-for="subItem in item.children" :key="subItem.id" @click="activeState('/' + subItem.path)">
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体内容区 -->
      <el-main>
         <!-- 路由占位 -->
         <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 用来接收左侧菜单数据 
      menulist: [],
      /* 一级菜单的图标 */
      iconsObj:{
       '125' : 'iconfont icon-users',
       '103' : 'iconfont icon-tijikongjian',
       '101' : 'iconfont icon-shangpin',
       '102' : 'iconfont icon-danju',
       '145' : 'iconfont icon-baobiao'
      },
       isCOllapse:false ,/* 切换左侧栏   是否折叠 */
        activePath:' '   /* 保存被激活的链接地址  */
    };
   
   
  },
  /*  实例创建完成 */
  created() {
    this.getMenulist();
    this.activePath=  window.sessionStorage.getItem('activePathss')/* 拿到激活的链接地址 */
  },

  methods: {
    loginOut() {
      window.sessionStorage.clear(); /* 清除token */
      this.$router.push("/login"); /* 跳回登陆页面 */
    },
    /* 获取左侧栏的菜单数据 */
    async getMenulist(){
      const {data:res}  = await this.$http.get('menus')
     if( res.meta.status !== 200) return this.$message.error('请求错误')
         this.menulist = res.data
     /*  console.log(res)
      console.log(this.menulist) */
       
        
    },
    /* 点击按钮，切换菜单的折叠与展开  */
    toggleCOllapse(){
      this.isCOllapse = !this.isCOllapse  
    },
    /* 保持链接高亮 */
    activeState(activePath){
      window.sessionStorage.setItem('activePathss',activePath)
      this.activePath =activePath    /* 保持高亮 */
    }
  }
};
</script>

<style lang="less"  scoped>
.home-container {
  height: 100%;
}

/* 头部栏 */
.el-header {
  display: flex;
  justify-content: space-between; /* 元素位于各行之间留有空白的容器内 */
  align-items: center; /* 定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。 */
  background-color: #373d41;
  color: #ffffff;
  font-size: 20px;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

/*侧边栏  */
.el-aside {
  background-color: #333744;

  .el-menu{
    border-right: none;
  }
}

/* 主体内容区 */
.el-main {
  background-color: #eaedf1;
}


/* 切换 按钮 */
.toggleButton{
  color: #fff;
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing:0.2em; /* 增加或减少字符间的空白（字符间距） */
cursor: pointer;
}

/* 一级菜单 小图标 */
.iconfont{
  padding-right: 10px;
}
</style>