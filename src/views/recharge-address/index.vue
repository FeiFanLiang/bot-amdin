<template>
    <div class="app-container">
        <el-form :model="form">
          <el-form-item label="支付宝收款账号" required prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(1)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="trcForm">
          <el-form-item label="trc20收款地址" required prop="address">
              <el-input v-model="trcForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(2)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="ercForm">
          <el-form-item label="erc20收款地址" required prop="address">
              <el-input v-model="ercForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(3)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="usdForm">
          <el-form-item label="美元收款地址" required prop="address">
              <el-input v-model="usdForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(4)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="rmForm">
          <el-form-item label="马来西亚令吉收款地址" required prop="address">
              <el-input v-model="rmForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(5)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="phpForm">
          <el-form-item label="菲律宾比索收款地址" required prop="address">
              <el-input v-model="phpForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(6)">保存</el-button>
          </el-form-item>
        </el-form>
         <el-form :model="aedForm">
          <el-form-item label="迪拜迪拉姆收款地址" required prop="address">
              <el-input v-model="aedForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(7)">保存</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {getAlipayAddressApi,updateAlipayAddressApi} from '@/api/recharge'
export default {
    data(){
        return {
            form:{
                address:''
            },
            trcForm:{
                address:""
            },
            ercForm:{
                address:""
            },
             aedForm:{
                address:""
            },
            usdForm:{
                address:""
            },
            rmForm:{
                address:""
            },
             phpForm:{
                address:""
            },
        }   
    },
    created(){
        getAlipayAddressApi({type:"cny"}).then((res) =>{
            this.form.address = res?.address
        })
         getAlipayAddressApi({type:"trc20"}).then((res) =>{
            this.trcForm.address = res?.address
        })
         getAlipayAddressApi({type:"erc20"}).then((res) =>{
            this.ercForm.address = res?.address
        })
         getAlipayAddressApi({type:"aed"}).then((res) =>{
            this.aedForm.address = res?.address
        })
         getAlipayAddressApi({type:"usd"}).then((res) =>{
            this.usdForm.address = res?.address
        })
         getAlipayAddressApi({type:"rm"}).then((res) =>{
            this.rmForm.address = res?.address
        })
        getAlipayAddressApi({type:"php"}).then((res) =>{
            this.phpForm.address = res?.address
        })
    },
    methods:{
        submit(number){
            let data;
            if(number === 1){
                data = {...this.form,type:'cny'}
            }
            if(number === 2){
                data = {...this.trcForm,type:'trc20'}
            }
            if(number === 3){
                data = {...this.ercForm,type:'erc20'}
            }
            if(number === 4){
                data = {...this.usdForm,type:'usd'}
            }
            if(number === 5){
                data = {...this.usdForm,type:'rm'}
            }
            if(number === 6){
                data = {...this.phpForm,type:"php"}
            }
            if(number === 7){
                data = {...this.aedForm,type:'aed'}
            }
            updateAlipayAddressApi(data).then(() => {
                this.$message.success('更新成功')
            })
        }
    }
}
</script>