<template>
  <div class="app-container">
    <div class="table-box">
      <el-table :data="tableList">
        <el-table-column label="模板内容" prop="context"></el-table-column>
        <el-table-column label="模板key" prop="key"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="success" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="30"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-dialog title="模板信息" :visible.sync="dialogVisible">
      <el-form
        label-position="left"
        label-width="100px"
        :model="form"
        ref="form"
      >
        <el-form-item label="模板key值" prop="key">
          <el-input v-model="form.key" disabled placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" required>
          <el-select v-model="form.type" placeholder="选择">
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'Photo'"
          label="图片URL"
          prop="photoUrl"
        >
          <el-input
            v-model="form.photoUrl"
            placeholder="请输入图片地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'Photo'"
          label="图片文本信息"
          prop="photoCaption"
        >
          <el-input
            v-model="form.photoCaption"
            placeholder="请输入文本"
          ></el-input>
        </el-form-item>
        <el-form-item label="文本内容" prop="context">
          <el-input
            type="textarea"
            v-model="form.context"
            placeholder="请输入文本内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="附加按钮" prop="buttons">
          <el-button
            type="primary"
            style="margin-bottom:20px"
            @click="handleAddButton"
            >添加一组按钮</el-button
          >
          <el-form-item v-for="(item, index) of form.buttons" :key="index">
            <el-select
              multiple
              v-model="form.buttons[index]"
              value-key="_id"
              placeholder="选择按钮"
            >
              <el-option
                v-for="button of buttons"
                :key="button.value"
                :label="`${button.key} (${button.remark})`"
                :value="button"
              ></el-option>
            </el-select>
            <el-button
              type="warning"
              style="margin-left:20px"
              @click="handleDelButton(index)"
              >删除本组按钮</el-button
            >
          </el-form-item>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入"
          ></el-input>
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
  getTemplateListApi,
  updateTemplateApi,
  getAllButtonApi
} from "@/api/template";

export default {
  data() {
    return {
      dialogVisible: false,
      pagination: {
        total: 0,
        currentPage: 1
      },
      typeOptions: [
        {
          value: "Text",
          label: "文本模板"
        },
        {
          value: "Photo",
          label: "图文模板"
        }
      ],
      tableList: [],
      form: {
        type: "",
        photoUrl: "",
        photoCaption: "",
        remark: "",
        buttons: [],
        key: "",
        context: ""
      },
      buttons: []
    };
  },
  created() {
    getAllButtonApi().then(res => {
      this.buttons = res;
    });
    this.fetchData();
  },
  methods: {
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      const { pagination } = this;
      getTemplateListApi(pagination).then(res => {
        const { docs, page, totalDocs } = res;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
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
        updateTemplateApi(form).then(() => {
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