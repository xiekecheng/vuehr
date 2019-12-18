<template>
    <div>
        <div style="display: flex; justify-content: space-between">
            <el-button type="primary" icon="el-icon-plus" @click="showSalaryView('add')">添加工资账套</el-button>
            <el-button type="success" icon="el-icon-refresh" @click="initSalaries">刷新</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table :data="salaries" border stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
                <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
                <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
                <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
                <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
                <el-table-column width="90" prop="createDate" label="启用时间"></el-table-column>
                <el-table-column label="养老金" align="center">
                    <el-table-column width="70" prop="pensionPer" align="center" label="比率"></el-table-column>
                    <el-table-column width="70" prop="pensionBase" align="center" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险" align="center">
                    <el-table-column width="70" prop="medicalPer" align="center" label="比率"></el-table-column>
                    <el-table-column width="70" prop="medicalBase" align="center" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column label="公积金" align="center">
                    <el-table-column width="70" prop="accumulationFundPer" align="center" label="比率"></el-table-column>
                    <el-table-column width="70" prop="accumulationFundBase" align="center" label="基数"></el-table-column>
                </el-table-column>
                <el-table-column width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editSalary(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteSalary(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <el-dialog
                :title="salaryItemName"
                :visible.sync="dialogVisible"
                width="50%">
            <div style="display: flex; justify-content: space-around; align-items: center;">
                <el-steps direction="vertical" :active="activeItemIndex">
                    <el-step :title="item" v-for="(item,index) in salaryName" :key="index"/>
                </el-steps>
                <el-input v-model="salary[title]" style="width: 200px; " v-show="activeItemIndex==index"
                          :placeholder="'请输入'+salaryName[index]+'....'" v-for="(value,title,index) in salary"
                          :key="index"/>
            </div>

            <span slot="footer" class="dialog-footer">
    <el-button @click="preStep">{{activeItemIndex===0?'取消':'上一步'}}</el-button>
    <el-button type="primary" @click="nextStep">{{activeItemIndex===10?'完成':'下一步'}}</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                activeItemIndex: 0,
                dialogVisible: false,
                salaries: [],
                salaryItemName: '',
                salaryName: [
                    '账套名称',
                    '基本工资',
                    '交通补助',
                    '午餐补助',
                    '奖金',
                    '养老金比率',
                    '养老金基数',
                    '医疗保险比率',
                    '医疗保险基数',
                    '公积金比率',
                    '公积金基数'
                ],
                salary: {
                    name: '',
                    basicSalary: 0,
                    trafficSalary: 0,
                    lunchSalary: 0,
                    bonus: 0,
                    pensionPer: 0,
                    pensionBase: 0,
                    medicalPer: 0,
                    medicalBase: 0,
                    accumulationFundPer: 0,
                    accumulationFundBase: 0
                }


            }
        },
        mounted() {
            this.initSalaries();
        },
        methods: {
            editSalary(data) {
                this.salary.id = data.id;
                this.salary.accumulationFundBase = data.accumulationFundBase;
                this.salary.accumulationFundPer = data.accumulationFundPer;
                this.salary.basicSalary = data.basicSalary;
                this.salary.bonus = data.bonus;
                this.salary.lunchSalary = data.lunchSalary;
                this.salary.medicalBase = data.medicalBase;
                this.salary.medicalPer = data.medicalPer;
                this.salary.name = data.name;
                this.salary.pensionBase = data.pensionBase;
                this.salary.pensionPer = data.pensionPer;
                this.salary.trafficSalary = data.trafficSalary;
                console.log(this.salary);
                this.showSalaryView('update');

            },
            deleteSalary(data) {

                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/sob/" + data.id).then(resp => {
                        if (resp) {
                            this.initSalaries();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            preStep() {

                if (this.activeItemIndex === 0) {
                    this.dialogVisible = false;
                    return;
                }
                this.activeItemIndex--;

            },
            nextStep() {


                if (this.activeItemIndex === 10) {

                    if (this.salary.id) {
                        this.putRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalaries();
                            }
                        });
                    } else {
                        this.postRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalaries();
                            }
                        });

                    }
                    this.dialogVisible = false;
                    return;

                }
                this.activeItemIndex++;

            },
            emptySalary() {
                this.salary = {
                    name: '',
                    basicSalary: 0,
                    trafficSalary: 0,
                    lunchSalary: 0,
                    bonus: 0,
                    pensionPer: 0,
                    pensionBase: 0,
                    medicalPer: 0,
                    medicalBase: 0,
                    accumulationFundPer: 0,
                    accumulationFundBase: 0

                }
            },
            showSalaryView(data) {


                this.dialogVisible = true;
                this.activeItemIndex = 0;
                if (data === 'update') {
                    this.salaryItemName = '修改工资账套';
                } else {
                    this.salaryItemName = '添加工资账套';
                }

            },
            initSalaries() {
                this.getRequest("/salary/sob/").then(resp => {
                    if (resp) {
                        this.salaries = resp;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>