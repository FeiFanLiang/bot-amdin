<template>
  <el-dialog title="流水信息" width="80%" append-to-body :visible.sync="popVisible">
     <div class="table-form">
      <el-form inline>
        <el-form-item>
          <el-select
            v-model="filters.updateType"
            clearable
            placeholder="流水类型"
          >
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.success" clearable placeholder="是否成功">
            <el-option
              v-for="item of successOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.fromUserId"
            clearable
            placeholder="付款人ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.fromUserName"
            clearable
            placeholder="付款人用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.fromUserNickName"
            clearable
            placeholder="付款人昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.toUserId"
            clearable
            placeholder="收款人ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.toUserName"
            clearable
            placeholder="收款人用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filters.toUserNickName"
            clearable
            placeholder="收款人昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.originType"
            clearable
            placeholder="充值原币类型"
          >
            <el-option
              v-for="item of accountType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.exchangeType"
            clearable
            placeholder="兑换目标货币"
          >
            <el-option
              v-for="item of accountType"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetFilter">重置</el-button>
      <el-button type="warning" @click="countData">按当前条件查看统计</el-button>
    </div>
   <div class="table-box">
      <el-table
        :border="false"
        :data="tableList"
        :highlight-current-row="false"
      >
        <el-table-column label="付款人用户名">
          <template v-slot="scope">
            <span style="cursor:pointer"  v-clipboard:copy="scope.row.fromUserName"> @{{ scope.row.fromUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款人" align="center">
          <template v-slot="scope">
            <el-popover placement="top" trigger="click">
              <div class="item">
                <span>昵称：{{ scope.row.fromUserNickName }}</span>
                <span>用户名：{{ scope.row.fromUserName }}</span>
                <span>ID：{{ scope.row.fromUserId }}</span>
              </div>
              <el-button type="text" slot="reference">{{
                scope.row.fromUserNickName
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="流水" align="center">
          <template v-slot="scope">
            <el-popover placement="top" trigger="click">
              <div class="item">
                <span
                  >余额：{{ scope.row.afterAmount }}
                  {{ scope.row.type.toUpperCase() }}</span
                >
                <span v-if="scope.row.rate"> 汇率： {{ scope.row.rate }} </span>
                <span v-if="scope.row.exchangeType">
                  目标货币：{{ scope.row.exchangeType.toUpperCase() }}
                </span>
                <span v-if="scope.row.exchangeAmount">
                  兑换金额：{{ scope.row.exchangeAmount }}
                </span>
                <span v-if="scope.row.orginAmount">
                  充值原币金额：{{ scope.row.orginAmount }}
                  {{ scope.row.originType.toUpperCase() }}
                </span>
                <span v-if="scope.row.handingFee">
                  手续费：{{ scope.row.handingFee }}
                </span>
                <span v-if="scope.row.address">
                  提现地址：{{ scope.row.address }}
                </span>
                <span v-if="scope.row.name">
                  提现姓名：{{ scope.row.name }}
                </span>
              </div>
              <el-button type="text" slot="reference"
                >{{ getSymbol(scope.row.updateType) }} {{ scope.row.amount }}
                {{ scope.row.type.toUpperCase() }}</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template v-slot="scope">
            <span>{{ typeFormatter(scope.row.updateType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" align="center">
          <template v-slot="scope">
            {{ scope.row.afterAmount }} {{ scope.row.type.toUpperCase() }}
          </template>
        </el-table-column>
        <el-table-column label="收款人昵称" align="center">
          <template v-slot="scope">
            <el-popover placement="top" trigger="click">
              <div class="item">
                <span>昵称：{{ scope.row.toUserNickName }}</span>
                <span>用户名：{{ scope.row.toUserName }}</span>
                <span>ID：{{ scope.row.toUserId }}</span>
              </div>
              <el-button type="text" slot="reference">{{
                scope.row.toUserNickName
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="收款人用户名" align="center">
          <template v-slot="scope">
           <span style="cursor:pointer" v-clipboard:copy="scope.row.toUserName"> @{{ scope.row.toUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="80px"
          label="备注"
          prop="remark"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          width="230px"
          label="是否成功"
          prop="success"
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.success ? "成功" : "未完成" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理人" align="center">
          <template v-slot="scope">
            <a
              v-if="scope.row.confirmUserId"
              class="userLink"
              :href="`https://t.me/${scope.row.confirmUserName}`"
              target="__blank"
            >
              <span> @{{ scope.row.confirmNickName }}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="140px"
          label="创建时间"
          prop="createTime"
          :formatter="timeFormatter"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <el-dialog title="流水统计" :visible.sync="countDialogShow" append-to-body>
      <div class="table-box">
      <el-table :data="countList" border>
        <el-table-column label="交易类型" prop="updateType" align="center">
          <template v-slot="scope">{{ typeFormatter(scope.row.updateType) }}</template>
        </el-table-column>
        <el-table-column label="交易币种" prop="type" align="center">
          <template v-slot="scope">
            {{getAmountType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="交易总金额" prop="total" align="center"></el-table-column>
      </el-table>
    </div>
    </el-dialog>
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
import { getRechargeListApi,getCountDataApi } from "@/api/recharge";
import dayjs from 'dayjs'
export default {
  mixins: [TableEditMixins],
  props: {
    userId: {},
    visible: Boolean
  },
  data() {
    return {
     countList: [],
     countDialogShow:false,
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
      accountType: [
        {
          label: "人民币",
          value: "cny"
        },
        {
          label: "美元",
          value: "usd"
        },
        {
          value: "trc",
          label: "USDT-TRC"
        },
        {
          value: "erc",
          label: "USDT-ERC"
        },
        {
          value: "usdt",
          label: "USDT"
        },
        {
          value: "aed",
          label: "越南盾"
        },
        {
          value: "xb",
          label: "新币"
        },
        {
          value: "eth",
          label: "ETH"
        },
        {
          value: "trx",
          label: "TRX"
        },
        {
          value: "php",
          label: "比索"
        },
        {
          value: "rm",
          label: "令吉"
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
          label: "收款",
          value: "rTrans"
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
        updateType: "",
        type: "",
        fromUserId: "",
        fromUserName: "",
        fromUserNickName: "",
        toUserId: "",
        toUserName: "",
        toUserNickName: "",
        originType: "",
        exchangeType: "",
        success: "",
        startTime: '',
        endTime: ""
      },
    };
  },
  computed: {
    popVisible: {
      get({ visible }) {
        return visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    popVisible(val) {
      if (val) {
        this.fetchData()
      } else {
        this.reset()
      }
    }
  },
  methods: {
    countData(){
      this.countDialogShow = true;
      const loading = this.$loading({
        lock: true,
        text: "加载中.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getCountDataApi(this.filters).then((res) => {
        this.countList = res;
      }).finally(() => {
        loading.close()
      })
    },
    getSymbol(type) {
      if (
        type === "trans" ||
        type === "sub" ||
        type === "pack_out" ||
        type === "exchange"
      ) {
        return "-";
      } else {
        return "+";
      }
    },
     getRecordType(value) {
      switch (value) {
        case "add":
          return "充值";
        case "sub":
          return "提现";
        case "trans":
          return "转账";
        case "rTrans":
          return "收款";
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
          return "越南盾";
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

    typeFormatter(value) {
      return this.typeOptions.find(el => el.value === value)?.label;
    },
     reset() {
      this.filters = {
        userId: "",
        updateType: "",
        type: "",
        fromUserId: "",
        fromUserName: "",
        fromUserNickName: "",
        toUserId: "",
        toUserName: "",
        toUserNickName: "",
        originType: "",
        exchangeType: "",
        success: "",
        startTime: '',
        endTime: ""
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
      query.userId = this.userId;
      const loading = this.$loading({
        lock: true,
        text: "加载中.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getRechargeListApi(query).then(res => {
        const { docs, page, totalDocs } = res;
          this.pagination.total = totalDocs;
          this.tableList = docs;
          this.pagination.currentPage = page;
      }).finally(() => {
        loading.close()
      })
    }
  }
};
</script>
<style lang="scss">
.item .el-card__body {
  padding: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}
.el-table--mini td, .el-table--mini th {
  padding: 3px 0;
}
.item {
  padding: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
}
</style>
