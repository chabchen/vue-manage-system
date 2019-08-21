<template>
    <div class="contentmenu container need_scroll">
        <el-row :gutter="24">
            <el-col :span="12"><div class="grid-content bg-purple">
                <template>
                <el-card shadow="never">用户</el-card>
                </template>
                <template>
                    <div class="demo-input-suffix">用户编码：
                        <el-input placeholder="请输入编号" prefix-icon="el-icon-search" v-model="user_ID"></el-input>
                    </div>
                    <div class="demo-input-suffix">员工名称：
                        <el-input placeholder="请输入名称" prefix-icon="el-icon-search" v-model="user_name"></el-input>
                    </div>
                </template>
                <div class="user_btn">
                    <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
                    <el-button type="primary" icon="el-icon-close" @click="user_reset">重置</el-button>
                </div>
                <template>
                <el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                    <el-table-column prop="id" label="用户编码" width="180"></el-table-column>
                    <el-table-column prop="chineseRoleName" label="员工名称"></el-table-column>
                </el-table>
            </template>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
                <div class="user_res">
                    <el-card shadow="never">菜单
                        <template>
                            <el-button type="primary" class="user_save">保存</el-button>
                        </template>
                    </el-card>
                </div>
                <el-tree :data="data2" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" :default-checked-keys="[5]">
                </el-tree>
            </div></el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
      return {
        tableData:[],
        pagesize:'10',
        currentPage:1,
        user_ID:'',
        user_name:'',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
        data() {
            return this.tableData
        }
    },
    created() {
        // this.getData();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getData () {
            this.$fetch('management/roles/roleList').then((res) => {
                this.tableData = res.datas.content;
            })
        },
        user_reset () {
            this.user_ID = '';
            this.user_name = '';
        }
    }
}
</script>
<style lang="scss">
.contentmenu{
    .el-card{
        background-color: #d9edf7;
    }
    .user_save{
        float: right;
        margin-top: -7px;
    }
    .demo-input-suffix{
        margin-top:15px;
    }
    .user_btn .el-button--small{
        margin: 12px 12px 12px 0;
    }
    .has-gutter{
        padding:0 12px;
    }
    .el-input--small .el-input__inner{
        /* margin-top: 10px; */
        height: 32px;
        line-height: 32px;
    }
    .el-card__body {
        padding: 10px;
    }
}

</style>


