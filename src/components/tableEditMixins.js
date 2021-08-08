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
