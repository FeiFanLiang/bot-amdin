<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            v-model.trim="filters.userId"
            clearable
            placeholder="用户ID"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="filters.userName" placeholder="用户名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.type" clearable placeholder="流水类型">
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.success" clearable placeholder="是否成功">
            <el-option
              v-for="item of successOptions"
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
      <el-table :data="tableList">
        <el-table-column label="用户ID" prop="userId"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="用户昵称" prop="nickName"></el-table-column>
        <el-table-column
          label="流水类型"
          prop="updateType"
          :formatter="typeFormatter"
        >
        </el-table-column>
        <el-table-column label="货币类型" prop="type"></el-table-column>
        <el-table-column label="金额" prop="amount"></el-table-column>
        <el-table-column label="操作前金额" prop="beforeAmount"></el-table-column>
        <el-table-column label="操作后金额" prop="afterAmount"></el-table-column>
        <el-table-column label="红包创建人ID" prop="fromUserId"></el-table-column>
        <el-table-column label="红包创建人用户名" prop="fromUserName"></el-table-column>
        <el-table-column label="转账接收人ID" prop="toUserId"></el-table-column>
        <el-table-column label="转账接收人用户名" prop="toUserName"></el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip ></el-table-column>
        <el-table-column label="是否成功" prop="success">
            <template v-slot="scope">
                {{scope.row.success ? '成功' : '未完成'}}
            </template>
        </el-table-column>
        <el-table-column
          label="操作人ID"
          prop="confirmUserId"
        ></el-table-column>
        <el-table-column
          label="操作人用户名"
          prop="confirmUserName"
        ></el-table-column>
        <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>

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
import TableEditMixins from "@/components/tableEditMixins";
import { getRechargeListApi } from "@/api/recharge";

export default {
  mixins: [TableEditMixins],
  data() {
    return {
         successOptions:[{
            label:"成功",
            value:'true'
        },{
            label:'未完成',
            value:'false'
        }],
      typeOptions: [
        {
          label: "充值",
          value: "add"
        },
        {
          label: "提现",
          value: "sub"
        },
        {
          label: "转账",
          value: "trans"
        },
        {
          label:'兑换',
          value:'exchange'
        },
        {
          label:'pack_out',
          value:'发红包'
        },
        {
          label:'pack_in',
          value:'收红包'
        }
      ],
      filters: {
        userId: "",
        type: "",
        success:'',
        userName: ""
      }
    };
  },
  methods: {
    typeFormatter(row, column, value) {
      return this.typeOptions.find(el => el.value === value)?.label;
    },
    reset() {
      this.filters = {
        userId: "",
        type: "",
        userName: ""
      };
      this.pagination = {
        currentPage: 1,
        total: 0
      };
    },
    search(){
      this.reset()
      this.fetchData()
    },
    fetchData() {
      const { query } = this;
      getRechargeListApi(query).then(res => {
        const { docs, page, totalDocs } = res;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
      });
    }
  }
};
</script>
