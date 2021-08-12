import dayjs from 'dayjs'
export default {
  data() {
    return {
      dialogVisible: false,
      pagination: {
        currentPage: 1,
        total: 0
      },
      tableList: []
    };
  },
  computed: {
    query({ filters, pagination }) {
      return { ...filters, ...pagination };
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    timeFormatter(row,column,value){
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },
    resetFilter() {
      this.reset();
      this.fetchData();
    }
  }
};
