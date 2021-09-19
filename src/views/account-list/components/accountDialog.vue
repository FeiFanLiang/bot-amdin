<template>
 <el-dialog title="流水信息" width="80%" :visible.sync="popVisible" >
    <div class="table-form">
      <el-row :gutter="20">
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
          <el-button type="primary" @click="fetchData">搜索</el-button>
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
        <el-table-column label="转账接收人ID" prop="toUserId"></el-table-column>
        <el-table-column label="转账接收人用户名" prop="toUserName"></el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip ></el-table-column>
        <el-table-column label="是否成功" prop="success">
            <template v-slot="scope">
                {{scope.row.success ? '成功' : '未完成'}}
            </template>
        </el-table-column>
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
 </el-dialog>
  
</template>
<script>
import TableEditMixins from "@/components/tableEditMixins";
import { getRechargeListApi } from "@/api/recharge";

export default {
  mixins: [TableEditMixins],
  props:{
      userId:{},
      visible:Boolean
  },
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
          value:'pack_out',
          label:'发红包'
        },
        {
          value:'pack_in',
          label:'收红包'
        }
      ],
      filters: {
        type: "",
        success:''
      }
    };
  },
  computed:{
      popVisible:{
          get({visible}){
              return visible
          },
          set(val){
              this.$emit('update:visible',val)
          }
      }
  },
  watch:{
      popVisible(val){
          if(val){
              this.fetchData()
          }else {
              this.reset()
          }
      }
  },
  methods: {
    typeFormatter(row, column, value) {
      return this.typeOptions.find(el => el.value === value)?.label;
    },
    reset() {
      this.filters = {
        type: "",
      };
      this.pagination = {
        currentPage: 1,
        total: 0
      };
    },
    fetchData() {
      const { query } = this;
      const {userId} = this;
      const filters = {...query,userId}
      getRechargeListApi(filters).then(res => {
        const { docs, page, totalDocs } = res;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
      });
    }
  }
};
</script>
