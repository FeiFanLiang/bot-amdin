<template>
  <el-dialog title="流水信息" width="80%" :visible.sync="popVisible">
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
    </div>
    <div class="table-box">
      <el-table
        :border="false"
        :data="tableList"
        :highlight-current-row="false"
      >
        <el-table-column label="付款信息" align="center">
          <template v-slot="scope">
            <el-card shadow="hover" class="item">
              <span>{{ scope.row.fromUserNickName }}</span>
              <span>{{ scope.row.fromUserName }}</span>
              <span>{{ scope.row.fromUserId }}</span>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column label="收款信息" align="center">
          <template v-slot="scope">
            <el-card shadow="hover" class="item">
              <span>{{ scope.row.toUserNickName }}</span>
              <span>{{ scope.row.toUserName }}</span>
              <span>{{ scope.row.toUserId }}</span>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column label="交易信息" align="center">
          <template v-slot="scope">
            <el-card shadow="hover" class="item">
              <span>{{ scope.row.amount }}</span>
              <span>{{ scope.row.type.toUpperCase() }}</span>
              <span>{{ typeFormatter(scope.row.updateType) }}</span>
              <span>交易前余额：{{ scope.row.beforeAmount }}</span>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column label="余额信息" align="center">
          <template v-slot="scope">
            <el-card shadow="hover" class="item">
              <span>{{ scope.row.afterAmount }}</span>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column label="附加信息" align="center">
          <template v-slot="scope">
            <el-card shadow="hover" class="item">
              <span v-if="scope.row.rate"> 汇率： {{ scope.row.rate }} </span>
              <span v-if="scope.row.exchangeType">
                目标货币：{{ scope.row.exchangeType.toUpperCase() }}
              </span>
              <span v-if="scope.row.exchangeAmount">
                兑换金额：{{ scope.row.exchangeAmount }}
              </span>
              <span v-if="scope.row.originType">
                充值原币：{{ scope.row.originType.toUpperCase() }}
              </span>
              <span v-if="scope.row.orginAmount">
                充值原币金额：{{ scope.row.orginAmount }}
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
            </el-card>
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
          width="200px"
          label="是否成功"
          prop="success"
          align="center"
        >
          <template v-slot="scope">
            <div class="item">
              <span>{{ scope.row.success ? "成功" : "未完成" }}</span>
              <span v-if="scope.row.confirmNickName">
                处理人昵称：{{ scope.row.confirmNickName }}
              </span>
              <span v-if="scope.row.confirmUserId">
                处理人Id：{{ scope.row.confirmUserId }}
              </span>
              <span v-if="scope.row.fromBackEnd">
                (后台操作)
              </span>
            </div>
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
    <el-divider content-position="center">当前流水统计</el-divider>
    <div class="table-box">
      <el-table :data="countList" border>
        <el-table-column label="交易类型" prop="updateType" align="center">
          <template v-slot="scope">
            {{typeFormatter(scope.row.updateType)}}
          </template>
        </el-table-column>
        <el-table-column label="交易币种" prop="type" align="center"></el-table-column>
        <el-table-column label="交易总金额" prop="total" align="center"></el-table-column>
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
          label: "迪拉姆"
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
          label: "越南盾"
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
        startTime: dayjs().format("YYYY-MM-DD"),
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
        startTime: dayjs().format("YYYY-MM-DD"),
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
        const { list, totalCount } = res;
        this.countList = totalCount;
        const { docs, page, totalDocs } = list;
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
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}
.item {
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}
</style>
