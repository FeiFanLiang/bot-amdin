<template>
    <div class="app-container">
        <h3>屏蔽ID字段</h3>
        <el-form :model="ruleForm">
          <el-form-item label="过滤字段" prop="rule" >
              <el-input type="number" v-model="ruleForm.rule" placeholder="过滤字段"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitRule">保存</el-button>
        </el-form>
        <h4>白名单</h4>
        <el-form :model="whiteForm">
          <el-form-item label="白名单" prop="values">
              <el-input type="textarea" autosize v-model="whiteForm.values" placeholder="输入白名单ID,多个以回车换行"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitWhite">保存</el-button>
        </el-form>
    </div>
</template>
<script>
import {updateWhiteApi,updateFilterRuleApi,getWhiteApi,getFilterRuleApi} from '@/api/account'
export default {
    data(){
        return {
            ruleForm:{
                rule:''
            },
            whiteForm:{
                values:''
            }
        }
    },
    created(){
        getWhiteApi().then((res) => {
            this.whiteForm.values = res[0]?.list?.join('\n')
            
        })
        getFilterRuleApi().then((res) => {
            this.ruleForm.rule = res?.rule
        })
    },
    methods:{
        submitWhite(){
            const ids = this.whiteForm.values.split('\n').map(el => el.replace(/\s/g,'')).filter(el => el)
            updateWhiteApi({ids}).then(() => {
                this.$message.success('保存成功')
            })
        },
        submitRule(){
            updateFilterRuleApi({...this.ruleForm}).then(() => {
                this.$message.success('保存成功')
            })
        }
    }
}
</script>