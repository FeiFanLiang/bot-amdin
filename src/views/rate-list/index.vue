<template>
  <div class="app-container">
    <div class="table-box">
      <el-table :data="tableList">
        <el-table-column label="兑换货币" prop="fromType"></el-table-column>
        <el-table-column label="目标货币" prop="toType"></el-table-column>
        <el-table-column label="汇率" prop="rate"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="success" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="汇率编辑" :visible.sync="dialogVisible">
      <el-form
        label-position="left"
        label-width="100px"
        :model="form"
        :rules="rules"
        ref="form"
      >
      <el-form-item label="汇率" prop="rate">
          <el-input-number v-model="form.rate" :precision="2" placeholder="请输入汇率"></el-input-number>
      </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确认操作</el-button>
        <el-button>取消操作</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>

import {
 getRateApi,
 updateRateApi
} from "@/api/account";

export default {
  data() {
    return {
      dialogVisible: false,
      

      tableList: [],
      form: {
       id:"",
       rate:''
      },
      rules:{
          rate:[
              {
                  required:true,
                  message:'汇率必填',
                  trigger:'blur'
              },
              {
                  type:'number',
                  min:0.01,
                  message:'请输入要求的汇率',
                  trigger:'blur'
              }
          ]
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getRateApi().then(res => {
        this.tableList = res;
      });
    },
    handleEdit(row) {
      this.form = { ...row };
      this.dialogVisible = true;
    },
    handleDelButton(index) {
      this.form.buttons.splice(index, 1);
    },
    handleAddButton() {
      this.form.buttons.push([]);
    },
    submit() {
      this.$refs["form"].validate().then(() => {
        const { form } = this;
        updateRateApi(form).then(() => {
          this.$message.success("操作成功");
          this.dialogVisible = false;
          this.$refs["form"].resetFields();
          this.fetchData()
        });
      });
    }
  }
};
</script>
