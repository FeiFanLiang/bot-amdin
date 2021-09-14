<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model.trim="filters.key" clearable placeholder="key值"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.type" clearable placeholder="类型">
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-box">
        <el-row style="margin:20px 0;">
          <el-col :span="24">
              <el-button type="success" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>
      <el-table :data="tableList">
        <el-table-column
          label="变量类型"
          prop="type"
          :formatter="typeFormatter"
        ></el-table-column>
        <el-table-column label="key值" prop="key"></el-table-column>
        <el-table-column label="按钮回调" prop="callback_data">
        </el-table-column>
        <el-table-column label="按钮链接" prop="url"></el-table-column>
        <el-table-column label="按钮文本" prop="text"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="success" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              v-if="scope.row.deleteAble"
              @click="handleDelete(scope.row)"
              >删除</el-button
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
    <el-dialog title="按钮详情" :visible.sync="dialogVisible">
      <el-form
        label-position="left"
        label-width="200px"
        :rules="rules"
        :model="form"
        ref="form"
      >
        <el-form-item label="key值" prop="type">
          <el-input v-model="form.key" placeholder="key值" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="变量类型" prop="type">
          <el-select
            v-model="form.type"
            :disabled="isEdit"
            placeholder="请选择"
          >
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="按钮回调(设置回调后URL不再生效)" prop="callback_data" v-if="form.type === 'button' || form.type === 'callbackButton'" >
          <el-input
            v-model="form.callback_data"
            placeholder="请以/字符开头"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮分享URL" prop="url" v-if="form.type === 'button' || form.type === 'callbackButton'">
          <el-input v-model="form.url" placeholder="输入分享的URL"></el-input>
        </el-form-item>
        <el-form-item label="按钮文本" prop="text" :required="form.type === 'button' " v-if="form.type === 'button' || form.type === 'callbackButton'">
          <el-input v-model="form.text" placeholder="输入按钮文本"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="输入备注"
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
import TableEditMixins from "@/components/tableEditMixins";
import { getKeysListApi, updateKeyApi,deleteKeyApi } from "@/api/keys";
export default {
  mixins: [TableEditMixins],
  data() {
    return {
      isEdit: false,
      typeOptions: [
        {
          label: "回调按钮",
          value: "callbackButton",
        },
        {
          label: "命令",
          value: "command",
        },
        {
          label: "按钮",
          value: "button",
        },
      ],
      filters: {
        key: "",
        type: "",
      },
      form: {
        id: "",
        key: "",
        command: "",
        callback_data: "",
        text: "",
        url: "",
        remark: "",
        type: "button",
      },
      rules: {
          key:{
              required:true,
              message:'变量的key值必填',
              trigger:'blur'
          },
        callback_data: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value &&  !value.startsWith("/")) {
                callback(new Error("回调必须以/开头"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        text: [
          {
            message: "按钮文本必填",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (
                value &&
                !/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(
                  value
                )
              ) {
                callback(new Error("请输入合法的URL地址"));
              } else {
                callback();
              }
            },
          },
        ],
        remark: [
          {
            required: false,
            max: 300,
          },
        ],
      },
    };
  },
  methods: {
    typeFormatter(row, column, value) {
      return this.typeOptions.find((el) => el.value === value)?.label;
    },
    reset() {
      this.filters = {
        key: "",
        type: "",
      };
      this.pagination = {
        currentPage: 1,
        total: 0,
      };
    },
    fetchData() {
      const { query } = this;
      getKeysListApi(query).then((res) => {
        const { docs, page, totalDocs } = res;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
      });
    },
    handleEdit(row) {
        this.isEdit = true;
        this.form = {...row}
        this.dialogVisible = true;
    },
    handleDelete(row) {
        const data = {
            id:row.id
        }
        deleteKeyApi(data).then(() => {
            this.$message.success('删除成功')
            this.fetchData()
        })
    },
    submit() {
      this.$refs["form"].validate().then(() => {
        const { form } = this;
        updateKeyApi(form).then(() => {
            this.fetchData()
          this.$message.success("操作成功");
          this.dialogVisible = false;
          this.form = {
            id: "",
            key: "",
            command: "",
            callback_data: "",
            text: "",
            url: "",
            remark: "",
            type: "button",
          };
          this.$refs["form"]?.resetFields();
        });
      });
    },
    handleAdd() {
      this.isEdit = false;
      this.form = {id: "",
        key: "",
        command: "",
        callback_data: "",
        text: "",
        url: "",
        remark: "",
        type: "button"}
      this.dialogVisible = true;
    },
  },
};
</script>
