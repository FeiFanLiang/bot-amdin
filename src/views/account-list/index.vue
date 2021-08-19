<template>
    <div class="app-container">
        <div class="table-form">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input clearable v-model.trim="filters.userId" placeholder="用户ID" ></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input clearable v-model="filters.accountName" placeholder="用户名"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table-box">
            <el-table :data="tableList">
              <el-table-column label="用户名" prop="accountName"></el-table-column>
              <el-table-column label="用户ID" prop="userId" ></el-table-column>
              <el-table-column label="人民币余额" prop="cny_balance" :formatter="amountFormatter">
               
              </el-table-column>
              <el-table-column label="USDT余额" prop="usdt_balance" :formatter="amountFormatter"></el-table-column>
              <el-table-column label="操作">
                  <template v-slot="scope">
                      <el-button type="primary" @click="handleShowBill(scope.row)">流水信息</el-button>
                      <el-button type="success" @click="handleEditAmount('1',scope.row)">充值</el-button>
                      <el-button type="warning" @click="handleEditAmount('0',scope.row)" >提现</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination :total="pagination.total" :current-page="pagination.currentPage" :page-size="30" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" ></el-pagination>
        </div>
        <el-dialog title="余额变动" :visible.sync="dialogVisible">
            <el-form label-position="left" label-width="100px" :rules="rules" :model="form" ref='form'>
              <el-form-item label="余额操作" prop="type">
                  <el-select v-model="form.type" disabled placeholder="请选择">
                    <el-option v-for="item of typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="账户类型" prop="balanceType">
                <el-select v-model="form.balanceType" placeholder="请选择">
                  <el-option v-for="item of accountTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
        <account-dialog :visible.sync="accountDialogShow" :userId="userId"></account-dialog>
    </div>
</template>
<script>
import {getAccountListApi,editAccountAmountApi} from '@/api/account'
import AccountDialog from './components/accountDialog'
export default {
    components:{
        AccountDialog
    },
    data(){
        return {
            accountDialogShow:false,
            dialogVisible:false,
            typeOptions:[
                {
                    label:"充值",
                    value:'1'
                },
                {
                    label:'提现',
                    value:'0'
                }
            ],
            accountTypeOptions:[
                {
                    label:'支付宝',
                    value:'CNY'
                },
                {
                    label:'USDT',
                    value:'USDT'
                }
            ],
            filters:{
                userId:"",
                accountName:''
            },
            pagination:{
                currentPage:1,
                total:0
            },
            tableList:[],
            editUser:{},
            userId:"",
            editType:"",
            form:{
                userId:"",
                amount:'',
                type:"",
                balanceType:""
            },
            rules:{
                amount:[
                    {
                        required:true,
                        message:"金额必填"
                    },
                    {
                        type:'number',
                        min:0.01,
                        message:"最小金额0.01"
                    }
                ],
                balanceType:[
                    {
                        required:true,
                        message:'账户类型必选',
                        trigger:"blur"
                    }
                ]
            }
        }
    },
    computed:{
        query({filters,pagination}){
            return {...filters,...pagination}
        }   
    },
    created(){
        this.fetchData()
    },
    methods:{
        handleShowBill(row){
            this.userId = row.userId
            this.accountDialogShow = true;
        },
        amountFormatter(row,column,value){
            return Math.ceil(value / 100)
        },
        handleCurrentChange(val){
            this.pagination.currentPage = val
            this.fetchData()
        },
        fetchData(){
            const {query} = this;
            getAccountListApi(query).then((res) => {
                const {docs,page,totalDocs} = res;
                this.pagination.total = totalDocs
                this.tableList = docs
                this.pagination.currentPage = page
            })
        },
        reset(){
            this.pagination = {
                 currentPage:1,
                total:0
            }
            this.filters = {
                userId:"",
                accountName:''
            }
        },
        resetFilter(){
            this.reset()
            this.fetchData()
        },
        handleEditAmount(type,row){
            this.form.userId = row.userId;
            this.form.type = type
            this.dialogVisible= true;
        },
        submit(){
            this.$refs['form'].validate().then(() =>{
                const {form} = this;
                return editAccountAmountApi(form)
            }).then(() => {
                this.dialogVisible = false;
                this.$refs['form'].resetFields()
                this.$message.success('操作成功')
                this.fetchData()
            })
        
        }
    }
}
</script>