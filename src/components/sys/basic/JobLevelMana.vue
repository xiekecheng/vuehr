<template>
    <div>
        <div>
            <el-input
                    class="addJobBtn"
                    size="small"
                    placeholder="请输入姓名..."
                    prefix-icon="fa fa-plus"
                    v-model="postData.name">
            </el-input>
            <el-select v-model="postData.titleLevel" placeholder="职称等级" size="small">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button style="margin-left: 5px" size="small" type="primary" icon="el-icon-plus" @click="postTableData">
                添加
            </el-button>
        </div>
        <div class="jobTableMana">
            <el-table
                    :data="tableData"
                    size="small"
                    border
                    stripe
                    style="width: 85%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        width="180"
                        label="职称">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        width="180"
                        label="创建时间">
                </el-table-column>

                <el-table-column
                        prop="enable"
                        width="120"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>

                </el-table-column>


                <el-table-column
                        prop="ops"

                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click="handleEdit(scope.$index, scope.row)"
                                size="mini">编辑

                        </el-button>
                        <el-button
                                size="mini"
                                @click="handleDelete(scope.$index, scope.row)"
                                type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                    size="mini"
                    style="margin-top: 8px"
                    type="danger"
                    :disabled="multipleSelection.length==0"
                    @click="batchDelete">批量删除
            </el-button>
        </div>

        <el-dialog
                title="修改职称"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职位名称</el-tag>
                        </td>
                        <td>
                            <el-input style="width: 200px; margin-left: 8px" class="updateJobInput" size="small"
                                      v-model="updateJob.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称等级</el-tag>
                        </td>
                        <td>
                            <el-select style="margin-left: 8px" v-model="updateJob.titleLevel" placeholder="请选择职称"
                                       size="small">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch
                                    v-model="updateJob.enabled"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </td>
                    </tr>

                </table>


            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="confirm">确 定</el-button>
  </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                dialogVisible: false,
                input: '',
                updateJob: {
                    name: '',
                    titleLevel: '',
                    enabled: false
                },
                options: [{
                    value: '正高级',
                    label: '正高级'
                }, {
                    value: '副高级',
                    label: '副高级'
                }, {
                    value: '中级',
                    label: '中级'
                }, {
                    value: '初级',
                    label: '初级'
                }, {
                    value: '员级',
                    label: '员级'
                }],
                postData: {
                    name: '',
                    titleLevel: ''
                },
                value: '',
                tableData: [{
                    id: '2016-05-02',
                    name: '王小虎',
                    titleLevel: '上海市普陀区金沙江路 1518 弄',
                }, {
                    id: '2016-05-04',
                    name: '王小虎',
                    titleLevel: '上海市普陀区金沙江路 1518 弄'
                }, {
                    id: '2016-05-01',
                    name: '王小虎',
                    titleLevel: '上海市普陀区金沙江路 1518 弄',
                }, {
                    id: '2016-05-03',
                    name: '王小虎',
                    titleLevel: '上海市普陀区金沙江路 1518 弄'
                }],
                multipleSelection: []
            }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;

            },
            getTableData() {
                this.getRequest("/system/basic/job/").then(resp => {
                    this.tableData = resp;
                })
            },
            postTableData() {
                // console.log(this.postData.name + ":" + this.postData.titleLevel);
                this.postRequest("/system/basic/job/", this.postData).then(resp => {
                    if (resp) {
                        this.getTableData();
                        this.postData.name = '';
                        this.postData.titleLevel = '';

                    }
                })
            },
            // 编辑职称
            handleEdit(index, data) {
                this.dialogVisible = true;
                Object.assign(this.updateJob, data);
                console.log(data);
                console.log(this.updateJob.titleLevel);
            },
            // 删除职称
            handleDelete(index, data) {

                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/job/" + data.id).then(resp => {
                        if (resp) {
                            this.getTableData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            //批量删除
            batchDelete() {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = "/system/basic/job/";
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                            ids += 'ids=' + item.id + '&'
                        }
                    )
                    this.deleteRequest(url + ids).then(resp => {
                        if (resp) {
                            this.getTableData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


                let ids = '?';
                this.multipleSelection.forEach(item => {

                    }
                )


            },
            confirm() {
                this.putRequest("/system/basic/job/", this.updateJob).then(resp => {
                    if (resp) {
                        this.getTableData();
                        this.dialogVisible = false;
                    }
                })

            }
        }
    }
</script>

<style scoped>
    .addJobBtn {
        width: 300px;
        margin-right: 8px;
    }

    .jobTableMana {
        margin-top: 10px;
    }

    .updateJobInput {

    }
</style>