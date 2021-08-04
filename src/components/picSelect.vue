<script>
import {getAllFileApi} from '@/api/files';
export default {
    props:{
        value:{}
    },
    data(){
        return {
            options:[]
        }
    },
    computed:{
        selectVal:{
            get(){
                return this.value
            },
            set(val){
                this.$emit('input',val);
                this.$emit('change',val)
            }
        }
    },
    created(){
        this.getOption()
    },
    methods:{
        getOption(){
            getAllFileApi().then((res) => {
                this.options = res;
            })
        }
    },
    render(){
        return (
            <el-select vModel={this.selectVal} collapse-tags  {...{props:{...this.$attrs,filterable:true}}} >
                {
                    this.options.map(option => (
                        <el-option key={option.id} value={option.url} label={option.name}></el-option>
                    ))
                }
            </el-select>
        )
    }
}
</script>