<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            v-model.trim="filters.address"
            clearable
            placeholder="地址"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model.trim="filters.userId"
            clearable
            placeholder="用户ID"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.able" clearable placeholder="请选择">
            <el-option
              v-for="item of ableOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="fetchData">搜索</el-button>
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
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="用户名" prop="accountName"></el-table-column>
        <el-table-column label="用户ID" prop="userId"></el-table-column>
        <el-table-column label="已被使用" prop="able">
          <template v-slot="scope">
            {{ scope.row.able ? "未使用" : "已使用" }}
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
    <el-dialog title="余额变动" :visible.sync="dialogVisible">
      <el-form
        label-position="left"
        label-width="100px"
        :rules="rules"
        :model="form"
        ref="form"
      >
        <el-form-item label="地址" prop="addresses">
          <el-input
            type="textarea"
            v-model="form.addresses"
            placeholder="请粘贴地址导入,每个地址之间用回车分割"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确认操作</el-button>
        <el-button @click="dialogVisible = false">取消操作</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import tableEditMixins from "@/components/tableEditMixins";
import { getAddressListApi, addAddressApi } from "@/api/address";
export default {
  mixins: [tableEditMixins],
  data() {
    return {
      filters: {
        address: "",
        userId: "",
        able: ""
      },
      ableOptions: [
        { label: "已使用", value: false },
        { label: "未使用", value: true }
      ],
      form: {
        addresses: ""
      },
      rules: {
        addresses: [
          {
            required: true,
            message: "地址不能为空"
          }
        ]
      }
    };
  },
  methods: {
    handleAdd() {
        this.dialogVisible = true;
    },
    reset() {
      this.filters = {
        address: "",
        userId: "",
        able: ""
      };
      this.pagination = {
        currentPage: 1,
        total: 0
      };
    },
    fetchData() {
      const { query } = this;
      getAddressListApi(query).then(res => {
        const { docs, page, totalDocs } = res;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
      });
    },
    submit() {
      this.$refs["form"].validate().then(() => {
        const addresses = this.form.addresses
          .split("\n")
          .map(el => el.trim())
          .filter(el => el);
        if (addresses.length) {
          addAddressApi({
            addresses
          }).then(() => {
            this.$message.success("添加成功");
            this.dialogVisible = false;
            this.$refs["form"].resetFields();
            this.fetchData();
          });
        }
      });
    }
  }
};
</script>
