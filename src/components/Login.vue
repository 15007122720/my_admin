<template>

  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt>
      </div>
      <!--  登录表单区 -->
      <div style="margin: 20px;"></div>
      <el-form
        label-width="0px"
        class="login_from"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right" /*  登录表单 */,
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      /* 登录表单el-form 的 数据绑定 */
      loginForm: {
        username: "admin",
        password: "123456"
      },
      /* 表单验证规则 */
      loginFormRules: {
        /* 验证用户名是否合法 */
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        /* 验证密码是否合法 */
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /* 重置登录表单  */
    resetForm() {
      /*  console.log(this);  */ //可以拿到表单实列对象

      this.$refs.loginFormRef.resetFields();
    },
    /* 登录表单预验证 */
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        /*  console.log(valid); */
        if (!valid) return; /* 如果是false 就终止 */
        const { data: res } = await this.$http.post("login", this.loginForm)
         console.log(res)
      if(res.meta.status != 200) return this.$message.error('请求错误')
       this.$message.success('请求成功')
        
         // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
          window.sessionStorage.setItem('token',res.data.token)
          /* 用编程式导航从登陆页面 跳到home */
                this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less"  scoped>
/* 登录大盒子背景 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

/* 登录框 */
.login_box {
  width: 450px;
  height: 320px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  /* v图片的盒子 */
  .avatar {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%; /* 边框圆角 */
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    /* v图片 */
    img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

/* 登录表单框 */
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 登录按钮 */
.btns {
  text-align: center;
}
</style>