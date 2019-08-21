 <!--
  @date:2018年11月13日16:05:43
  @author:zjj
 -->
 <template>
    <div class="page-notice container">
        <div style="height:100%" v-loading="loading">
            <el-container style="height:100%">
                <el-aside width="30%" style="background-color: #fff;margin-right:5px;padding:10px;">
                    <div class="titlecss" style="width:">
                        <p>选择页面</p>
                    </div>

                    <div class="tree-input">
                        <el-input v-model="menuName" placeholder="">
                            <template slot="append">
                                <el-button icon='el-icon-search' @click="searchTree"></el-button>
                            </template>
                        </el-input>
                    </div>
                    <el-tree @node-click="handleNodeClick" :filter-node-method="treeFilter" ref="pageTree" class="pageTree" :data="treeData" default-expand-all node-key="id" highlight-current :props="defaultProps">
                    </el-tree>
                </el-aside>
                <el-main style="border: 1px solid #eee;background: #fff;margin-left: 10px;overflow: hidden;">
                    <div class="titlecss">
                        <p>设置页面公告</p>
                    </div>
                    <div class="main-btn-row">
                        <el-button :disabled="editBtnDisable" @click="edit" icon="el-icon-edit">编辑</el-button>
                        <el-button :disabled="saveBtnDisable" @click="cancel" icon="el-icon-error">取消</el-button>
                        <el-button :disabled="saveBtnDisable" @click="save" icon="el-icon-success">保存</el-button>
                    </div>

                    <el-input v-loading="noticeLoading" :disabled="saveBtnDisable" type="textarea" :rows="20" v-model="noticeContent">
                    </el-input>
                </el-main>
            </el-container>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: true,
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            noticeContent: "",
            //页面名称查询字段
            menuName: "",
            editBtnDisable: true,
            saveBtnDisable: true,

            //当前选中的节点
            selectedData: {},

            noticeLoading: false
        };
    },
    computed: {
        data() {
            return this.tableData.slice(
                (this.currentPage - 1) * this.pagesize,
                this.currentPage * this.pagesize
            );
        }
    },
    created() {
        this.getTreeData();
    },
    methods: {
        edit() {
            this.editBtnDisable = true;
            this.saveBtnDisable = false;
        },

        save() {
            //获得语言
            // (navigator.language || navigator.browserLanguage).toLowerCase();
            let param = {
                title: this.selectedData.url,
                page: this.selectedData.url,
                bLanguage: "zh-cn",
                bContent: this.noticeContent
            };

            this.$post("pageNotice/save", param).then(res => {
                this.$message({
                    message: "保存成功",
                    type: "success"
                });
            });
        },
        cancel() {
            this.saveBtnDisable = true;
            this.editBtnDisable = false;
            this.getNotice();
        },

        handleNodeClick(data) {
            this.selectedData = data;

            this.saveBtnDisable = true;
            //只有子节点才是真正的页面
            if (data.children.length > 0) {
                this.noticeContent = "此节点是父菜单，不可设置公告。";
                this.editBtnDisable = true;
                return;
            }

            this.editBtnDisable = false;
            this.getNotice();
        },
        //查询出notice
        getNotice() {
            this.noticeLoading = true;
            this.$fetch("pageNotice/queryNotice", {
                page: this.selectedData.url,
                language: "zh-cn"
            }).then(res => {
                this.noticeContent = res.datas;
                this.noticeLoading = false;
            });
        },

        //触发搜索
        searchTree() {
            this.$refs.pageTree.filter();
        },
        //对子节点进行筛选且只针对子节点
        treeFilter(value, data, node) {
            return (
                this.menuName == "" ||
                (data.name.indexOf(this.menuName) > -1 &&
                    data.children.length == 0)
            );
        },
        // 键盘enter事件
        keyupSubmit() {
            document.onkeydown = e => {
                let _key = window.event.keyCode;
                if (_key === 13) {
                    this.searchBtn();
                }
            };
        },
        getTreeData() {
            this.loading = true;
            this.$fetch("/management/menus/menuForTree").then(res => {
                this.treeData = res.page.content;
                this.loading = false;
            });
        }
    }
};
</script>
    <style lang="scss">
.page-notice.container {
    background-color: transparent;
    padding: 0;
}
.page-notice {
    height: 100%;
    .tree-input {
        height: 40px;
    }
    .pageTree {
        height: calc(100% - 75px);
        overflow-y: auto;
    }
    .el-main {
        padding: 10px;
    }
    .main-btn-row {
        margin-left: 5px;
        margin-bottom: 6px;
    }
}
</style>
    
    
    