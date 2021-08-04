export default {
    methods:{
        /**
         * 统一进行表单校验错误处理
         * @param {String} form 
         */
        validateForm(form){
            return this.$refs[form].validate().then(() => {},() => {
                this.$message({
                    type:"error",
                    message:'表单填写错误，请检查输入',
                    showClose:true
                })
                return Promise.reject()
            })
        }
    }
}