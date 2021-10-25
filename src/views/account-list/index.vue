<template>
  <div class="app-container">
    <div class="table-form">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input clearable v-model.trim="filters.userId" placeholder="用户ID"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input clearable v-model="filters.accountName" placeholder="用户名"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.sort" placeholder="货币排序" clearable>
            <el-option
              v-for="item of sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.hasTitle" clearable placeholder="是否认证">
            <el-option v-for="item of [{value:'true',label:'已认证'}]" :key="item.label" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.hasBlock" clearable placeholder="是否在黑名单">
            <el-option v-for="item of [{value:'true',label:'已拉黑'}]" :key="item.label" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="warning" @click="download">按搜索条件导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="count">
      <span>人民币总计:{{ countData.cny }}</span>
      <span>usdt总计:{{ countData.usdt }}</span>
      <span>美金总计:{{ countData.usd }}</span>
      <span>披索总计:{{ countData.php }}</span>
      <span>令吉总计:{{ countData.rm }}</span>
      <span>越南盾总计:{{ countData.aed }}</span>
    </div>
    <div class="table-box">
      <el-table :data="tableList">
        <el-table-column label="用户名" prop="accountName"></el-table-column>
        <el-table-column label="用户ID" prop="userId"></el-table-column>
        <el-table-column label="用户昵称" prop="nickName"></el-table-column>
        <el-table-column label="人民币余额" prop="cny_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="USDT余额" prop="usdt_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="USD余额" prop="usd_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="令吉余额" prop="rm_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="披索余额" prop="php_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="越南盾余额" prop="aed_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="新币余额" prop="xb_balance" :formatter="amountFormatter"></el-table-column>
        <el-table-column label="认证标签" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column label="黑名单状态">
          <template v-slot="scope">
            <el-switch :value="scope.row.inBlack" @change="handleChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="500">
          <template v-slot="scope">
            <el-button type="primary" @click="handleShowBill(scope.row)">流水信息</el-button>
            <el-button type="primary" @click="handleChangeTitle(scope.row)">认证</el-button>
            <el-button
              type="success"
              @click="handleEditAmount('1', scope.row)"
              v-if="$store.getters.role === 'admin' || $store.getters.permission.includes('amount_edit')"
            >充值</el-button>
            <el-button
              type="warning"
              @click="handleEditAmount('0', scope.row)"
              v-if="$store.getters.role === 'admin' || $store.getters.permission.includes('amount_edit')"
            >提现</el-button>
            <el-button
              v-if="$store.getters.role === 'admin'"
              type="warning"
              @click="handleResetPass(scope.row)"
            >重置密码</el-button>
            <el-button v-if="$store.getters.role === 'admin'" type="warning" @click="handleLink(scope.row)">通知频道</el-button>
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
      <el-form label-position="left" label-width="100px" :rules="rules" :model="form" ref="form">
        <el-form-item label="余额操作" prop="type">
          <el-select v-model="form.type" disabled placeholder="请选择">
            <el-option
              v-for="item of typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型" prop="balanceType">
          <el-select v-model="form.balanceType" placeholder="请选择">
            <el-option
              v-for="item of accountTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number :min="0.01" :precision="2" v-model="form.amount" placeholder="输入金额"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确认操作</el-button>
        <el-button>取消操作</el-button>
      </template>
    </el-dialog>
    <el-dialog title="收款通知频道" :visible.sync="linkDialogShow">
      <el-form :model="linkForm">
        <el-form-item label="频道号" prop="link">
          <el-input v-model="linkForm.link" placeholder="频道号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="updateLink" >保存</el-button>
      </template>
    </el-dialog>
    <el-dialog title="用户认证信息" :visible.sync="titleDialogVisible">
      <el-input v-model="userTitle.title" type="textarea" placeholder="输入认证信息"></el-input>
      <el-button style="margin-top:20px" @click="titleSubmit">保存</el-button>
    </el-dialog>
    <account-dialog :visible.sync="accountDialogShow" :userId="userId"></account-dialog>
  </div>
</template>
<script>
import {
  getAccountListApi,
  editAccountAmountApi,
  getAmountCountApi,
  updateAccessApi,
  updateCertApi,
  restPassApi,
  downloadAccountCsvApi,
  updateUserLinkApi
} from "@/api/account";
import AccountDialog from "./components/accountDialog";
import stringify from "csv-stringify";
import dayjs from 'dayjs';
export default {
  components: {
    AccountDialog
  },
  data() {
    return {
      linkDialogShow:false,
      accountDialogShow: false,
      titleDialogVisible: false,
      dialogVisible: false,
      linkForm:{
        userId:"",
        link:""
      },
      userTitle: {
        userId: '',
        title: ""
      },
      typeOptions: [
        {
          label: "充值",
          value: "1"
        },
        {
          label: "提现",
          value: "0"
        }
      ],
      accountTypeOptions: [
        {
          label: "人民币",
          value: "cny"
        },
        {
          label: "USDT",
          value: "usdt"
        },
        {
          label: "美元",
          value: "usd"
        },
        {
          label: "PHP",
          value: "php"
        },
        {
          label: "RM",
          value: "rm"
        },
        {
          label: "VND",
          value: "aed"
        },
        {
          label: "XB",
          value: 'xb'
        }
      ],
      sortOptions: [
        {
          value: 'cny_balance',
          label: '人民币'
        },
        {
          value: 'usd_balance',
          label: 'USD'
        },
        {
          value: 'usdt_balance',
          label: 'USDT'
        },
        {
          value: 'aed_balance',
          label: 'VND'
        },
        {
          value: 'php_balance',
          label: 'PHP'
        },
        {
          value: "rm_balance",
          label: "RM"
        },
        {
          value: 'xb_balance',
          label: "XB"
        }
      ],
      filters: {
        userId: "",
        accountName: "",
        sort: "",
        hasTitle:'',
        hasBlock:''
      },
      pagination: {
        currentPage: 1,
        total: 0
      },
      countData: {
        cny: "",
        usdt: "",
        usd: "",
        aed: "",
        php: "",
        rm: ""
      },
      tableList: [],
      editUser: {},
      userId: "",
      editType: "",
      form: {
        userId: "",
        amount: "",
        type: "",
        balanceType: ""
      },
      rules: {
        amount: [
          {
            required: true,
            message: "金额必填"
          },
          {
            type: "number",
            min: 0.01,
            message: "最小金额0.01"
          }
        ],
        balanceType: [
          {
            required: true,
            message: "账户类型必选",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    query({ filters, pagination }) {
      return { ...filters, ...pagination };
    }
  },
  created() {
    this.fetchData();
    this.getAmount();
  },
  methods: {
    handleLink(row){
      this.linkForm = {
        userId:row.userId,
        link:row.link
      }
      this.linkDialogShow = true
    },
    updateLink(){
      updateUserLinkApi(this.linkForm).then(() => {
        this.$message.success('操作成功')
        this.linkDialogShow = false
        this.fetchData()
      })
    },
    download() {
      const loading = this.$loading({
        lock: true,
        text: "正在下载.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      downloadAccountCsvApi(this.filters).then((list) => {
        list.forEach(item => {
          item.cny_balance = (item.cny_balance / 100).toFixed(2)
          item.usd_balance = item.usd_balance ? (item.usd_balance / 100).toFixed(2) : 0,
            item.usdt_balance = (item.usdt_balance / 100).toFixed(2)
          item.aed_balance = item.aed_balance ? (item.aed_balance / 100).toFixed(2) : 0
          item.rm_balance = item.rm_balance ? (item.rm_balance / 100).toFixed(2) : 0
          item.php_balance = item.php_balance ? (item.php_balance / 100).toFixed(2) : 0
          item.xb_balance = item.xb_balance ? (item.xb_balance / 100).toFixed(2) : 0
          item.createTime = dayjs(item.createTime).format('YYYY/MM/DD HH:mm:ss')
        })
        stringify(
          list,
          {
            header: true,
            columns: [
              { key: "accountName", header: "用户名" },
              { key: "nickName", header: "昵称" },
              { key: "cny_balance", header: '人民币余额' },
              { key: 'usd_balance', header: '美元余额' },
              { key: 'usdt_balance', header: 'USDT余额' },
              { key: 'xb_balance', header: '新币余额' },
              { key: 'aed_balance', header: '迪拉姆余额' },
              { key: 'rm_balance', header: '越南盾余额' },
              { key: 'php_balance', header: '比索余额' },
              { key: 'cny_account', header: '人民币账户' },
              {
                key: "cny_name", header: '人民币提现姓名'
              },
              { key: "trc_account", header: 'TRC20提现地址' },
              { key: 'createTime', header: '创建时间' }
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
      }).finally(() => {
        loading.close()
      })
    },
    handleResetPass(row) {
      const data = {
        userId: row.userId
      }
      restPassApi(data).then(() => {
        this.$message.success('操作成功')
      })
    },
    handleChange(row) {
      const data = {
        userId: row.userId,
        inBlack: !row.inBlack
      };
      updateAccessApi(data).then(() => {
        this.$message.success('操作成功')
        this.fetchData();
      });
    },
    getAmount() {
      getAmountCountApi().then(res => {
        if (res[0]) {
          this.countData = {
            cny: res[0].cny_total / 100,
            usdt: res[0].usdt_total / 100,
            usd: res[0].usd_total / 100,
            rm: res[0].rm_total / 100,
            php: res[0].php_total / 100,
            aed: res[0].aed_total / 100,
            xb: res[0].xb_total / 100
          };
        }
      });
    },
    handleChangeTitle(row) {
      this.userTitle = {
        userId: row.userId,
        title: row.title
      }
      this.titleDialogVisible = true
    },
    titleSubmit() {
      updateCertApi(this.userTitle).then(() => {
        this.$message.success('操作成功')
        this.fetchData()
        this.titleDialogVisible = false;
      })
    },
    search() {
      this.pagination.currentPage = 0;
      this.fetchData();
    },
    handleShowBill(row) {
      this.userId = row.userId;
      this.accountDialogShow = true;
    },
    amountFormatter(row, column, value) {
      if (!value) {
        return 0;
      }
      return (value / 100).toFixed(2)
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      const { query } = this;
      const loading = this.$loading({
        lock: true,
        text: "正在搜索.....",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getAccountListApi(query)
        .then(res => {
          const { docs, page, totalDocs } = res;
          this.pagination.total = totalDocs;
          this.tableList = docs;
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
        userId: "",
        accountName: "",
        sort: "",
        hasTitle:'',
        hasBlock:''
      };
    },
    resetFilter() {
      this.reset();
      this.fetchData();
    },
    handleEditAmount(type, row) {
      this.form.userId = row.userId;
      this.form.type = type;
      this.dialogVisible = true;
    },
    submit() {
      this.$refs["form"]
        .validate()
        .then(() => {
          const { form } = this;
          return editAccountAmountApi(form);
        })
        .then(() => {
          this.dialogVisible = false;
          this.$refs["form"].resetFields();
          this.$message.success("操作成功");
          this.fetchData();
        });
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
