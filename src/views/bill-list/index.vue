<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model.trim="filters.userId" clearable placeholder="用户ID"></el-input>
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
        <el-col :span="4">
          <el-date-picker
            v-model="filters.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="filters.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="warning" @click="dialogShow = true">导出表格</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-box">
      <div style="margin-bottom: 20px;" class="item-wrap">
        <el-card shadow="always" v-for="item of countList" class="item">
          <span>流水类型：{{ item.updateType | updateType }}</span>
          <span>{{ item.updateType === 'trans' ? '兑换原币类型：' : '货币类型：' }} {{ item.type.toUpperCase() }}</span>
          <span>金额：{{ item.total }}</span>
        </el-card>
      </div>
      <el-table :data="tableList">
        <el-table-column label="用户ID" prop="userId"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="用户昵称" prop="nickName"></el-table-column>
        <el-table-column label="流水类型" prop="updateType" :formatter="typeFormatter"></el-table-column>
        <el-table-column label="货币类型" prop="type"></el-table-column>
        <el-table-column label="金额" prop="amount"></el-table-column>
        <el-table-column label="操作前金额" prop="beforeAmount"></el-table-column>
        <el-table-column label="操作后金额" prop="afterAmount"></el-table-column>
        <el-table-column label="收款人ID" prop="toUserId"></el-table-column>
        <el-table-column label="收款人用户名" prop="toUserName"></el-table-column>
        <el-table-column label="收款人昵称" prop="toUserNickName"></el-table-column>
        <el-table-column label="付款人ID" prop="fromUserId"></el-table-column>
        <el-table-column label="付款人用户名" prop="fromUserName"></el-table-column>
        <el-table-column label="付款人昵称" prop="fromUserNickName"></el-table-column>
        <el-table-column label="汇率" prop="rate"></el-table-column>
        <el-table-column label="目标货币" prop="exchangeType"></el-table-column>
        <el-table-column label="兑换目标金额" prop="exchangeAmount"></el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否成功" prop="success">
          <template v-slot="scope">{{ scope.row.success ? "成功" : "未完成" }}</template>
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
    <el-dialog title="导出表格" :visible.sync="dialogShow">
      <el-form :model="downForm">
        <el-form-item label="开始时间">
          <el-date-picker v-model="downForm.start" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="downForm.end" placeholder="结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="downLoad">导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import TableEditMixins from "@/components/tableEditMixins";
import { getRechargeListApi } from "@/api/recharge";
import dayjs from "dayjs";
import { downLoadApi } from "@/api/account";
import stringify from "csv-stringify";
export default {
  mixins: [TableEditMixins],
  filters: {
    updateType(val) {
      if (val === 'add') {
        return '充值'
      }
      if (val === 'sub') {
        return '提现'
      }
      if (val === 'trans') {
        return '兑换'
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      countList: [],
      successOptions: [
        {
          label: "成功",
          value: "true"
        },
        {
          label: "未完成",
          value: "false"
        }
      ],
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
          label: "兑换",
          value: "exchange"
        },
        {
          value: "pack_out",
          label: "发红包"
        },
        {
          value: "pack_in",
          label: "收红包"
        }
      ],
      filters: {
        userId: "",
        type: "",
        success: "",
        userName: "",
        startTime: dayjs().format('YYYY-MM-DD'),
        endTime: ''
      },
      downForm: {
        start: "",
        end: ""
      }
    };
  },
  methods: {
    getRecordType(value) {
      switch (value) {
        case "add":
          return "充值";
        case "sub":
          return "提现";
        case "trans":
          return "转账";
        case "exchange":
          return "兑换";
        case "pack_in":
          return "领红包";
        case "pack_out":
          return "发红包";
        default:
          return "";
      }
    },
    getAmountType(value) {
      switch (value) {
        case "usd":
          return "美元(USD)";
        case "rm":
          return "马来亚令吉(RM)";
        case "cny":
          return "人民币(CNY)";
        case "php":
          return "菲律宾披索(PHP)";
        case "aed":
          return "迪拜迪拉姆(AED)";
        case "usdt":
          return "USDT";
        case "trc":
          return "USDT-TRC";
        case "erc":
          return "USDT-ERC";
        default:
          return "";
      }
    },

    downLoad() {
      const loading = this.$loading({
        lock: true,
        text: "正在下载.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      downLoadApi(this.downForm)
        .then(list => {
          list.forEach(el => {
            el.updateType = this.getRecordType(el.updateType);
            el.type = this.getAmountType(el.type);
            el.createTime = dayjs(el.createTime).format("YYYY/MM/DD HH:mm:ss");
          });
          stringify(
            list,
            {
              header: true,
              columns: [
                { key: "userId", header: "用户ID" },
                { key: "userName", header: "用户名" },
                { key: "nickName", header: "用户昵称" },
                { key: "amount", header: "金额" },
                { key: "type", header: "货币类型" },
                { key: "updateType", header: "交易类型" },
                { key: "handingFee", header: "手续费" },
                { key: "beforeAmount", header: "交易前金额" },
                { key: "afterAmount", header: "交易后金额" },
                { key: 'confirmNickName', header: '操作人昵称' },
                { key: "createTime", header: "创建时间" }
              ]
            },
            function (err, output) {
              if (err) {
                loading.close();
              }
              loading.close();
              const dataBlob = new Blob([`\ufeff${output}`], {
                type: "text/plain;charset=utf-8"
              });
              const url = window.URL.createObjectURL(dataBlob);
              let a = document.createElement("a");
              a.href = url;
              a.download = `${dayjs().format("YYYY-MM-DD导出数据")}.csv`;
              a.click();
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
              });
            }
          );
        })
        .finally(() => {
          loading.close();
        });
    },
    typeFormatter(row, column, value) {
      return this.typeOptions.find(el => el.value === value)?.label;
    },
    reset() {
      this.filters = {
        userId: "",
        type: "",
        success: "",
        userName: "",
        startTime: dayjs().format('YYYY-MM-DD'),
        endTime: ''
      };
      this.pagination = {
        currentPage: 1,
        total: 0
      };
    },
    search() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      const { query } = this;
      getRechargeListApi(query).then(res => {
        const { list, totalCount } = res;
        this.countList = totalCount;
        const { docs, page, totalDocs } = list;
        this.pagination.total = totalDocs;
        this.tableList = docs;
        this.pagination.currentPage = page;
      });
    }
  }
};
</script>
<style lang="scss">
.item-wrap {
  display: flex;
  flex-wrap: wrap;
  .item .el-card__body {
    padding: 5px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  .item + .item {
    margin-left: 10px;
  }
}
</style>