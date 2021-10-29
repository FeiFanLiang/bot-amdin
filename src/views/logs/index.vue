<template>
  <div class="app-container">
    <el-table :data="list">
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="ip地址" prop="ipAddress"></el-table-column>
      <el-table-column label="设备UA" prop="ua"></el-table-column>
      <el-table-column label="操作日志" prop="content"></el-table-column>
      <el-table-column
        label="操作时间"
        prop="createTime"
        :formatter="timeFormatter"
      ></el-table-column>
    </el-table>
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
import dayjs from "dayjs";
import { getLogsApi } from "@/api/account";
export default {
  data() {
    return {
      list: [],
      pagination: {
        currentPage: 1,
        total: 0
      }
    };
  },
  created(){
      this.fetchData()
  },
  methods: {
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
    },
    timeFormatter(row, column, value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    },
    fetchData() {
      getLogsApi(this.pagination).then(res => {
        const {docs,page} = res;
        this.list = docs;
        this.pagination.currentPage = page;
      });
    }
  }
};
</script>
