<!--
  @author:ccf
 -->
<template>
    <div class="menuTable container need_scroll">
        <div class="crumbs">
            <div class="row_btns">
                <el-button type="primary" size="small" @click="getData">
                    <i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
                <el-button type="primary" size="small" @click="openForm">
                    <i class="el-icon-plus marginright"></i>新增</el-button>
                <el-button type="primary" @click="delAll">
                    <i class="el-icon-close marginright"></i>批量删除</el-button>
            </div>
        </div>
        <div v-loading="loading">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table stripe border height="650" :row-class-name="handleSelectedBg" @row-click="rowclick" :data="data" ref="multipleTable"
                @selection-change="handleSelectionChange" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="报表名称" show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <a @click="openDetailedPage(scope.row)" style="color:#3cabf4;cursor:pointer;">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="reportId" show-overflow-tooltip label="文件路径">
                    <template slot-scope="scope">
                        <a @click="openDetailed(scope.row)" style="color:#3cabf4;cursor:pointer;">{{scope.row.reportId}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" show-overflow-tooltip sortable>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" icon="el-icon-edit" @click="openForm(scope.$index, scope.row)">编辑</el-button>
                        <el-button icon="el-icon-close" v-if="scope.row.id > '1'" size="small" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
                        <el-button icon="el-icon-close" v-else size="small" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]"
                    :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
            <el-form :model="formData" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="文件路径">
                    <el-input v-model="formData.reportId" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="formData.type"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="resetbtn" @click="dialogVisible = false">
                    <i class="icon iconfont icon-quxiao marginright"></i>取 消</el-button>
                <el-button type="primary" @click="saveForm">
                    <i class="icon iconfont icon-tijiao-fuben marginright"></i>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                loading: true,
                pagesize: "100",
                total: 0,
                tableData: [],
                currentPage: 1,
                multipleSelection: [],
                select_word: "",
                del_list: [],
                dialogVisible: false,
                dialogTitle: "新建",
                formData: {},
                rowId: "",
                flag: true
            };
        },
        created() {
            this.getData();
        },
        computed: {
            // 搜索
            data() {
                return this.tableData.filter(data => {
                    if (data.name.indexOf(this.select_word) > -1 || data.type.indexOf(this.select_word) > -1) {
                        return data;
                    }
                });
            }
        },
        methods: {
            rowclick(row) {
                //rowclick时候防止执行两次handleSelectionChange
                this.flag = false;
                this.$refs.multipleTable.clearSelection();
                this.flag = true;
                this.$refs.multipleTable.toggleRowSelection(row);
            },
            openDetailedPage(row) {
                this.$router.push({ path: 'index', query: { reportId: row.reportId } });
            },
            openDetailed(row){
                this.$router.push({ path: 'reportDetailManage', query: { reportId: row.reportId } });
            },
            // 改变颜色
            handleSelectedBg({ row, rowIndex }) {
                if (this.multipleSelection.indexOf(row) != -1) {
                    return "selected-row";
                }
                return "";
            },
            //改变页面的条数
            handleSizeChange(size) {
                this.pagesize = size;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //获取数据
            getData() {
                this.loading = true;
                this.$requestData('/sysReport/list', 'get', { 'currentPage': this.currentPage,'pageSize': this.pagesize }).then(res => {
                    this.tableData = [];
                    if (res.datas && res.datas.list.length) {
                        this.tableData = res.datas.list;
                        this.total = res.datas.total;
                    }
                    this.loading = false;
                });
            },
            //编辑当前行数据
            openForm(index, row) {
                if (row) {
                    this.formData = {
                        id: row.id,
                        name: row.name,
                        reportId: row.reportId,
                        config: row.config,
                        type: row.type
                    };
                    this.dialogTitle = "编辑";
                } else {
                    this.dialogTitle = "新建";
                    this.formData = {};
                }
                this.dialogVisible = true;
            },
            handleSelectionChange(val) {
                if (this.flag) { this.multipleSelection = val; }
            },
            saveForm() { // 保存
                var param = this.formData;
                this.$requestData('/sysReport/save', 'post', param).then(res => {
                    this.dialogVisible = false;
                    this.$message.success(`操作成功!!`);
                    this.getData();
                });
            },
            // 删除
            deleteRow(rowId) {
                if (rowId < 2) {
                    this.$message.warning("根目录不可删除!!");
                    return;
                }
                this.$confirm("删除后将不可恢复，是否确认？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let url = "/sysReport/delete/" + rowId;
                        this.$requestData(url, 'post').then(res => {
                            this.$message.success("操作成功!!");
                            this.getData();
                        });
                    })
                    .catch(() => {
                        this.$message.info("已取消删除");
                    });
            },
            //删除选中的所有
            delAll() {
                const length = this.multipleSelection.length;
                if (length == 0) { this.$message.warning("请至少选择一行记录!!"); return; }
                let ids = "";
                for (let i = 0; i < length; i++) {
                    if (this.multipleSelection[i].id > 1) {
                        ids += this.multipleSelection[i].id + ",";
                    }
                }
                ids = ids.substring(0, ids.length - 1);
                let url = "/sysReport/delete/" + ids;
                this.$confirm("删除后将不可恢复，是否确认？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$requestData(url, 'post').then(res => {
                            this.$message.success("操作成功!!");
                            this.multipleSelection = [];
                            this.getData();
                        });
                    })
                    .catch(() => { this.$message.info("已取消删除"); });
            }
        }
    };
</script>

<style scoped>
    .menuTable .crumbs {
        margin-bottom: 0px;
    }

    .menuTable .handle-box {
        margin-bottom: 10px;
        margin-top: -44px;
        float: right;
    }

    .menuTable .handle-input {
        width: 300px;
        display: inline-block;
    }

    .menuTable .el-select {
        width: 100%;
    }
</style>