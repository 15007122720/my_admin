<template>
  <div>
    <!-- 面包屑 -->
    <Mbx msg1="用户管理" msg2="用户列表"></Mbx>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="usersList" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <!-- 一列 -->
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--  {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,  3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addform" label-width="70px" :rules="addformRules" ref="addformRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    /* 验证邮箱的规则 */
   var checkEmail =(rule, value, cb)=>{
   // 验证邮箱的正则表达式的
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        /* 合法的邮箱 */
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
   }
       /* 验证手机的规则 */
   var checkMobile =(rule, value, cb)=>{
   // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        /* 合法的邮箱 */
        return cb()
      }
      cb(new Error('请输入合法的手机'))
   }
    return {
      input1: " ",
      /* 获取用户列表的参数对象 */
      queryInfo: {
        query: "" /* 查询参数 */,
        pagenum: 1 /* 当前页码 */,
        pagesize: 3 /* 每页显示条数 */
      },
      usersList: [] /* 用户列表数据 */,
      total: 10 /* 总共有多少条 */,
      /* 添加对话框显示与隐藏 */
      dialogVisible: false,
      /* 添加用户的表单数据 */
      addform:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addformRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
           {validator:checkEmail, trigger:'blur'}
        ],
          mobile:[
           { required: true, message: '请输入手机', trigger: 'blur' },
           {validator:checkMobile, trigger:'blur'}
        ]
      }
    };
  },
  created() {
    this.getUserList(); /* 获取用户列表数据 */
  },
  methods: {
    /* 获取用户列表数据 */
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败");
      }

      this.usersList = res.data.users; /* 获取的数据赋给空数组 */
      this.total = res.data.total; /* 总共有多少条 */
      /*  console.log(res)   */
    },

    /*  监听获取每页显示条数 */
    handleSizeChange(newSize) {
      /*    console.log(`每页 ${newSize} 条`); */
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    /* 监听 当前页码 改变的事件 */
    handleCurrentChange(newPage) {
      /*  console.log(`当前页: ${newPage}`); */
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    /* 监听更新状态 */
    async switchChange(userInfo) {
      /*    console.log(userInfo) */ const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      console.log(res);

      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state; /* 还原状态按钮 */
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {}
  }
};
</script>

<style lang="less" scoped>
</style>
