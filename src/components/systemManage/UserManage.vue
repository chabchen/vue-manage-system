<!--
@date:
@author:zjj
@modifyAuthor:elina
-->
<template>
    <div class="user_roles container">
        <el-row :gutter="24">
            <el-col :span="16" style='min-width:230px;'>
                <div class="grid-content bg-purple">
                    <div class="row_btns">
                        <el-button type="primary" @click="refresh"><i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
                        <el-button type="primary" @click="insertBtn"><i class="el-icon-plus marginright"></i>新增</el-button>
                        <el-button type="primary" @click="editBtn" :disabled="editBtnFlag"><i class="el-icon-edit marginright"></i>编辑</el-button>
                        <el-button type="primary" @click="saveBtn"><i class="icon iconfont icon-baocun marginright"></i>保存</el-button>
                        <el-button type="primary" @click="delAll" :disabled="deleteBtnFlag"><i class="el-icon-close marginright"></i>删除</el-button>
                        <el-button type="primary" ref="enableBtn" :disabled="enBtnFlag"><i class="icon iconfont icon-zanting marginright"></i>启用</el-button>
                        <el-button type="primary" ref="disableBtn" :disabled="disBtnFlag"><i class="icon iconfont icon-tingyong marginright"></i>停用</el-button>
                    </div>
                    <template>
                        <div class="demo-input-suffix">
                            用户编码：
                            <el-input size="mini" placeholder="请输入用户编号" prefix-icon="el-icon-search" v-model="searchConditions.userCode"></el-input>
                        </div>
                        <div class="demo-input-suffix">
                            员工名称：
                            <el-input size="mini" placeholder="请输入用户名称" prefix-icon="el-icon-search" v-model="searchConditions.empolyeeName"></el-input>
                        </div>
                        <div style="display: inline-block;">
                            <el-button type="primary" @click="reset" class="resetbtn"><i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                            <el-button type="primary" @click="search"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
                        </div>
                    </template>
                    <div v-loading="loading">
                        <el-table stripe :data="tableData" :row-class-name="handleSelectedBg" border style="width: 100%" ref="multipleTables" @row-click="rowclick" @selection-change="handleSelectionChanges">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="userCode" label="用户编码">
                            </el-table-column>
                            <el-table-column prop="empolyeeName" label="员工名称">
                            </el-table-column>
                            <el-table-column prop="userTypeCode" label="用户类型">
                            </el-table-column>
                            <el-table-column prop="startDate" label="有效开始时间">
                            </el-table-column>
                            <el-table-column prop="endDate" label="有效结束时间">
                            </el-table-column>
                            <el-table-column prop="enableFlag" :formatter="formatStatus" label="状态">
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="totalEle" layout="total, sizes, prev, pager, next, jumper">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="grid-content bg-purple">
                    <div class="user_right">
                        <el-tabs type="border-card">
                            <el-form ref="inputForm" :rules="inputRules" :model="inputForm" label-width="96px">
                                <el-form-item label="用户编码" prop="userCode">
                                    <el-input v-model="inputForm.userCode" :disabled='inputFormDisabled'></el-input>
                                </el-form-item>
                                <el-form-item label="员工名称" prop="empolyeeName">
                                    <el-input v-model="inputForm.empolyeeName" :disabled='inputFormDisabled'></el-input>
                                </el-form-item>
                                <el-form-item label="用户密码" prop="pwd">
                                    <el-input v-model="inputForm.pwd" :disabled='inputFormDisabled'></el-input>
                                </el-form-item>
                                <el-form-item label="用户类型" prop="userTypeCode">
                                    <el-select style="width:100%" v-model="inputForm.userTypeCode" placeholder="用户类型" :disabled='inputFormDisabled'>
                                        <el-option v-for="item in options" :key="item.code" :label="item.codeCnName" :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="有效时间" prop="date">
                                    <el-date-picker :disabled='inputFormDisabled' style="width:100%" v-model="inputForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-form>
                        </el-tabs>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import { formatDate } from "../common/date/date.js";
export default {
    components: {},
    data() {
        return {
            enBtnFlag: true,
            disBtnFlag: true,

            editBtnFlag: false,
            deleteBtnFlag: false,

            selectedID: "",
            operateType: "none",
            inputFormDisabled: true,
            searchConditions: {
                userCode: "",
                empolyeeName: ""
            },

            inputForm: {
                userCode: "",
                empolyeeName: "",
                pwd: "",
                userTypeCode: "",
                date: ""
            },

            inputRules: {
                userCode: [
                    {
                        required: true,
                        message: "请输入用户代码",
                        trigger: "blur"
                    }
                ],
                empolyeeName: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur"
                    }
                ],
                pwd: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                date: [
                    {
                        required: true,
                        message: "请输入有效时间",
                        trigger: "blur"
                    }
                ]
            },

            //编辑时候单个查询出的数据

            editData: {},
            totalEle: 0,

            del_list: [],
            loading: true,
            enableFlag: "",
            name: "",
            pageSize: 10,
            currentPage: 1,
            user_role_Id: "",
            user_role_name: "",
            multipleSelection: [],
            tableData: [],
            selectList: "",
            options: [],
            flag: true
        };
    },
    created() {
        this.getData();
        this.getSelectOptions();
        this.keyupSubmit();
    },
    methods: {
        // 键盘enter事件
        keyupSubmit(){
            document.onkeydown=e=>{
                let _key=window.event.keyCode;
                if(_key===13){
                  this.search()
                }
            }
        },
        getSelectOptions() {
            //用户类型
            this.$CategoryCode("CUX_USER_TYPE").then(res => {
                this.options = res;
            });
        },
        //选中背景色
        handleSelectedBg({ row, rowIndex }) {
            if (this.multipleSelection.indexOf(row) != -1) {
                return "selected-row";
            }
            return "";
        },
        //重置
        reset() {
            this.searchConditions.userCode = "";
            this.searchConditions.empolyeeName = "";
        },

        //停用的调取
        disableRole() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            let ids = "";

            this.multipleSelection.forEach(role => {
                if (role.enableFlag == 0) {
                    ids += role.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            this.$postSimple("management/roles/updateStatus", {
                roleIds: ids
            }).then(res => {
                this.$message({
                    type: "success",
                    message: "停用成功"
                });
                this.getData();
            });
        },

        //启用
        enableRole() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            let ids = "";

            this.multipleSelection.forEach(role => {
                if (role.enableFlag == 1) {
                    ids += role.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            this.$postSimple("management/roles/updateStatus", {
                roleIds: ids
            }).then(res => {
                this.$message({
                    type: "success",
                    message: "启用成功"
                });
                this.getData();
            });
        },

        //点击一行
        rowclick(row) {
            this.inputFormDisabled = true;
            this.operateType == "none";
            //
            // event.cancelBubble = false;

            // this.$refs.multipleTables.toggleRowSelection(row);
            // console.log(event.target);
            // alert(event.target.nodeName);

            var id = row.id;

            this.selectedID = id;
            let url = "/management/sysUser/queryUser";

            this.$fetch(url, { id: id }).then(res => {
                this.editData = res.datas;
                this.inputForm = this.editData;
                var date = [
                    new Date(this.editData.startDate),
                    new Date(
                        this.editData.endDate == null
                            ? ""
                            : this.editData.endDate
                    )
                ];

                this.inputForm.date = date;
                // this.inputFormDisabled = true;
                // this.multipleSelection.push(row);
                this.flag = false;
                this.$refs.multipleTables.clearSelection();
                this.flag = true;
                this.$refs.multipleTables.toggleRowSelection(row);
            });
        },

        //表格复选框的改变
        handleSelectionChanges(val) {
            if (this.flag) {
                this.multipleSelection = val;
                var length = val.length;
                //erp用户不可编辑和删除
                var a = "havenot";
                val.forEach(e => {
                    if (e.userTypeCode == "ERP") {
                        a = "have";
                        return;
                    }
                });
                if (a == "have") {
                    this.editBtnFlag = true;
                    this.deleteBtnFlag = true;
                } else {
                    this.editBtnFlag = false;
                    this.deleteBtnFlag = false;
                }
                if (length != 0) {
                    if (val[length - 1].enableFlag == 0) {
                        this.enBtnFlag = true;
                        this.disBtnFlag = false;
                    } else {
                        this.enBtnFlag = false;
                        this.disBtnFlag = true;
                    }
                } else {
                    this.enBtnFlag = true;
                    this.disBtnFlag = true;
                }
            }
        },

        //格式化状态字段
        formatStatus: function(row, column) {
            return row.enableFlag == "0" ? "启用" : "停用";
        },

        //新增按钮
        insertBtn() {
            this.operateType = "new";
            this.inputFormDisabled = false;
            this.inputForm = {};
        },

        saveBtn() {
            if (this.operateType == "new") {
                this.doInsert();
            } else if (this.operateType == "edit") {
                this.doEdit();
            }

            this.operateType == "none";
        },

        //新增提交
        doInsert() {
            var param = {
                userCode: this.inputForm.userCode,
                empolyeeName: this.inputForm.empolyeeName,
                pwd: this.inputForm.pwd,
                userTypeCode: this.inputForm.userTypeCode,
                startDate: formatDate(this.inputForm.date[0], "yyyy-MM-dd"),
                endDate: formatDate(this.inputForm.date[1], "yyyy-MM-dd"),
                userName: this.inputForm.userCode
            };

            let url = "/management/sysUser/saveUser";
            this.$post(url, param).then(res => {
                this.$message({
                    type: "success",
                    message: "新增成功"
                });
                this.getData();
                this.inputForm = {};
                this.inputFormDisabled = true;
            });
        },

        //修改
        doEdit() {
            var param = {
                id: this.selectedID,
                userCode: this.inputForm.userCode,
                empolyeeName: this.inputForm.empolyeeName,
                pwd: this.inputForm.pwd,
                userTypeCode: this.inputForm.userTypeCode,
                startDate: formatDate(this.inputForm.date[0], "yyyy-MM-dd"),
                endDate: formatDate(this.inputForm.date[1], "yyyy-MM-dd")
            };
            let url = "/management/sysUser/saveUser";
            this.$post(url, param).then(res => {
                this.$message({
                    type: "success",
                    message: "修改成功"
                });
                this.getData();
            });
        },

        //编辑按钮
        editBtn() {
            const length = this.multipleSelection.length;

            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }

            this.inputFormDisabled = false;
            this.operateType = "edit";
        },

        //刷新
        refresh() {
            this.inputFormDisabled = true;
            this.inputForm = {};
            this.searchConditions = {};
            this.operateType = "none";
            this.pageSize = 10;
            this.currentPage = 1;
            this.getData();
        },

        //改变页面的条数
        handleSizeChange(size) {
            this.pageSize = size;
            this.getData();
        },
        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //获取数据
        getData() {
            var param = {
                userCode: this.searchConditions.userCode,
                empolyeeName: this.searchConditions.empolyeeName,
                pageNo: this.currentPage,
                pageSize: this.pageSize
            };

            this.$fetch("/management/sysUser/queryUserList", param).then(
                res => {
                    this.totalEle = res.page.totalElements;
                    this.tableData = res.page.content;
                    this.loading = false;
                }
            );
        },

        //编辑
        Editsub() {
            var editParam = this.editform;
            let url = "management/roles/update";
            this.$post(url, editParam).then(res => {
                (this.editform.id = ""),
                    (this.editform.roleName = ""),
                    (this.editform.chineseRoleName = ""),
                    (this.editform.enableFlag = "0"),
                    (this.editform.remark = "");
                this.getData();
            });
            this.editVisible = false;
            this.$message.success(`修改一条数据`);
        },
        editFrom(rows) {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }
            this.editform.remark = this.multipleSelection[length - 1].remark;
            this.editform.roleName = this.multipleSelection[
                length - 1
            ].roleName;
            this.editform.chineseRoleName = this.multipleSelection[
                length - 1
            ].chineseRoleName;
            this.editform.id = this.multipleSelection[length - 1].id;
            this.editVisible = true;
        },
        delAll() {
            const length = this.multipleSelection.length;
            if (length == 0) {
                this.$message.error("请选择一行!!");
                return;
            }

            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let ids = "";
                    for (let i = 0; i < length; i++) {
                        ids += this.multipleSelection[i].id + ",";
                    }
                    ids = ids.substring(0, ids.length - 1);
                    this.$postSimple("/management/sysUser/delUser", {
                        ids: ids
                    }).then(res => {
                        this.getData();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },

        //用户查询
        search() {
            this.currentPage = 1;
            this.getData();
        }
    },
    computed: {}
};
</script>
<style lang="scss">
.user_roles.container{
    background: transparent;
    .el-table__body-wrapper {
        overflow-y: scroll;
        position: relative;
        max-height: 509px;
    }
}
.user_roles {
    height: 96%;
    .row_btns {
        margin-bottom: 10px;
    }
    .el-row{
        display: flex;
    }
    .el-tabs--border-card{
        box-shadow: 0 0px 0px 0 rgba(0,0,0,.12), 0 0 0px 0 rgba(0,0,0,.04);
        border:0px;
    }
    .el-col.el-col-16{
        background-color: #fff;
        padding:10px;
        height:100%;
    }
    .el-col.el-col-7{
        padding-left:0px;
        background-color: #fff;
        margin-left:15px;
    }
    .el-input--mini {
        width: auto;
    }
    .el-card__body {
        padding: 10px;
    }
    .el-main {
        padding: 0 0 5px 15px;
    }
    .demo-input-suffix {
        width: 35%;
        min-width: 275px;
        display: inline-block;
        margin: 10px;
    }
    .el-button--small {
        margin: 10px;
    }
}
</style>

