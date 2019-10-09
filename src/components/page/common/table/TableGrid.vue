<template>
    <div :style="{width:widthData}" class="line-box">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <el-table :data="tableData" class="height_390" border stripe>
            <template v-for="(col, index) in tableColumns">
                <el-table-column show-overflow-tooltip :key="index" :prop="col.prop" :label="col.label"></el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>

    export default {
        props: { prop: Object },
        data() {
            return {
                loading: false,
                widthData: '100%',
                title: '',
                tableColumns: [],
                tableData: []
            }
        },
        created() {
            this.tableColumns = this.prop.config.tableColumns;
            this.tableData = this.prop.config.tableData;
            this.title = this.prop.config.title;
            if(this.prop.config.widthData){
                this.widthData = this.prop.config.widthData;
            }            
            //this.getData();
        },
        methods: {
            getData: function (params) {
                this.loading = true;
                this.$requestData('/report/list', 'post').then(res => {

                    if (res.datas && res.datas.length) {
                        this.tableData = [];
                        this.tableData = res.datas;
                        this.tableColumns = res.datas2;
                    }
                    this.loading = false;
                });
            }
        }
    }
</script>
<style>
    .el-row .el-button--small,
    .el-button--small.is-round {
        padding: 2px;
    }

    .head-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        color: #333333;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        background: #409eff;
        color: #fff;
        padding-left: 15px;
        margin: 10px 0 10px 0;
    }

    .head-title p {
        display: inline-grid;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
    }

    .height_390 {
        height: 390px
    }
</style>