<!--
@date:
@author:zjj
-->
<template>
    <div class="main_container container need_scroll">
        <el-container class="">
            <el-container class="header_container" style="padding-top: 7px;">
                <el-aside width="70%" style="height: 100%;background-color: #fff;padding: 10px;">
                    <el-card shadow="never">
                        <div class="um-input">
                            用户编码：
                            <el-input size="mini" placeholder="请输入编号" prefix-icon="el-icon-search" v-model="searchConditions.userCode"></el-input>
                            员工名称：
                            <el-input size="mini" placeholder="请输入名称" prefix-icon="el-icon-search" v-model="searchConditions.empolyeeName"></el-input>
                            <el-button type="primary" @click="resetBtn" class="resetbtn marginbigleft"><i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                            <el-button type="primary" @click="userSerachBtn"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
                        </div>
                    </el-card>
                    <el-table stripe :data="tableData" border style="width: 100%" ref="multipleTables" highlight-current-row @row-click="rowClick">
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
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageDatas.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageDatas.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="pageDatas.totalUser">
                        </el-pagination>
                    </div>
                </el-aside>
                <el-main style="padding: 10px;background-color: #fff;margin-left: 10px;">
                    <div>
                        <el-card shadow="never" style="text-align: right;">
                            <el-button type="primary" icon="el-icon-save" @click="updateTree">保存</el-button>
                        </el-card>
                        <el-main style="max-height: 700px;">
                            <el-tree v-loading="loading" :data="allOrgData" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" :default-checked-keys=userOrgData>
                            </el-tree>
                        </el-main>
                    </div>
                </el-main>
            </el-container>
            <!-- <el-container class="um-container" style="height: 500px; border: 1px solid #eee">
                <el-aside width="70%" style="background-color: rgb(238, 241, 246)">
                    
                    
                </el-aside>
                
            </el-container> -->
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //分页使用的数据
            pageDatas: {
                currentPage: 1,
                pagesize: 10,
                totalUser: 0
            },
            //查询条件
            searchConditions: {
                userCode: "",
                empolyeeName: ""
            },
            //用户数据
            tableData: [],

            //当前用户组织信息
            userOrgData: [],
            //所有组织信息
            allOrgData: [],

            loading: true,

            currentUserId: "",
            defaultProps: {
                children: "children",
                label: "cnName"
            }
        };
    },
    created() {
        this.getUserData();
        this.getTreeData();
    },
    methods: {
        //-----------分页相关------------↓↓↓↓↓↓↓↓↓↓↓↓↓
        //改变页面的条数
        handleSizeChange(size) {
            this.pageDatas.pagesize = size;
            this.getUserData();
        },
        // 分页导航
        handleCurrentChange(val) {
            this.pageDatas.currentPage = val;
            this.getUserData();
        },
        //-----------分页相关------------↑↑↑↑↑↑↑↑↑↑↑↑↑↑

        //格式化状态字段
        formatStatus: function(row, column) {
            return row.enableFlag == "0" ? "启用" : "停用";
        },

        //查询
        userSerachBtn() {
            this.pageDatas.currentPage = 1;
            this.getUserData();
        },
        //重置按钮
        resetBtn() {
            this.searchConditions.userCode = "";
            this.searchConditions.empolyeeName = "";
        },

        //获取用户数据
        getUserData() {
            var param = {
                userCode: this.searchConditions.userCode,
                empolyeeName: this.searchConditions.empolyeeName,
                pageNo: this.pageDatas.currentPage,
                pageSize: this.pageDatas.pagesize
            };

            this.$fetch("/management/sysUser/queryUserList", param).then(
                res => {
                    this.tableData = res.page.content;
                    this.pageDatas.totalUser = res.page.totalElements;
                }
            );
        },

        //点击行更新右边组织信息
        rowClick(row) {
            this.userOrgData = [];
            this.currentUserId = row.id;
            let url = "management/sysUser/queryUser";
            var userOrg = [];
            this.$fetch(url, { id: row.id }).then(res => {
                userOrg = res.datas.bizOrgs;

                userOrg.forEach(element => {
                    this.userOrgData.push(element.id);
                });

                this.getTreeData();
                this.loading = false;
            });
        },
        //获得所有组织信息
        getTreeData() {
            this.allOrgData = JSON.parse(localStorage.getItem("allOrgData"));
            if (this.allOrgData && this.allOrgData.length > 0) {
                this.loading = false;
            }
            let url = "/management/organization/getOrgsTree";
            this.$fetch(url).then(res => {
                this.allOrgData = res.datas;
                this.loading = false;
                localStorage.setItem(
                    "allOrgData",
                    JSON.stringify(this.allOrgData)
                );
            });
        },

        updateTree() {
            if (!this.currentUserId) {
                this.$message.warning("请选择需要更新的用户!");
                return;
            }
            let roleMenus = this.$refs.tree.getCheckedKeys();
            let params = "";
            for (let menusId of roleMenus) {
                params += menusId + ",";
            }
            params = params.substring(0, params.length - 1);

            let url = "/management/sysUser/saveUserOrgs";
            this.$postSimple(url, {
                id: this.currentUserId,
                orgIds: params
            }).then(res => {
                this.$message.success("操作成功!!");
            });
        }
    },
    computed: {}
};
</script>
<style>
.main_container.container {
    background-color: transparent;
}
.um-container .el-main {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 0 0 5px;
}
.header_container .el-main {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 0 5px 3px;
}
.um-input .el-input__inner {
    width: 150px;
}

.main_container .el-header {
    /* background-color: #B3C0D1; */
    color: #333;
    padding: 0 !important;
}
.main_container .el-card {
    background-color: transparent;
}
.el-input--mini {
    width: auto;
}
.el-card__body {
    padding: 10px;
}
.el-card {
    background-color: #d9edf7;
}
</style>


