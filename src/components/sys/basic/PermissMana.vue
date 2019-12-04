<template>
    <div>
        <div class="inputDiv">
            <el-input style="width: 250px" placeholder="请输入角色英文名称.." v-model="postData.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input
                    style="width: 250px"
                    placeholder="请输入角色中文名称.."
                    v-model="postData.nameZh"
                    clearable>
            </el-input>
            <el-button
                    type="primary"
                    @click="addRole"
                    style="margin-left: 5px">添加
            </el-button>
        </div>

        <div class="contentDiv">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; color: #f6061b; padding: 3px "
                                       @click="deleteRole(role.id,role.nameZh)" icon="el-icon-delete" type="text">删除角色
                            </el-button>
                        </div>
                        <div>
                            <el-tree :default-checked-keys="SelectedRoles"
                                     ref="tree"
                                     :key="index"
                                     node-key="id"
                                     show-checkbox :data="allMenus"
                                     :props="defaultProps"></el-tree>
                            <div style="display: flex; justify-content: flex-end">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" @click="doUpdate(role.id,index)" type="primary">确认修改</el-button>
                            </div>

                        </div>

                    </el-card>
                </el-collapse-item>

            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        mounted() {
            this.initRoles();
        },
        data() {
            return {
                activeName: -1,
                SelectedRoles: [],

                postData: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            //删除角色
            deleteRole(rid, rnameZh) {


                this.$confirm('此操作将永久删除「' + rnameZh + '」角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/" + rid).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            //添加角色
            addRole() {
                if (this.postData.name && this.postData.nameZh) {
                    this.postRequest("/system/basic/permiss/role", this.postData).then(resp => {
                        if (resp) {
                            this.initRoles();
                            this.postData.nameZh = '';
                            this.postData.name = '';
                        }
                    })
                } else {
                    this.$message.error("name或nameZh不可以为空");
                }

            },
            // 取消更新
            cancelUpdate() {
                this.activeName = -1;
            },
            // 更新
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                let checked = tree.getCheckedKeys(true);
                console.log(checked);
                let url = '?rid=' + rid;
                checked.forEach(item => {
                    url += '&mids=' + item
                })
                console.log(url);
                this.putRequest("/system/basic/permiss/" + url).then(resp => {
                    this.activeName = -1;
                });


            },
            // 初始化显示的角色
            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    this.roles = resp;
                })
            },
            getAllMenus() {
                this.getRequest("/system/basic/permiss/menu").then(resp => {
                    this.allMenus = resp;
                })
            },
            initPerMissRoles(id) {
                this.getRequest("/system/basic/permiss/roles/" + id).then(resp => {
                    this.SelectedRoles = resp;
                })
            },
            change(name) {
                console.log(name);
                if (name) {
                    this.getAllMenus();
                    this.initPerMissRoles(name);
                }
            },

        }
    }
</script>

<style>
    .inputDiv {
        display: flex;
    }

    .contentDiv {
        width: 700px;
    }

</style>