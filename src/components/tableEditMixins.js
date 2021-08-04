export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 30,
      dialogShow: false,
      loading: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleAdd() {
      this.dialogShow = true;
    },
    handleChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      const { currentPage, pageSize } = this;
      this.getList(currentPage, pageSize)
        .then((res) => {
          const { docs, totalDocs, limit, page } = res;
          this.total = totalDocs;
          this.tableData = docs;
          this.pageSize = limit;
          this.currentPage = page;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(data) {
      this.dialogShow = true;
      this.form = Object.assign({}, data);
      this.$refs['tinymece'] && this.$refs['tinymece'].setContent(this.form.content);
    },
    handleDelete(id, index) {
      this.delete(id).then(() => {
        this.$message.success("删除成功");
        this.tableData.splice(index, 1);
      });
    },
    submit(formName) {
      const { form } = this;
      return this.validateForm(formName).then(() => {
        return this.update(form).then(res => {
          this.dialogShow = false;
          this.$message.success("操作成功");
          this.fetchData();
        });
      });
    }
  },
  watch:{
    dialogShow(val){
        if(!val){
            this.initForm();
            this.$nextTick(() => {
                this.resetForm()
            })
        }
    }
  }
};
