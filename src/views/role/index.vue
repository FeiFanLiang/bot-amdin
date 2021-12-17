<template>
  <div class="app-container">
    <el-button type="success" style="margin-bottom:20px" @click="handleAdd">新增用户</el-button>
    <el-table :data="data" border>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="权限" prop="permission">
          <template v-slot="scope">
              <el-tag type="success" v-for="item of scope.row.permission" :key="item">
                  {{formatPermission(item)}}
              </el-tag>
          </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="warning" @click="handleEdit(scope.row)"
            >权限编辑</el-button
          >
          <el-button type="warning" @click="handleResetPass(scope.row)"
            >重置密码</el-button
          >
          <el-button type="danger" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogShow">
      <el-form :model="form" :rules="rules" ref="userForm">
        <el-form-item label="用户名" prop="username" v-if="!isEdit">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="form.password"
            :min="6"
            :max="20"
            show-password
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-select v-model="form.permission" multiple placeholder="权限">
              <el-option v-for="item of permission" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="passDialogShow">
      <el-form :model="passForm" :rules="rules" ref="resetForm">
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passForm.password"
            :min="6"
            :max="20"
            show-password
            placeholder="新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="resetPass">重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserListApi,
  editUserApi,
  deleteUserApi,
  resetPassApi
} from "@/api/role";
import dayjs from 'dayjs'
export default {
  data() {
    return {
      data: [],
      form: {
        _id: "",
        username: "",
        permission: []
      },
      passForm: { _id: "", password: "" },
      dialogShow: false,
      passDialogShow: false,
      isEdit: true,
      permission:[
          {
              label:'余额编辑',
              value:'amount_edit'
          },
          {
              label:'用户列表',
              value:'user_list'
          },
          {
              label:'白名单',
              value:'white_list'
          },
          {
              label:'汇率/充值/地址设置',
              value:'rate'
          },
          {
              label:'流水记录',
              value:'bill'
          },
            {
                label:'机器人模板',
                value:'template'
            }
      ],
      rules: {
        username: [
          {
            required: true,
            message: "用户名必填",
            trigger:'blur'
          },
          {
            type: "string",
            max: 16,
            min: 3,
            message: "3-16位长度",
            trigger:'blur'
          }
        ],
        password: [
          {
            required: true,
            message: "密码必填",
            trigger:'blur'
          },
          {
            type: "string",
            max: 20,
            min: 6,
            message: "6-12位长度",
            trigger:'blur'
          }
        ]
      }
    };
  },
  created() {
      this.fetchData()
  },
  methods: {
    handleAdd() {
      this.form = {
        _id: "",
        username: "",
        password: "",
        permission: []
      };
      this.isEdit = false
      this.dialogShow = true;
    },
    handleEdit(row) {
      this.isEdit = true;
      this.form = { ...row };
      this.dialogShow = true;
    },
    fetchData() {
      const loading = this.$loading({
        lock: true,
        text: "正在搜索.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getUserListApi()
        .then(res => {
        res.forEach(el => {
            el.createTime = dayjs(el.createTime).format("YYYY/MM/DD HH:mm:ss")
        })
          this.data = res;
        })
        .finally(() => {
          loading.close();
        });
    },
    formatPermission(item){
      return  this.permission.find(el => el.value === item)?.label
    },
    deleteUser(row) {
      this.$confirm("是否删除此用户?", "确认删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteUserApi({
          id: row._id
        }).then(() => {
          this.$message.success("删除成功");
          this.fetchData();
        });
      });
    },
    handleResetPass(row) {
      this.passForm = {
        _id: row._id,
        password: ""
      };
      this.passDialogShow = true;
    },
    submit() {
      this.$refs['userForm'].validate().then(() => {
         editUserApi(this.form).then(() => {
        this.$message.success("编辑成功");
        this.dialogShow = false;
        this.fetchData();
      });
      })
     
    },
    resetPass() {
      this.$refs['resetForm'].validate().then(() => {
         resetPassApi(this.passForm).then(() => {
        this.$message.success("重置成功");
        this.passDialogShow = false;
      });
      })
     
    }
  }
};
</script>
