<template>
    <div>
        <div>
            <div class="inputContainer" style="display: flex; justify-content: space-between; margin-bottom: 10px">
                <div>
                    <el-input
                            style="width: 400px" clearable @clear="doSearch" prefix-icon="el-icon-search"
                            placeholder="通过员工名搜索员工" v-model="searchName"
                            @keydown.enter.native="doSearch"></el-input>
                    <el-button style="margin-left: 5px" type="primary" @click="doSearch">搜索</el-button>
                    <el-button type="primary" @click="showSearch = !showSearch">
                        <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            style="display: inline-flex;margin-right: 8px"
                            action="/emp/basic/import"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :disabled="importDisabled"
                            :on-success="onSuccess"
                            :on-error="onError"
                    >
                        <el-button type="success" :icon="importIcon" :disabled="importDisabled">
                            {{importText}}
                        </el-button>
                    </el-upload>


                    <el-button type="success" @click="exportData" icon="el-icon-download">
                        下载数据
                    </el-button>
                    <el-button type="primary" @click="ShowAddEmpView">
                        <i class="fa fa-user-plus" aria-hidden="true"></i>
                        添加员工
                    </el-button>
                </div>
            </div>
            <transition name="slide-fade">
                <div v-show="showSearch"
                     style="border: 1px solid royalblue; border-radius: 5px;box-sizing: border-box;padding: 5px 5px; margin: 10px 0px">
                    <el-row>
                        <el-col :span="5">
                            政治面貌:
                            <el-select size="mini" v-model="conditionSearch.politicsstatusId" placeholder="政治面貌"
                                       style="width: 150px">
                                <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            民族:
                            <el-select size="mini" v-model="conditionSearch.nationId" placeholder="请选择民族"
                                       style="width: 130px">
                                <el-option v-for="item in nation"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职位:
                            <el-select size="mini" v-model="conditionSearch.positionId" placeholder="请选择职位"
                                       style="width: 130px">
                                <el-option v-for="item in position"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职称:
                            <el-select size="mini" v-model="conditionSearch.jobLevelId" placeholder="请选择职称"
                                       style="width: 130px">
                                <el-option v-for="item in jobLevel"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            聘用形式:
                            <el-radio-group size="mini" v-model="conditionSearch.engageForm">
                                <el-radio label="劳动合同" size="mini">劳动合同</el-radio>
                                <el-radio label="劳务合同" size="mini">劳务合同</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px">
                        <el-col :span="7">
                            所属部门:
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="popVisible">
                                <el-tree @node-click="handleNodeClick" :expand-on-click-node="false"
                                         :default-expand-all="true" :data="deptData" :props="defaultProps">
                                </el-tree>
                                <div style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;padding-left: 8px;box-sizing: border-box"
                                     slot="reference" @click="confirmDept">{{departmentName}}
                                </div>
                            </el-popover>
                        </el-col>

                        <el-col :span="10">
                            入职日期:
                            <el-date-picker
                                    v-model="conditionSearch.begin"
                                    value-format="yyyy-MM-dd"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="7">
                            <el-button @click="showSearch=false">取消</el-button>
                            <el-button type="primary" @click="complexSearch">搜索</el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
        </div>
        <div>
            <!--            员工列表-->
            <div>
                <el-table size="mini"
                          ref="multipleTable"
                          :data="tableData"
                          stripe
                          border
                          tooltip-effect="dark"
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            fixed
                            width="30">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            fixed
                            width="90">

                    </el-table-column>
                    <el-table-column
                            prop="workID"
                            label="工号"

                            width="85">
                    </el-table-column>
                    <el-table-column
                            prop="gender"
                            label="性别"
                            width="50"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="birthday"
                            label="出生日期"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="idCard"
                            label="身份证号码"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="wedlock"
                            label="婚姻状况"
                            width="70">
                    </el-table-column>
                    <el-table-column
                            prop="nation.name"
                            label="民族"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="nativePlace"
                            label="籍贯"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="politicsStatus.name"
                            label="政治面貌"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="电子邮件"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="电话号码"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="联系地址"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            prop="department.name"
                            label="所属部门"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="position.name"
                            label="职位"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="jobLevel.name"
                            label="职称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="engageForm"
                            label="聘用形式"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="specialty"
                            label="专业"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="school"
                            label="毕业院校"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="beginDate"
                            label="入职日期"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="conversionTime"
                            label="转正日期"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="beginContract"
                            label="合同起始日期"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="endContract"
                            label="合同截止日期"
                            width="95">
                    </el-table-column>
                    <el-table-column

                            label="合同期限"
                            width="70">
                        <template slot-scope="scope">
                            {{scope.row.contractTerm}}年
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="tiptopDegree"
                            label="最高学历"
                            width="70">
                    </el-table-column>

                    <el-table-column label="操作" fixed="right" width="195">
                        <template slot-scope="scope">
                            <el-button
                                    style="padding: 3px 4px 3px 4px;margin: 2px"
                                    size="mini"
                                    @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button
                                    style="padding: 3px 4px 3px 4px;margin: 2px"
                                    size="mini"
                                    type="primary"
                                    @click="handleCheck(scope.row)">查看高级资料
                            </el-button>
                            <el-button
                                    style="padding: 3px 4px 3px 4px;margin: 2px"
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div style="display: flex;justify-content: space-between;margin: 2px">
                <el-button type="danger" size="mini" :disabled="multipleSelection.length==0" @click="batchDelete">批量删除
                </el-button>
                <el-pagination
                        background
                        :current-page.sync="currentPage"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        @size-change="handleSizeChange"
                        layout="sizes,prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <!--添加员工对话框-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="90%">
            <el-form :model="addEmpForm" :rules="rules" ref="addEmpValidate">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="姓名:" prop="name">
                            <el-input placeholder="请输入员工姓名.." prefix-icon="el-icon-s-custom" v-model="addEmpForm.name"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别:" prop="gender">
                            <el-radio-group v-model="addEmpForm.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出生日期:" prop="birthday">
                            <el-date-picker
                                    style="width: 150px"
                                    v-model="addEmpForm.birthday"
                                    type="date"
                                    placeholder="出生日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="政治面貌:" prop="politicId">
                            <el-select v-model="addEmpForm.politicId" placeholder="政治面貌" style="width: 150px">
                                <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="民族:" prop="nationId">
                            <el-select v-model="addEmpForm.nationId" placeholder="请选择民族" style="width: 150px">
                                <el-option v-for="item in nation"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="籍贯:" prop="nativePlace">
                            <el-input placeholder="请输入籍贯.." v-model="addEmpForm.nativePlace"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="电子邮箱:" prop="email">
                            <el-input placeholder="请输入邮箱.." v-model="addEmpForm.email" style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系地址:" prop="address">
                            <el-input placeholder="联系地址.." prefix-icon="el-icon-edit" v-model="addEmpForm.address"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="职位:" prop="posId">
                            <el-select v-model="addEmpForm.posId" placeholder="请选择职位" style="width: 150px">
                                <el-option v-for="item in position"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="职称:" prop="jobLevelId">
                            <el-select v-model="addEmpForm.jobLevelId" placeholder="请选择职称" style="width: 150px">
                                <el-option v-for="item in jobLevel"
                                           :key="item.id"
                                           :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属部门:" prop="departmentId">
                            <el-popover
                                    placement="right"
                                    title="请选择部门.."
                                    width="200"
                                    trigger="manual"
                                    v-model="popDeptVisible">
                                <el-tree @node-click="handleNodeClick2" :expand-on-click-node="false"
                                         :default-expand-all="true" :data="deptData" :props="defaultProps">
                                </el-tree>
                                <div style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;padding-left: 8px;box-sizing: border-box"
                                     slot="reference" @click="confirmDept2">{{departmentName2}}
                                </div>
                            </el-popover>


                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="电话号码:" prop="phone">
                            <el-input placeholder="电话号码.." prefix-icon="el-icon-phone" v-model="addEmpForm.phone"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工号:" prop="workId">
                            <el-input workID disabled v-model="addEmpForm.workID" style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="学历:" prop="tiptopDegree">
                            <el-select v-model="addEmpForm.tiptopDegree" placeholder="请选择学历" style="width: 150px">
                                <el-option v-for="item in degree"
                                           :key="item"
                                           :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="毕业院校:" prop="school">
                            <el-input placeholder="毕业院校.." prefix-icon="el-icon-school" v-model="addEmpForm.school"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="专业名称:" prop="specialty">
                            <el-input placeholder="专业名称.." prefix-icon="el-icon-s-opportunity"
                                      v-model="addEmpForm.specialty"
                                      style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="入职日期:" prop="beginDate">
                            <el-date-picker
                                    style="width: 150px"
                                    v-model="addEmpForm.beginDate"
                                    type="date"
                                    placeholder="入职日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="转正日期:" prop="conversionTime">
                            <el-date-picker
                                    style="width: 150px"
                                    v-model="addEmpForm.conversionTime"
                                    type="date"
                                    placeholder="转正日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同起始日期:" prop="beginContract">
                            <el-date-picker
                                    style="width: 150px"
                                    v-model="addEmpForm.beginContract"
                                    type="date"
                                    placeholder="合同起始日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同截止日期:" prop="endContract">
                            <el-date-picker
                                    style="width: 150px"
                                    v-model="addEmpForm.endContract"
                                    type="date"
                                    placeholder="合同截止日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="身份证号:" prop="idCard">
                            <el-input placeholder="身份证号.." v-model="addEmpForm.idCard" style="width: 150px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="聘用形式:" prop="engageForm">
                            <el-radio-group v-model="addEmpForm.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同">劳务合同</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="婚姻状况:" prop="wedlock">
                            <el-radio-group v-model="addEmpForm.wedlock">
                                <el-radio label="已婚">已婚</el-radio>
                                <el-radio label="未婚">未婚</el-radio>
                                <el-radio label="离异">离异</el-radio>

                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>


            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addEmp">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                title: '',
                rules: {
                    name: [{required: true, message: '必填:姓名'}],
                    nationId: [{required: true, message: '必填:民族'}],
                    // name: '',
                    gender: [{required: true, message: '必填:性别'}],
                    birthday: [{required: true, message: '必填:生日'}],
                    idCard: [{required: true, message: '必填:身份证号'}, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    wedlock: [{required: true, message: '必填:婚否'}],
                    nativePlace: [{required: true, message: '必填:籍贯'}],
                    email: [{required: true, message: '必填:邮箱地址'}, {type: 'email', message: '请输入正确的邮箱地址'}],
                    phone: [{required: true, message: '必填:电话号码'}],
                    address: [{required: true, message: '必填:联系地址'}],
                    posId: [{required: true, message: '必填:职位'}],
                    engageForm: [{required: true, message: '必填:聘用形式'}],
                    tiptopDegree: [{required: true, message: '必填:最高学历'}],
                    specialty: [{required: true, message: '必填:专业'}],
                    school: [{required: true, message: '必填:学校'}],
                    beginDate: [{required: true, message: '必填:入职日期'}],
                    // workState: [{required: true, message: '必填:姓名'}],
                    workID: [{required: true, message: '必填:工号'}],
                    // contractTerm: [{required: true, message: '必填:姓名'}],
                    conversionTime: [{required: true, message: '必填:转正日期'}],
                    // notWorkDate: [{required: true, message: '年龄不能为空'}],
                    beginContract: [{required: true, message: '必填:合同起始日期'}],
                    endContract: [{required: true, message: '必填:合同截止日期'}],
                    // workAge: [{required: true, message: '必填:工龄'}],
                    politicId: [{required: true, message: '必填:政治面貌'}],
                    jobLevelId: [{required: true, message: '必填:职称'}],
                    departmentId: [{required: true, message: '必填:部门'}],
                },

                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                deptData: [],
                showSearch: true,
                popVisible: false,
                popDeptVisible: false,
                searchType: 1,
                departmentName: '',
                departmentName2: '',
                conditionSearch: {
                    nationId: null,
                    politicsstatusId: null,
                    positionId: null,
                    jobLevelId: null,
                    engageForm: null,
                    departmentId: null,
                    begin: null,
                },
                importDisabled: false,
                visible: false,
                importIcon: 'el-icon-upload2',
                importText: '导入数据',
                degree: ['大专', '本科', '硕士', '博士', '高中', '初中', '小学', '其他'],
                jobLevel: [],
                politicsstatus: [],
                nation: [],
                position: [],
                addEmpForm: {
                    nationId: '',
                    name: '',
                    gender: '',
                    birthday: '',
                    idCard: "",
                    wedlock: "",
                    nativePlace: "",
                    email: "",
                    phone: "",
                    address: "",
                    posId: '',
                    engageForm: "",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: '',
                    conversionTime: "",
                    notWorkDate: "",
                    beginContract: "",
                    endContract: "",
                    workAge: '',
                    politicId: '',
                    jobLevelId: '',
                    departmentId: ''
                },
                dialogVisible: false,
                searchName: '',
                pageSize: 10,
                total: -1,
                currentPage: 1,
                multipleSelection: [],
                tableData: []

            }
        },
        mounted() {
            this.initDeptData();
            this.doSearch();
            this.initPosition();
            if (!window.sessionStorage.getItem("politicsstatus")) {
                this.initpoliticsstatus();

            } else {
                this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"))
                // this.politicsstatus = window.sessionStorage.getItem("politicsstatus");
            }
            if (!window.sessionStorage.getItem("nation")) {
                this.initNation();
            } else {
                this.nation = JSON.parse(window.sessionStorage.getItem("nation"))
                // this.nation = window.sessionStorage.getItem("nation")
            }
            if (!window.sessionStorage.getItem("jobLevel")) {
                this.initJobLevel();
            } else {
                this.jobLevel = JSON.parse(window.sessionStorage.getItem("jobLevel"))
                // this.jobLevel = window.sessionStorage.getItem("jobLevel");
            }

            if (!window.sessionStorage.getItem("jobLevel")) {
                this.initJobLevel();
            } else {
                this.jobLevel = JSON.parse(window.sessionStorage.getItem("jobLevel"))
                // this.jobLevel = window.sessionStorage.getItem("jobLevel");
            }
        },
        methods: {
            //添加员工
            addEmp() {

                if (this.addEmpForm.id) {
                    //修改员工
                    this.$refs['addEmpValidate'].validate(valid => {
                        if (valid) {
                            console.log(this.addEmpForm);
                            this.putRequest("/emp/basic", this.addEmpForm).then(resp => {
                                if (resp) {
                                    if (this.type === 1) {
                                        this.doSearch();
                                    } else {
                                        this.complexSearch();
                                    }
                                }
                            })
                        }
                    });
                } else {
                    //添加员工
                    this.$refs['addEmpValidate'].validate(valid => {
                        if (valid) {
                            this.postRequest("/emp/basic/", this.addEmpForm).then(resp => {
                                if (resp) {
                                    if (this.type === 1) {
                                        this.doSearch();
                                    } else {
                                        this.complexSearch();
                                    }
                                }
                            });
                            this.dialogVisible = false;
                        }
                    });
                }


                // this.postRequest("/emp/basic/",this.addEmpForm).then(resp=>{
                //     if (resp){
                //         if (this.type===1){
                //             this.doSearch();
                //         }else {
                //             this.complexSearch();
                //         }
                //     }
                // })
                // this.dialogVisible = false;
            },
            //复杂查询
            complexSearch() {
                this.type = 2;
                let url = "/emp/basic/complexSearch?page=" + this.currentPage + "&size=" + this.pageSize;
                if (this.conditionSearch.nationId) {
                    url += '&nationId=' + this.conditionSearch.nationId;
                }
                if (this.conditionSearch.politicsstatusId) {
                    url += '&politicId=' + this.conditionSearch.politicsstatusId
                }
                if (this.conditionSearch.positionId) {
                    url += '&posId=' + this.conditionSearch.positionId;
                }
                if (this.conditionSearch.jobLevelId) {
                    url += '&jobLevelId=' + this.conditionSearch.jobLevelId;
                }
                if (this.conditionSearch.engageForm) {
                    url += '&engageForm=' + this.conditionSearch.engageForm;
                }
                if (this.conditionSearch.departmentId) {
                    url += '&departmentId=' + this.conditionSearch.departmentId;
                }
                if (this.conditionSearch.begin) {
                    url += '&beginDateScope=' + this.conditionSearch.begin;
                }
                console.log(url);
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.tableData = resp.data;
                        this.total = resp.total;
                        console.log(resp.total);
                    }
                })
            },
            handleNodeClick(data) {
                this.popVisible = false;
                this.conditionSearch.departmentId = data.id;
                this.departmentName = data.name;
            },
            handleNodeClick2(data) {
                this.popDeptVisible = false;
                this.addEmpForm.departmentId = data.id;
                this.departmentName2 = data.name;
            },
            confirmDept() {
                this.popVisible = !this.popVisible;

            },
            confirmDept2() {
                this.popDeptVisible = !this.popDeptVisible;

            },
            initDeptData() {
                this.getRequest("/sys/dept/pid").then(resp => {
                    if (resp) {
                        this.deptData = resp;
                    }
                })
            },
            changeShowSearch() {
                // this.showSearch==!shows
            },
            beforeUpload() {
                this.importIcon = 'el-icon-loading';
                this.importText = '正在导入';
                this.importDisabled = true;
            },
            onSuccess() {
                this.importIcon = 'el-icon-upload2';
                this.importText = '导入数据';
                this.importDisabled = false;
            },
            onError() {
                this.importIcon = 'el-icon-upload2';
                this.importText = '导入数据';
                this.importDisabled = false;
            },
            exportData() {
                let url = "/emp/basic/export";
                window.open(url, '_parent');
            },
            showDepView() {

            },
            clearAddEmpForm() {
                this.departmentName2 = '请选择部门...';
                this.addEmpForm = {
                    nationId: '',
                    name: '',
                    gender: '',
                    birthday: '',
                    idCard: "",
                    wedlock: "",
                    nativePlace: "",
                    email: "",
                    phone: "",
                    address: "",
                    posId: '',
                    engageForm: "",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: '',
                    conversionTime: "",
                    notWorkDate: "",
                    beginContract: "",
                    endContract: "",
                    workAge: '',
                    politicId: '',
                    jobLevelId: '',
                    departmentId: ''
                }
            },
            //添加员工
            ShowAddEmpView() {
                this.title = "添加员工";
                this.clearAddEmpForm();
                this.dialogVisible = true;
                this.initPosition();
                this.initMaxWorkId();
            },
            //查询
            doSearch() {
                this.type = 1;
                let url = "/emp/basic/employee?page=" + this.currentPage + "&size=" + this.pageSize + "&name=" + this.searchName;
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.tableData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            //改变每页显示数
            handleSizeChange(val) {
                if (this.type == 1) {
                    this.pageSize = val;
                    this.doSearch();
                } else {
                    this.pageSize = val;
                    this.complexSearch();
                }
            },
            handleCurrentChange(val) {
                if (this.type == 1) {
                    console.log('当前页:' + val);
                    this.currentPage = val;
                    this.doSearch();
                } else {
                    this.currentPage = val;
                    this.complexSearch();
                }


            },
            //修改员工
            handleEdit(data) {
                console.log(data);
                this.title = "编辑员工";
                this.dialogVisible = true;
                this.addEmpForm = data;
                this.initPosition();
                // this.initMaxWorkId();


            },
            //删除员工
            handleDelete(data) {

                this.$confirm('此操作将永久删除[' + data.name + ']员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = '/emp/basic/?ids=' + data.id;
                    this.deleteRequest(url).then(resp => {
                        if (resp) {
                            if (this.type === 1) {
                                this.doSearch();
                            } else {
                                this.complexSearch();
                            }

                            // this.doSearch();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 批量删除
            batchDelete() {
                let num = this.multipleSelection.length;
                this.$confirm('此操作将永久删除' + num + '个员工, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log("delete");
                    let url = '/emp/basic/?';
                    this.multipleSelection.forEach(item => {
                        url += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest(url).then(resp => {
                        if (resp) {
                            if (this.type === 1) {
                                this.doSearch();
                            } else {
                                this.complexSearch();
                            }


                            // this.doSearch();
                        }
                    });
                    console.log('删除后页数' + this.currentPage);
                    // this.handleCurrentChange();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            keyDownenter() {

            },
            initEmp() {
                let url = "/emp/basic/?page=" + this.currentPage + "&size=" + this.pageSize;
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.tableData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            initNation() {
                let url = "/emp/basic/nations";
                this.getRequest(url).then(data => {
                    if (data) {
                        this.nation = data;
                        window.sessionStorage.setItem("nation", JSON.stringify(data));
                        // window.sessionStorage.setItem("nation", JSON.parse(data));
                    }
                })
            },
            initPosition() {
                let url = "/emp/basic/position";
                this.getRequest(url).then(data => {
                    if (data) {
                        this.position = data;
                    }
                })
            },
            initJobLevel() {
                let url = "/system/basic/job/";
                this.getRequest(url).then(data => {
                    if (data) {
                        this.jobLevel = data;
                        window.sessionStorage.setItem("jobLevel", JSON.stringify(data));
                    }
                })
            },
            initpoliticsstatus() {
                let url = "/emp/basic/politicsstatus";
                this.getRequest(url).then(data => {
                    if (data) {
                        this.politicsstatus = data;
                        window.sessionStorage.setItem("politicsstatus", JSON.stringify(data));
                    }
                })
            },
            initMaxWorkId() {
                let url = "/emp/basic/maxWorkId";
                this.getRequest(url).then(data => {
                    if (data) {
                        this.addEmpForm.workID = data.obj;
                    }
                })
            }
        }
    }
</script>

<style>
    .inputContainer {
        margin-top: 8px;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }

</style>