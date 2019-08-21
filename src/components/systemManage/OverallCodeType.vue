<!--
@date:
@author:zjj
@author:elmia
-->
<template>
    <div class="container OverallCodeType need_scroll">
        <div class="row_btn">
            <el-button type="primary" @click="getnew"><i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
            <el-button type="primary" @click="newFrom"><i class="el-icon-plus marginright"></i>新增</el-button>
            <el-button type="primary" @click="showEdit"><i class="el-icon-edit marginright"></i>编辑</el-button>
            <el-button type="primary" @click="deleteRows"><i class="el-icon-close marginright"></i>删除</el-button>
            <el-button type="primary" @click="doEnable" :disabled="enBtnFlag"><i class="icon iconfont icon-zanting marginright"></i>启用</el-button>
            <el-button type="primary" @click="doDisable" :disabled="disBtnFlag"><i class="icon iconfont icon-tingyong marginright"></i>停用</el-button>
        </div>
        <template>
            <div class="demo-input-suffix">
                代码类别中文名称：
                <el-input size="mini" placeholder="请输入代码类别中文名称" prefix-icon="el-icon-search" v-model="searchConditions.categoryCnName" class="marginbigright"></el-input>
                代码类别code：
                <el-input size="mini" placeholder="请输入代码类别code" prefix-icon="el-icon-search" v-model="searchConditions.categoryCode" class="marginbigright"></el-input>
                <el-button type="primary" @click="reset" class="resetbtn"><i class="icon iconfont icon-zhongzhi marginright"></i>重置</el-button>
                <el-button type="primary" @click="doSearch"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
            </div>
        </template>
        <div class="container" v-loading="loading">
            <el-table stripe :data="data" @row-click="rowclick" :row-class-name="handleSelectedBg" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="categoryCnName" label="代码类别中文名称">
                </el-table-column>
                <el-table-column prop="categoryCode" label="代码类别code">
                </el-table-column>
                <el-table-column prop="categoryEnName" label="代码类别英文名称">
                </el-table-column>
                <el-table-column prop="enableFlag" :formatter="formatFlag" label="是否启用">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新建" :visible.sync="newVisible" width="35%" :close-on-click-modal="false">
            <el-form ref="form" :model="newform" label-width="150px">
                <el-form-item label="代码类别中文名称">
                    <el-input v-model="newform.categoryCnName"></el-input>
                </el-form-item>
                <el-form-item label="代码类别code">
                    <el-input v-model="newform.categoryCode"></el-input>
                </el-form-item>
                <el-form-item label="代码类别英文名称">
                    <el-input v-model="newform.categoryEnName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newVisible = false">取 消</el-button>
                <el-button type="primary" @click="newEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="35%" :close-on-click-modal="false">
            <el-form ref="form" :model="editForm" label-width="150px">
                <el-form-item label="代码类别中文名称">
                    <el-input v-model="editForm.categoryCnName"></el-input>
                </el-form-item>
                <el-form-item label="代码类别code">
                    <el-input v-model="editForm.categoryCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="代码类别英文名称">
                    <el-input v-model="editForm.categoryEnName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            enBtnFlag: true,
            disBtnFlag: true,
            loading: true,
            name: "",
            pagesize: "10",
            total: 0,
            currentPage: 1,

            searchConditions: {
                categoryCnName: "",
                categoryCode: ""
            },

            tableData: [],

            multipleSelection: [],

            newform: {
                categoryCnName: "",
                categoryCode: "",
                categoryEnName: ""
            },

            editForm: {
                categoryCnName: "",
                categoryCode: "",
                categoryEnName: ""
            },

            newVisible: false,
            editVisible: false,
            selectList: "",
            tableDatas: [{ id: 0, name: "启用" }, { id: 1, name: "停用" }]
        };
    },
    created() {
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
                }
            };
        },
        //选中背景色
        handleSelectedBg({ row, rowIndex }) {
            if (this.multipleSelection.indexOf(row) != -1) {
                return "selected-row";
            }
            return "";
        },
        rowclick(row) {
            //rowclick时候防止执行两次handleSelectionChange
            this.flag = false;
            this.$refs.multipleTable.clearSelection();
            this.flag = true;
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        //启用
        doEnable() {
            let ids = "";
            this.multipleSelection.forEach(sysCode => {
                if (sysCode.enableFlag == 1) {
                    ids += sysCode.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);

            if (ids.length == 0) {
                this.$message({
                    message: "选中的代码类别无可启用项",
                    type: "info"
                });
            } else {
                let url = "management/sysCode/doCategoryEnableFlag";
                this.$postSimple(url, { ids: ids }).then(res => {
                    this.$message({
                        type: "success",
                        message: "启用成功"
                    });

                    this.getData();
                });
            }
        },
        //停用
        doDisable() {
            let ids = "";
            this.multipleSelection.forEach(sysCode => {
                if (sysCode.enableFlag == 0) {
                    ids += sysCode.id + ",";
                }
            });

            ids = ids.substring(0, ids.length - 1);
            if (ids.length == 0) {
                this.$message({
                    message: "选中的代码类别无可停用项",
                    type: "info"
                });
            } else {
                let url = "management/sysCode/doCategoryEnableFlag";
                this.$postSimple(url, { ids: ids }).then(res => {
                    this.$message({
                        type: "success",
                        message: "停用成功"
                    });
                    this.getData();
                });
            }
        },

        formatFlag: function(row, column) {
            return row.enableFlag == "0" ? "启用" : "停用";
        },
        //打开编辑窗口
        showEdit() {
            var id = this.multipleSelection[this.multipleSelection.length - 1]
                .id;
            this.editVisible = true;
            let url = "management/sysCode/queryCategory";
            this.$fetch(url, { id: id }).then(res => {
                this.editForm = res.datas;
            });
        },

        //保存编辑
        saveEdit() {
            //do something
            var editParam = this.editForm;
            this.sava(editParam, "2");
        },

        //打开新建窗口
        newFrom() {
            this.newVisible = true;
        },
        //刷新
        getnew() {
            this.searchConditions.categoryCnName = "";
            this.searchConditions.categoryCode = "";
            this.getData();
        },

        //在表格中加入@selection-change="handleSelectionChange"
        //这个方法将会在表格选择变化的时候执行
        handleSelectionChange(val) {
            //选中的行将会赋值到multipleSelection
            this.multipleSelection = val;

            if (val.length != 0) {
                this.sysCodeId = val[val.length - 1].id;

                if (val[val.length - 1].enableFlag == 0) {
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
        },

        //删除
        deleteRows() {
            if (this.multipleSelection.length == 0) {
                this.$message.error("请选择一条记录删除！");
            } else {
                this.$confirm("此操作将永久删除该代码类别, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        var ids = "";
                        this.multipleSelection.forEach(value => {
                            ids += value.id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        let url = "management/sysCode/delCategory";
                        var param = { ids: ids };
                        this.$postSimple(url, param).then(res => {
                            this.getData();
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            }
        },

        //改变页面的条数
        handleSizeChange(size) {
            this.pagesize = size;
        },

        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
        },

        //获取数据
        getData() {
            this.tableData = [];
            this.currentPage = 1;
            this.$fetch(
                "management/sysCode/queryCategoryList",
                this.searchConditions
            ).then(res => {
                this.tableData = res.page.content;
                this.loading = false;
            });
        },

        //查询数据
        doSearch() {
            this.getData();
        },
        reset() {
            this.searchConditions = {};
        },
        //新建编辑
        newEdit() {
            var newParam = this.newform;
            this.sava(newParam, "1");
        },
        // 保存接口
        sava(param, index) {
            let url = "management/sysCode/saveCategory";
            this.$post(url, param).then(res => {
                if (index == "1") {
                    this.newform.roleName = "";
                    this.newform.chineseRoleName = "";
                    this.newform.enableFlag = "0";
                    this.newform.remark = "";
                    this.$message.success(`新增一条数据`);
                    this.newVisible = false;
                } else {
                    this.editVisible = false;
                    this.$message.success(`修改一条数据`);
                    this.editForm = {};
                }
                this.getData();
            });
        }
    },
    computed: {
        data() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pagesize,
                this.currentPage * this.pagesize
            );
        }
    }
};
</script>
<style lang="scss">
.OverallCodeType {
    .row_btn {
        margin-bottom: 10px;
    }
    .el-input--mini {
        width: auto;
    }
}
</style>

