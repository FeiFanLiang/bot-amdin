<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input clearable v-model.trim="filters.createUserId" placeholder="红包创建人ID"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input clearable v-model.trim="filters.createUserName" placeholder="红包创建人用户名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input clearable v-model="filters.acceptedUserId" placeholder="红包领取人ID"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filers.hasAccept"  clearable placeholder="是否领取">
            <el-option v-for="item of ['true','false']" :key="item" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input clearable v-model="filters.acceptedUserName" placeholder="红包领取人用户名"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-box">
      <el-table :data="tableList">
        <el-table-column label="红包唯一ID" prop="uuid"></el-table-column>
        <el-table-column label="创建人ID" prop="createUserId"></el-table-column>
        <el-table-column label="创建人用户名" prop="createUserName"></el-table-column>
        <el-table-column label="创建人昵称" prop="nickName"></el-table-column>
        <el-table-column label="接收人ID" prop="acceptedUserId"></el-table-column>
        <el-table-column label="接收人用户名" prop="acceptedUserName"></el-table-column>
        <el-table-column label="接收人昵称" prop="acceptedNickName"></el-table-column>
        <el-table-column label="红包金额" prop="amount" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="红包创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
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
  </div>
</template>
<script>
import { getRedpackListApi } from "@/api/account";
import dayjs from 'dayjs'
export default {
  data() {
    return {
      filters: {
        createUserId: "",
        createUserName: "",
        acceptedUserId: '',
        acceptedUserName: ''
      },
      pagination: {
        currentPage: 1,
        total: 0
      },

      tableList: []
    };
  },
  computed: {
    query({ filters, pagination }) {
      return { ...filters, ...pagination };
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    timeFormatter(row, column, value) {
      return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    search() {
      this.pagination.currentPage = 0;
      this.fetchData();
    },

    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },
    amountFormatter(row, column, value) {
      if (!value) {
        return 0;
      }
      return (value / 100).toFixed(2)
    },
    fetchData() {
      const { query } = this;
      const loading = this.$loading({
        lock: true,
        text: "正在搜索.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getRedpackListApi(query)
        .then(res => {
          const { docs, page, totalDocs } = res;
          this.pagination.total = totalDocs;
          this.tableList = docs
          this.pagination.currentPage = page;
        })
        .finally(() => {
          loading.close();
        });
    },
    reset() {
      this.pagination = {
        currentPage: 1,
        total: 0
      };
      this.filters = {
        createUserId: "",
        createUserName: "",
        acceptedUserId: '',
        acceptedUserName: ''
      };
    },
    resetFilter() {
      this.reset();
      this.fetchData();
    }
  }
};
</script>
<style lang="scss">
.count {
  margin: 15px 0;
  display: flex;
  font-size: 18px;
  font-weight: 600;
  & > span {
    margin-left: 25px;
  }
}
</style>
