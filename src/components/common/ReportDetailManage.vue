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
                <el-table-column prop="name" label="名称" sortable>
                </el-table-column>
                <el-table-column prop="url" label="文件路径">
                </el-table-column>
                <el-table-column prop="config" label="配置信息" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sqls" label="sql配置" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="orderNumber" label="序号" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
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
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[50, 100, 150, 200]"
                    :page-size="50" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
            <el-form :model="formData" label-width="70px">
                <el-form-item label="备注">
                    <el-input v-model="formData.remark"></el-input>
                </el-form-item>
                <el-form-item label="文件路径">
                    <el-select v-model="formData.url" filterable placeholder="请选择">
                        <el-option v-for="item in componentList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报表名称">
                    <el-select v-model="formData.parentId" filterable placeholder="请选择">
                        <el-option v-for="item in reportData" :key="item.id" :label="item.name" :value="item.reportId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置信息">
                    <el-input type="textarea" rows="12" v-model="formData.config"></el-input>
                </el-form-item>
                <el-form-item label="sql配置">
                    <el-input type="textarea" rows="12" v-model="formData.sqls"></el-input>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input v-model="formData.orderNumber"></el-input>
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
                pagesize: 50,
                total: 0,
                tableData: [],
                reportData: [],
                currentPage: 1,
                multipleSelection: [],
                select_word: "",
                del_list: [],
                dialogVisible: false,
                dialogTitle: "新建",
                formData: {},
                rowId: "",
                flag: true,
                componentList: [],
                reportId: '',
            };
        },
        created() {
            if(this.$route.query.reportId){
                this.reportId = this.$route.query.reportId;
            }            
            this.getData();
            this.componentList = this.$getComponents();
        },
        computed: {
            // 搜索
            data() {
                return this.tableData.filter(data => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (
                            data.name.indexOf(this.select_word) > -1 ||
                            data.remark.indexOf(this.select_word) > -1
                        ) {
                            return data;
                        }
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
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            //获取数据
            getData() {
                this.loading = false;
                this.$requestData('/sysReportDetail/list', 'get', { 'currentPage': this.currentPage,'pageSize': this.pagesize,'parentId':this.reportId}).then(res => {
                    this.tableData = [];
                    if (res.datas && (res.datas.length || res.datas.list.length)) {
                        this.tableData = res.datas.list ? res.datas.list : res.datas;
                        this.total = res.datas.total;
                    }
                    this.loading = false;
                });
                this.$requestData('/sysReport/list', 'get', { 'currentPage': this.currentPage,'pageSize': this.pagesize,'reportId':this.reportId }).then(res => {
                    this.reportData = [];
                    if (res.datas && (res.datas.length || res.datas.list.length)) {
                        this.reportData = res.datas.list ? res.datas.list : res.datas;
                    }
                });
            },
            //编辑当前行数据
            openForm(index, row) {
                if (row) {
                    this.formData = {
                        id: row.id,
                        remark: row.remark,
                        url: row.url,
                        parentId: row.parentId,
                        config: row.config,
                        sqls: row.sqls,
                        orderNumber: row.orderNumber
                    };
                    this.dialogTitle = "编辑";
                } else {
                    this.dialogTitle = "新建";
                    this.formData = {};
                }
                this.dialogVisible = true;
            },
            format(txt, compress) {/* 格式化JSON源码(对象转换为JSON文本) */
                var indentChar = ' ';
                if (/^\s*$/.test(txt)) {
                    return '';
                }
                try { var data = eval('(' + txt + ')'); }
                catch (e) {
                    alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
                    return 'false';
                };
                var draw = [], last = false, This = this, line = compress ? '' : '\n', nodeCount = 0, maxDepth = 0;

                var notify = function (name, value, isLast, indent/*缩进*/, formObj) {
                    nodeCount++;/*节点计数*/
                    for (var i = 0, tab = ''; i < indent; i++)tab += indentChar;/* 缩进HTML */
                    tab = compress ? '' : tab;/*压缩模式忽略缩进*/
                    maxDepth = ++indent;/*缩进递增并记录*/
                    if (value && value.constructor == Array) {/*处理数组*/
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);/*缩进'[' 然后换行*/
                        for (var i = 0; i < value.length; i++)
                            notify(i, value[i], i == value.length - 1, indent, false);
                        draw.push(tab + ']' + (isLast ? line : (',' + line)));/*缩进']'换行,若非尾元素则添加逗号*/
                    } else if (value && typeof value == 'object') {/*处理对象*/
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);/*缩进'{' 然后换行*/
                        var len = 0, i = 0;
                        for (var key in value) len++;
                        for (var key in value) notify(key, value[key], ++i == len, indent, true);
                        draw.push(tab + '}' + (isLast ? line : (',' + line)));/*缩进'}'换行,若非尾元素则添加逗号*/
                    } else {
                        if (typeof value == 'string') value = '"' + value + '"';
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
                    };
                };
                var isLast = true, indent = 0;
                notify('', data, isLast, indent, false);
                return draw.join('');
            },
            handleSelectionChange(val) {
                if (this.flag) { this.multipleSelection = val; }
            },
            saveForm() { // 保存
                var param = this.formData;
                param.config = param.config ? this.format(param.config,true) : '';
                param.sqls = param.sqls ? param.sqls : '';
                if(param.config == 'false' || param.sqls == 'false'){return;}
                this.$requestData('/sysReportDetail/save', 'post', param).then(res => {
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
                        let url = "/sysReportDetail/delete/" + rowId;
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
                let url = "/sysReportDetail/delete/" + ids;
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