<template>
    <div>
        <div>
            <el-input
                    class="addPosInput"
                    size="small"
                    placeholder="请输入要添加的职位名"
                    prefix-icon="fa fa-plus"
                    v-model="pos.name"
                    @keydowm.enter.native="addPosition">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
        </div>

        <div class="posManaDiv">
            <el-table
                    :data="positions"
                    size="small"
                    stripe
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 70%">
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
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"

                        label="创建时间">

                </el-table-column>
                <el-table-column
                        prop="ops"

                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                    size="small"
                    type="danger"
                    style="margin-top: 8px"
                    :disabled="SelectionChange.length==0"
                    @click="batchDelete">批量删除
            </el-button>
        </div>

        <el-dialog
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="confirm">确 定</el-button>
  </span>
        </el-dialog>


    </div>
</template>

<script>
    import {putRequest} from "../../../utils/api";

    export default {
        data() {
            return {
                dialogVisible: false,
                SelectionChange: [],
                checkbox: [],
                pos: {
                    name: ''
                },
                updatePos: {
                    name: ''
                },
                positions: []
            }
        },
        mounted: function () {
            // `this` 指向 vm 实例
            this.initPos();
        },
        methods: {
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            this.initPos();
                            this.pos.name = '';
                        }
                    })


                } else {
                    this.$message({
                        message: '请输入职位',
                        type: 'warning'
                    });
                }

            },
            batchDelete() {
                this.$confirm('此操作将永久删除[' + this.SelectionChange.length + ']个职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.SelectionChange.forEach(item => {
                        ids += 'id=' + item.id + '&'
                    })
                    console.log(ids);

                    this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
                        if (resp) {
                            //刷新表格
                            this.initPos();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            initPos() {
                this.getRequest("/system/basic/pos/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            handleEdit(index, data) {
                this.dialogVisible = true;
                // this.updatePos = data;
                Object.assign(this.updatePos, data);


            },
            confirm() {
                putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                    if (resp) {
                        this.initPos();
                        this.dialogVisible = false;
                        this.updatePos.name = '';
                    }
                })

            },
            handleDelete(index, data) {
                console.log('index:' + index + '==data:' + data)
                this.$confirm('此操作将永久[' + data.name + ']职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                        if (resp) {
                            //刷新表格
                            this.initPos();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                console.log(val);
                this.SelectionChange = val;
            }
        }

    }
</script>

<style scoped>
    .addPosInput {
        width: 300px;
        margin-right: 8px;
    }

    .posManaDiv {
        margin-top: 10px;
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }

</style>