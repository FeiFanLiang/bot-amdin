<template>
    <div class="app-container">
        <el-button type="success" @click="handleAdd">新增用户</el-button>
        <el-table :data="data" border>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="权限" prop="permission"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="warning" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogShow">
            <el-form :model="form" :rules="rules">
                <el-form-item label="用户名" prop="username" v-if="!isEdit">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!isEdit">
                    <el-input
                        v-model="form.password"
                        :min="6"
                        :max="12"
                        show-password
                        placeholder="密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-select v-model="form.permission" placeholder="权限"></el-select>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="passDialogShow">
            <el-form :model="passForm" :rules="rules">
                <el-form-item label="新密码" prop="password">
                    <el-input
                        v-model="passForm.password"
                        :min="6"
                        :max="12"
                        show-password
                        placeholder="新密码"
                    ></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { getUserListApi, editUserApi, deleteUserApi } from '@/api/role'
export default {
    data() {
        return {
            data: [],
            form: {
                _id: '',
                username: "",
                permission: []
            },
            passForm: { password: "", },
            dialogShow: false,
            passDialogShow: false,
            isEdit: true,
            rules: {
                username: [
                    {
                        required: true,
                        message: '用户名必填'
                    },
                    {
                        type: "string",
                        max: 12,
                        min: 3,
                        message: "3-12位长度"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码必填'
                    },
                    {
                        type: "string",
                        max: 12,
                        min: 6,
                        message: '6-12位长度'
                    }
                ]
            }
        }
    },
    created() {

    },
    methods: {
        handleAdd() {
            this.form = {
                _id: '',
                username: '',
                password: '',
                permission: []
            }
        },
        handleEdit(row) {
            this.form = { ...row }
        },
        fetchData() {
            getUserListApi().then((res) => { this.data = res })
        },
        deleteUser(row) {
            this.$confirm('是否删除此用户?', '确认删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteUserApi({
                    id: row._id
                }).then(() => {
                    this.$message.success('删除成功')
                    this.fetchData()
                })
            })
        },

    }
}

</script>