<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="200px">
      <el-form-item label="USDT到ETH比率" prop="ethRate">
          <el-input-number :precision="2" v-model="form.ethRate" placeholder="输入"></el-input-number>
      </el-form-item>
      <el-form-item label="USDT到TRX比率" prop="trxRate">
          <el-input-number :precision="2" v-model="form.trxRate" placeholder="输入"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
     <el-form ref="handingForm" :rules="handingRules" :model="handingForm" label-width="200px">
      <el-form-item label="trc手续费" prop="trc">
          <el-input-number :precision="0" v-model="handingForm.trc" placeholder="输入"></el-input-number>
      </el-form-item>
      <el-form-item label="erc手续费(固定金额)" prop="erc">
          <el-input-number :precision="0" v-model="handingForm.erc" placeholder="输入"></el-input-number>
      </el-form-item>
      <el-form-item label="erc手续费(按比率)" prop="ercRate">
          <el-input-number :precision="3" v-model="handingForm.ercRate" placeholder="输入"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handingSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getEnergyApi,updateEnergyApi,getHandingFeeApi,updateHandingFeeApi} from '@/api/account'
export default {
  data() {
    return {
      form: {
        ethRate:'',
        trxRate:''
      },
      handingForm:{
        trc:'',
        erc:'',
        ercRate:''
      },
      rules:{
          ethRate:[
              {
                  required:true,
                  message:'必填'
              },
              {
                  type:"number",
                  min:0,
                  message:'最小是0'
              }
          ],
          trxRate:[
              {
                  required:true,
                  message:'必填'
              },
              {
                  type:"number",
                  min:0,
                  message:'最小是0'
              }
          ]
      },
      handingRules:{
        trc:[{
          required:true,
          message:'必填'
        }],
        erc:[
          {
          required:true,
          message:'必填'
        }
        ],
        ercRate:[
          {required:true,
          message:'必填'

          }
        ]
      }
    }
  },
  created(){
      getEnergyApi().then((res) => {
          if(res){
              this.form = {...res}
          }
      })
      getHandingFeeApi().then((res) => {
        if(res){
          this.handingForm = {...res}
        }
      })
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate().then(() => {
        updateEnergyApi(this.form).then((res) => {
          this.$message.success('更新成功')
      })
      })
    },
    handingSubmit(){
      this.$refs['handingForm'].validate().then(() => {
        updateHandingFeeApi(this.handingForm).then(() => {
          this.$message.success('更新成功')
        })
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

