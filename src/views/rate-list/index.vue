<template>
  <div class="app-container">
    <el-button @click="hanldeBatchEdit">批量编辑</el-button>
    <div class="table-box">
      <el-table :data="tableList" @selection-change="handleChange" >
        <el-table-column
      type="selection"
      width="55">
    </el-table-column>
        <el-table-column label="兑换货币" sortable prop="fromType"></el-table-column>
        <el-table-column label="目标货币" sortable prop="toType"></el-table-column>
        <el-table-column label="汇率" sortable prop="rate"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="success" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="汇率编辑" :visible.sync="dialogVisible">
      <el-form label-position="left" label-width="100px" :model="form" :rules="rules" ref="form">
        <el-form-item label="汇率" prop="rate">
          <el-input-number v-model="form.rate" :precision="6" placeholder="请输入汇率"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确认操作</el-button>
        <el-button>取消操作</el-button>
      </template>
    </el-dialog>
    <el-dialog title="汇率" :visible.sync="batchDialogVisible">
      <el-form :model="batchForm">
        <el-form-item label="汇率" prop="rate" required>
          <el-input-number v-model="batchForm.rate" :precision="6" placeholder="请输入汇率"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="batchEditSave">确认修改</el-button>
      </template>

    </el-dialog>
  </div>
</template>
<script>

import {
  getRateApi,
  updateRateApi,
  batchUpdateRateApi
} from "@/api/account";

export default {
  data() {
    return {
      batchDialogVisible:false,
      dialogVisible: false,
      selects:[],
      tableList: [],
      batchForm:{
        ids:[],
        rate:0
      },
      form: {
        id: "",
        rate: '',
        remark:''
      },
      rules: {
        rate: [
          {
            required: true,
            message: '汇率必填',
            trigger: 'blur'
          },
          {

            type: 'number',
            min: 0,
            message: '请输入要求的汇率',
            trigger: 'blur'
          }
        ]
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    batchEditSave(){
      batchUpdateRateApi(this.batchForm).then(() => {
        this.$message.success('更新成功')
        this.batchDialogVisible = false;
        this.fetchData()
      })
    },
    hanldeBatchEdit(){
      this.batchForm = {
        ids:this.selects.map(el => el._id),
        rate:0
      }
      this.batchDialogVisible = true
    },
    handleChange(selects){
      this.selects = selects;
    },
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
        this.$confirm(`确认设置兑换货币（${form.fromType}）到 目标货币（${form.toType}）的汇率：${form.rate}`, '确认操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateRateApi(form).then(() => {
            this.$message.success("操作成功");
            this.dialogVisible = false;
            this.$refs["form"].resetFields();
            this.fetchData()
          });
        })
      });
    }
  }
};
</script>
