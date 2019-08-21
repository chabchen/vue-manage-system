 <!--
  @author:ccf
 -->
 <template>
    <div class="menuTable container need_scroll">
        <div class="crumbs">
            <div class="row_btns">
                <el-button type="primary" size="small" @click="getData"><i class="icon iconfont icon-shuaxin marginright"></i>刷新</el-button>
                <el-button type="primary" size="small" @click="openForm"><i class="el-icon-plus marginright"></i>新增</el-button>
                <el-button type="primary" @click="delAll"><i class="el-icon-close marginright"></i>批量删除</el-button>
            </div>
        </div>
        <div v-loading="loading">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="search"><i class="icon iconfont icon-sousuo marginright"></i>搜索</el-button>
            </div>
            <el-table stripe border height="650" :row-class-name="handleSelectedBg" @row-click="rowclick" 
                :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
                ref="multipleTable" @selection-change="handleSelectionChange" 
                :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="名称" sortable width="150">
                </el-table-column>
                <el-table-column prop="description" label="文件路径" sortable width="120">
                </el-table-column>
                <el-table-column prop="type" label="类型" sortable>
                </el-table-column>
                <el-table-column prop="url" label="链接" sortable>
                </el-table-column>
                <el-table-column prop="icon" label="图标" sortable>
                </el-table-column>
                <el-table-column prop="parentName" label="所属菜单">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" icon="el-icon-edit" @click="openForm(scope.$index, scope.row)">编辑</el-button>
                        <el-button icon="el-icon-close" v-if="scope.row.id > '1'" size="small" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
                        <el-button icon="el-icon-close" v-else size="small" disabled type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
            <el-form :model="formData" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="父菜单">
                    <el-select v-model="formData.parentId" filterable placeholder="请选择">
                        <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件路径">
                    <el-input v-model="formData.description"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input disabled v-model="formData.type"></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <el-input v-model="formData.url"></el-input>
                    <el-checkbox v-model="formData.outsideUrl">外部链接？</el-checkbox>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="formData.icon"></el-input>
                </el-form-item>
                <el-form-item label="排序号">
                    <el-input v-model="formData.orderNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="resetbtn" @click="dialogVisible = false"><i class="icon iconfont icon-quxiao marginright"></i>取 消</el-button>
                <el-button type="primary" @click="saveForm"><i class="icon iconfont icon-tijiao-fuben marginright"></i>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
    
<script>

import fetch from '../common/utils/common.js'

export default {
    
    name: "menu",
    data() {
        return {
            loading: true,
            pagesize: "10",
            tableData: [],
            currentPage: 1,
            multipleSelection: [],
            select_word: "",
            del_list: [],
            dialogVisible: false,
            dialogTitle: "新建",
            formData: {
                parentId: "",
                type: "back"
            },
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
                        data.parentName.indexOf(this.select_word) > -1
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
        },
        // 分页导航
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //获取数据
        getData() {
            let url = "/sysMenu/menus/list";
            fetch(url).then(res => {
                this.tableData = res.data;
                this.loading = false;
            });
        },
        search() {},
        //编辑当前行数据
        openForm(index, row) {
            if (row) {
                this.formData = {
                    id: row.id,
                    name: row.name,
                    parentId: row.parentId,
                    description: row.description,
                    type: row.type,
                    url: row.url,
                    outsideUrl: row.outsideUrl == 1 ? false : true,
                    icon: row.icon,
                    orderNo: row.orderNo
                };
                this.dialogTitle = "编辑";
            } else {
                this.dialogTitle = "新建";
                this.formData = { parentId: "", type: "back" };
            }
            this.dialogVisible = true;
        },
        handleSelectionChange(val) {
            if (this.flag) {
                this.multipleSelection = val;
            }
        },
        // 保存
        saveForm() {
            var param = this.formData;
            param.parentId = param.parentId ? param.parentId : "0";
            //outsideUrl=true则设置为0，=false则设置为1
            if (param.outsideUrl) {
                param.outsideUrl = 0;
            } else {
                param.outsideUrl = 1;
            }
            let url = "/management/menu/add";
            this.$post(url, param).then(res => {
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
                let url = "management/menus/delete/" + rowId;
                this.$post(url, {}).then(res => {
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
            if (length == 0) {
                this.$message.warning("请至少选择一行记录!!");
                return;
            }
            let ids = "";
            for (let i = 0; i < length; i++) {
                if (this.multipleSelection[i].id > 1) {
                    ids += this.multipleSelection[i].id + ",";
                }
            }
            ids = ids.substring(0, ids.length - 1);
            let url = "management/menus/delete/" + ids;
            this.$confirm("删除后将不可恢复，是否确认？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post(url, {}).then(res => {
                        this.$message.success("操作成功!!");
                        this.multipleSelection = [];
                        this.getData();
                    });
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        }
    }
};
</script>
    
<style scoped>
.menuTable .crumbs{
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
    