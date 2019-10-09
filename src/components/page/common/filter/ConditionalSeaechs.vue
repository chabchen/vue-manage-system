<template>
    <div class="inline_block">
        <div class="inline_block ml_25" v-for="(ieo,index) in searchData.searchDate" :key="index">
            <div class="grid-content bg-purple" v-if="ieo.dataShow">
                <div class="block">
                    <div class="demonstration">{{ieo.title}}</div>
                    <el-date-picker class="wd_150" v-model="ieo.beginDate" :type='ieo.dateType' placeholder="选择日期" />
                </div>
            </div>
        </div>
        <div class="inline_block ml_25" v-for="(item,index) in searchData.searchSelect" :key="index+10">
            <div class="grid-content bg-purple" v-if="item.dataShow">
                <div class="block">
                    <div class="demonstration">{{item.title}}</div>
                    <filterSelect class="wd_150" :prop="{searchDatas:searchData.searchSelect,data:item}" />
                </div>
            </div>
        </div>
        <div class="inline_block select_posion" v-if="!searchData.hideSearchBtn">
            <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">查询</el-button>
        </div>
    </div>
</template>

<script>
    import filterSelect from './filter-select.vue'
    import { requestData } from '@/api/RequestData';
    export default {
        components: { filterSelect },
        props: { prop: Object },
        data() {
            return {
                searchData: {},
                params: ""
            }
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if (!newValue) { return; }
                this.params = newValue;
                this.prop.params = "";
            }
        },
        created() {
            this.searchData = this.prop.config.searchData;
            //this.initFilterData();
        },
        methods: {
            initFilterData: async function () {
                for (let obj of this.searchData.searchSelect) {
                    if (obj.sourceType && obj.sourceType == "presto" && obj.sql) {
                        await requestData('/report/list', 'post', { params: obj.sql }).then(res => {
                            if (!res.datas || !res.datas.length) { return; }
                            obj.options = res.datas;
                            if (obj.value) { obj.value = res.datas[0].value; }
                        });
                    }
                }
                this.searchEvent();
            },
            searchEvent() {
                let param = {};
                let concatArr = [];
                concatArr = this.searchData.searchSelect.concat(this.params.searchSelect ? this.params.searchSelect : []);
                let temp = {};   //用于tableField判断重复
                let result = [];  //最后的新数组
                concatArr.map(function (item, index) {
                    if (item.tableField && !temp[item.tableField]) {
                        result.push(item);
                        temp[item.tableField] = true;
                    }
                });
                param.searchSelect = result;
                if (this.params.markPointName) {
                    param.markPointName = this.params.markPointName;
                }
                console.log(param);
                this.$parent.$parent.parentSearchEvent(param);
            }
        }
    }


</script>
<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
    }

    .block .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 100%;
    }

    .demonstration {
        line-height: 40px
    }

    .ax-search {
        float: right;
        margin-right: 6px;
    }

    .inline_block {
        display: inline-block;
    }

    .ml_25 {
        margin-left: 15px;

    }

    .wd_150 {
        width: 158px !important;
    }

    .el-input--small .el-input__inner {
        height: 28px;
        line-height: 28px;
    }

    .select_posion {
        float: right;
        margin-top: 40px;
        margin-left: 30px;
        margin-bottom: 10px;
    }
</style>