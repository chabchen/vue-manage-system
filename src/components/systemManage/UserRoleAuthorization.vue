<!--
@date:2018/07/04
@author:Elina
@modifyAuthor:
@modifyDate:
@describe:
-->
<template>
    <div class="useroles container need_scroll">
        <el-row :gutter="24" style="display: flex;">
            <el-col :span="16" style="min-width:230px;">
                <div class="grid-content bg-purple">
                    <div class="row_btns" style="margin-top:10px;">
                        <el-button type="primary" @click="refresh">
                            <i class="icon iconfont icon-shuaxin marginright"></i>刷新
                        </el-button>
                        <el-button type="primary" @click="editBtn" :disabled="editVisible">
                            <i class="el-icon-edit marginright"></i>编辑
                        </el-button>
                    </div>
                    <template>
                        <div class="demo-input-suffix">用户编码：
                            <el-input
                                size="mini"
                                placeholder="请输入编号"
                                prefix-icon="el-icon-search"
                                v-model="searchConditions.userCode"
                            ></el-input>
                        </div>
                        <div class="demo-input-suffix">员工名称：
                            <el-input
                                size="mini"
                                placeholder="请输入名称"
                                prefix-icon="el-icon-search"
                                v-model="searchConditions.empolyeeName"
                            ></el-input>
                        </div>
                        <el-button type="primary" @click="resest" class="resetbtn">
                            <i class="icon iconfont icon-zhongzhi marginright"></i>重置
                        </el-button>
                        <el-button type="primary" @click="search">
                            <i class="icon iconfont icon-sousuo marginright"></i>搜索
                        </el-button>
                    </template>
                    <div class="container" v-loading="loading">
                        <el-table
                            stripe
                            :data="tableData"
                            border
                            style="width: 100%"
                            highlight-current-row
                            ref="userTable"
                            @current-change="getRoles"
                        >
                            <el-table-column prop="userCode" label="用户编码"></el-table-column>
                            <el-table-column prop="empolyeeName" label="员工名称"></el-table-column>
                            <el-table-column prop="belongPartnerName" label="所属部门"></el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="pagesize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="totalone"
                            ></el-pagination>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="grid-content bg-purple">
                    <div class="user_right">
                        <div>
                            <span>当前选择用户编码：</span>
                            {{currentUser.userCode}}
                        </div>
                        <div>
                            <span>当前选择员工名称：</span>
                            {{currentUser.empolyeeName}}
                        </div>
                        <el-button type="primary" @click="insertBtn" :disabled="rightBtnDisable">
                            <i class="el-icon-plus marginright"></i>新增
                        </el-button>
                        <el-button type="primary" @click="deleteBtn" :disabled="rightBtnDisable">
                            <i class="el-icon-close marginright"></i>删除
                        </el-button>
                        <el-button type="primary" @click="saveBtn('1')" :disabled="rightBtnDisable">
                            <i class="icon iconfont icon-baocun marginright"></i>保存
                        </el-button>
                        <el-button type="primary" @click="cencar" :disabled="rightBtnDisable">
                            <i class="el-icon-close marginright"></i>取消
                        </el-button>
                        <el-table
                            :data="datatwo"
                            ref="multipleTabletwo"
                            tooltip-effect="dark"
                            border
                            style="width: 100%;margin-top:10px;"
                            @row-click="rowclicks"
                            @selection-change="handleSysCodeSelect"
                        >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="roleName" label="角色代码"></el-table-column>
                            <el-table-column prop="chineseRoleName" label="角色名称"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog
            title
            :visible.sync="editVisible"
            :close-on-click-modal="false"
            width="60%"
            class="useroledislog"
        >
            <template>
                <div class="demo-input-suffix" style="display: initial;">角色代码：
                    <el-input
                        size="mini"
                        placeholder="请输入角色代码"
                        prefix-icon="el-icon-search"
                        v-model="user_role_Id"
                    ></el-input>
                </div>
                <div class="demo-input-suffix" style="display: initial;">角色名称：
                    <el-input
                        size="mini"
                        placeholder="请输入角色名称"
                        prefix-icon="el-icon-search"
                        v-model="user_role_name"
                    ></el-input>
                </div>
                <div class="demo-input-suffix" style="display: inline;">
                    <el-button type="primary" @click="reset_btn" class="resetbtn">
                        <i class="icon iconfont icon-zhongzhi marginright"></i>重置
                    </el-button>
                    <el-button type="primary" @click="getDatathree">
                        <i class="icon iconfont icon-sousuo marginright"></i>搜索
                    </el-button>
                </div>
            </template>
            <div class="container" v-loading="loading">
                <el-table
                    ref="multipleTablethree"
                    :data="datathree"
                    height="452px"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChangethree"
                    @row-click="rowclickthree"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="roleName" label="角色代码"></el-table-column>
                    <el-table-column prop="chineseRoleName" label="角色名称"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChangethree"
                        @current-change="handleCurrentChangethree"
                        :current-page="currentPagethree"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableDatathree.length"
                    ></el-pagination>
                </div>
                <div style="text-align:center;">
                    <el-button type="primary" @click="editVisible = false">
                        <i class="icon iconfont icon-quxiao marginright"></i>取消
                    </el-button>
                    <el-button type="primary" @click="comfirmBtn">
                        <i class="icon iconfont icon-baocun marginright"></i>确认
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "user_role_authorization",
    components: {},
    data() {
        return {
            currentUser: {},
            savedis: true,
            loading: true,
            tableDatas: [],
            tableDatathree: [],
            multipleSelections: [],
            multipleSelectionthree: [],
            currentPagethree: 1,
            pagesizethree: 10,
            rightBtnDisable: true,
            editVisible: false,
            searchConditions: {
                userCode: "",
                empolyeeName: "",
                belongPartnerName: ''
            },

            pagesize: 10,
            totalone: 0,
            currentPage: 1,

            user_role_Id: "",
            user_role_name: "",
            multipleSelection: [],
            tableData: [],
        };
    },
    mounted() {
        this.getData();
        this.keyupSubmit();
    },
    methods: {
        // 键盘enter事件
        keyupSubmit() {
            document.onkeydown = e => {
                let _key = window.event.keyCode;
                if (_key === 13) {
                    this.getData();
                    this.getDatathree();
                }
            }
        },
        //点击编辑之后的事件
        //新增按钮显示
        insertBtn() {
            this.editVisible = true;
            this.getDatathree();
        },
        //角色的删除
        deleteBtn() {
            const length = this.multipleSelections.length;
            if (length == 0) {
                this.$message.info("请选择一行!!");
                return;
            }
            this.$confirm("此操作将永久删除该用户的角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    for (var i = 0; i < this.tableDatas.roles.length; i++) {
                        for (var j = 0; j < this.multipleSelections.length; j++) {
                            if (this.tableDatas.roles[i].id == this.multipleSelections[j].id) {
                                this.tableDatas.roles.splice(i, 1);
                            }
                        }
                    }
                    this.saveBtn('2');
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        //右边表格复选框的改变
        handleSysCodeSelect(val) {
            this.multipleSelections = val;
        },
        //取消
        cencar() {
            this.savedis = true;
            this.rightBtnDisable = true;
        },

        //弹出框的事件
        //弹出框的确定按钮
        comfirmBtn() {
            for (var i = 0; i < this.multipleSelectionthree.length; i++) {
                this.tableDatas.roles.push(this.multipleSelectionthree[i])
            }
            this.editVisible = false;
        },
        //弹出框的重置
        reset_btn() {
            this.user_role_Id = "";
            this.user_role_name = "";
        },
        //弹出框复选框的改变
        handleSelectionChangethree(val) {
            this.multipleSelectionthree = val;
        },
        //弹出框点击一条数据
        rowclickthree(row) {
            this.$refs.multipleTablethree.toggleRowSelection(row);
        },

        //弹出框的页面条数的改变
        handleCurrentChangethree(val) {
            this.currentPagethree = val;
        },
        //弹出框获取数据
        getDatathree() {
            this.currentPagethree = 1;
            var params = {
                roleName: this.user_role_Id,
                chineseRoleName: this.user_role_name
            };
            this.tableDatathree = [];
            this.$fetch("/management/roles/roleList", params).then(res => {
                let data = res.datas.content
                if (this.tableDatas.roles.length != 0 && this.tableDatas.roles.length != data.length) {
                    for (var i = 0; i < this.tableDatas.roles.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (this.tableDatas.roles[i].id == data[j].id) {
                                data.splice(j, 1);
                            }
                        }
                    }
                    this.tableDatathree = data
                } else if (this.tableDatas.roles.length == data.length) {
                    this.tableDatathree = [];
                } else {
                    this.tableDatathree = data;
                }
                this.loading = false;
            });
        },


        //右边按钮及表格的操作事件
        //点击一行
        rowclicks(row) {
            this.$refs.multipleTabletwo.toggleRowSelection(row);
        },

        //左边按钮及表格的操作事件
        //重置
        resest() {
            this.searchConditions.userCode = "";
            this.searchConditions.empolyeeName = "";
            this.searchConditions.belongPartnerName = '';
        },
        //表格单选框的改变
        getRoles(row) {
            this.rightBtnDisable = true;
            this.currentUser = row;
            //根据选择的类别获取子集
            let url = "/management/sysUser/queryUser";
            this.$fetch(url, { id: row.id }).then(res => {
                this.tableDatas = res.datas
            });
        },
        //保存
        saveBtn(index) {
            let roleIds = '';
            this.tableDatas.roles.forEach(res => {
                roleIds += res.id + ","
            });
            roleIds = roleIds.substring(0, roleIds.length - 1);
            var data = { id: this.tableDatas.id, roleIds: roleIds }
            this.$postSimple("management/sysUser/saveUserRoles", data).then(res => {
                if (index == '1') {
                    this.$message.success("新增成功");
                } else {
                    this.$message.success("删除成功");
                }
                this.getData();
                this.savedis = true;
                this.rightBtnDisable = true;
            });
        },

        //编辑按钮
        editBtn() {
            this.rightBtnDisable = false;
            this.savedis = false;
        },

        //刷新
        refresh() {
            this.searchConditions = {};
            this.getData();
        },

        //改变页面的条数
        handleSizeChange(size) {
            this.pagesize = size;
            this.getData();
        },
        //改变页面的条数
        handleSizeChangethree(size) {
            this.pagesizethree = size;
            this.getDatathree();
        },
        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //获取数据
        getData() {
            var data = {
                userCode: this.searchConditions.userCode,
                empolyeeName: this.searchConditions.empolyeeName,
                pageNo: this.currentPage,
                pageSize: this.pagesize
            }
            this.$fetch(
                "/management/sysUser/queryUserList",
                data
            ).then(res => {
                this.totalone = res.page.totalElements;
                this.tableData = res.page.content;
                this.loading = false;

                this.$refs.userTable.setCurrentRow(this.tableData[0]);
            });
        },
        //编辑
        Editsub() {
            var editParam = this.editform;
            let url = "management/roles/update";
            this.$post(url, editParam).then(res => {
                (this.editform.id = ""),
                    (this.editform.roleName = ""),
                    (this.editform.chineseRoleName = ""),
                    (this.editform.remark = "");
                this.getData();
            });
            this.editVisible = false;
            this.$message.success(`修改一条数据`);
        },

        //用户查询
        search() {
            this.currentPage = 1;
            this.getData();
        }
    },
    computed: {
        dataone() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pagesize,
                this.currentPage * this.pagesize
            )
        },
        datatwo() {
            return this.tableDatas.roles
        },
        datathree() {
            return this.tableDatathree.slice(
                (this.currentPagethree - 1) * this.pagesizethree,
                this.currentPagethree * this.pagesizethree
            );
        }
    }
};
</script>
<style lang='scss'>
.useroles.container {
    background-color: transparent;
}
.useroles {
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
        display: inline-block;
        width: 35%;
        margin-bottom: 10px;
        min-width: 294px;
        .el-input {
            width: auto;
        }
    }
    .el-button--small {
        margin: 3px;
    }
    .useroledislog {
        .demo-input-suffix {
            width: 35%;
            margin-bottom: 10px;
            min-width: 353px;
        }
    }
    .el-col-7 {
        width: 29.16667%;
        padding: 10px;
        background-color: #fff;
        margin-left: 20px;
    }
    .el-col-16 {
        width: 66.66667%;
        padding-left: 12px;
        padding-right: 12px;
        min-width: 230px;
        background: #fff;
    }
}
</style>

