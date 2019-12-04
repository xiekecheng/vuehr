<template>
    <div>
        <div style=" margin-top:10px; display: flex; justify-content: center">
            <el-input
                    style="width: 400px;margin-right: 5px"
                    placeholder="通过用户名搜索用户..."
                    prefix-icon="el-icon-search"
                    v-model="keyWords">
            </el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div class="hrContainer">
            <el-card class="box-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; color: red; padding: 3px 0" type="text" icon="el-icon-delete"
                               @click="doDelete(hr)">删除
                    </el-button>
                </div>
                <div>
                    <div class="img-Container">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img"/>
                    </div>
                    <div class="userinfoContainer">
                        <div>用户名:{{hr.name}}</div>
                        <div>手机号码:{{hr.phone}}</div>
                        <div>电话号码:{{hr.telephone}}</div>
                        <div>地址:{{hr.address}}</div>
                        <div>

                            用户状态:
                            <el-switch

                                    v-model="hr.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </div>
                        <div>用户角色:
                            <el-tag style="margin-right: 3px" type="success" v-for="(role,indexj) in hr.roles"
                                    :key="indexj">{{role.nameZh}}
                            </el-tag>
                            <el-button icon="el-icon-more" type="text"></el-button>
                        </div>
                        <div>备注:{{hr.remark}}</div>

                    </div>

                </div>

            </el-card>

        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                keyWords: '',
                hrs: [],
            }
        },
        mounted() {
            this.initHrs();
        },
        methods: {
            //删除HR
            doDelete(hr) {


                this.$confirm('此操作将永久删除[' + hr.name + ']HR, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = "/system/hr/" + hr.id;
                    console.log(url);
                    this.deleteRequest(url).then(resp => {
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            //搜索
            doSearch() {
                let url = "/system/hr/?keywords=" + this.keyWords;
                console.log(url);


                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.hrs = resp;
                        this.keyWords = '';
                    }

                })
            },
            //初始化Hr
            initHrs() {
                this.getRequest("/system/hr/").then(resp => {
                    if (resp) {
                        this.hrs = resp;
                    }

                })
            }
        }
    }
</script>

<style scoped>
    .box-card {
        width: 350px;
        /*height: 400px;*/
        margin-bottom: 20px;
    }

    .hrContainer {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }

    .img-Container {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .userinfoContainer {
        margin-top: 20px
    }

    .userinfoContainer div {
        color: #5cacff;
        font-size: 14px;
    }
</style>