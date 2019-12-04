<template>
    <div>
        <div>
            <el-input placeholder="请输入部门进行搜索..." v-model="filterText" style="width: 300px"
                      prefix-icon="el-icon-search"></el-input>
        </div>
        <div style="margin-top: 10px; width: 45%">
            <el-tree ref="tree"
                     :filter-node-method="filterNode"
                     default-expand-all
                     :expand-on-click-node="false"
                     :data="data"
                     :props="defaultProps">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => showAddDept(data)">
              <el-button style="padding: 3px" size="mini" type="primary">添加部门</el-button>
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => removeDept( data)">
              <el-button style="padding: 3px" size="mini" type="danger">删除部门</el-button>
          </el-button>
        </span>
      </span>
            </el-tree>


        </div>

        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>上级部门</el-tag>
                    </td>
                    <td>{{parentDeptName}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tag>部门名称</el-tag>
                    </td>
                    <td>
                        <el-input v-model="addDept.name"></el-input>
                    </td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="postDept">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                parentDeptName: '',
                addDept: {
                    name: '',
                    parentId: -1,
                },
                dialogVisible: false,
                filterText: '',
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        },
        mounted() {
            this.getDepartment();
        },
        watch: {
            filterText(val) {
                console.log(val);
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            filterNode(value, data) {
                console.log("filterNode");
                console.log("value:" + value + "==data" + data);
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            // handleNodeClick(data) {
            //     console.log(data);
            // },
            getDepartment() {
                this.getRequest("/sys/dept/pid").then(resp => {
                    if (resp) {
                        this.data = resp;
                        console.log(this.data);
                    }
                })
            },
            showAddDept(data) {
                this.parentDeptName = data.name;
                this.addDept.parentId = data.id;
                this.dialogVisible = true;
                console.log(data);
                // this.addDept.parentDeptName = data.name;


            },
            removeDept(data) {
                console.log(data);
                this.deleteRequest("/sys/dept/" + data.id).then(resp => {
                    if (resp) {
                        this.getDepartment();
                    }
                })

            },
            postDept() {
                this.postRequest("/sys/dept/", this.addDept).then(resp => {
                    if (resp) {
                        this.dialogVisible = false;
                        this.getDepartment();

                    }
                })
            }

            // append(data) {
            //     const newChild = {id: id++, label: 'testtest', children: []};
            //     if (!data.children) {
            //         this.$set(data, 'children', []);
            //     }
            //     data.children.push(newChild);
            // },
            //
            // remove(node, data) {
            //     const parent = node.parent;
            //     const children = parent.data.children || parent.data;
            //     const index = children.findIndex(d => d.id === data.id);
            //     children.splice(index, 1);
            // },
        }

    }
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>