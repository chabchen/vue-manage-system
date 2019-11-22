<template>
    <div class="container">
        <div :style="{height: div_height}"></div>
        <div class="fixed_top" ref="elememt">
            <div class="filter-handler" @click="toggleFilterBar"><span>筛选器</span></div>
            <async-load-comp v-show="show_selector" v-for="(item,index) in comps" :key="index+'index'" :app="item.app" :prop="item.prop"></async-load-comp>
        </div>
        <async-load-comp v-for="(item,index) in comps2" :key="index" :app="item.app" :prop="item.prop"></async-load-comp>
    </div>
</template>
<script>
    import asyncLoadComp from './asyncLoadComp.vue'
    export default {
        components: { asyncLoadComp },
        data() {
            return {
                reportId: '',
                filters: "filter/ConditionalSeaechs,filter/filter-radio",
                comps: [],
                comps2: [],
                paramDatas: "",
                show_selector: true,
                div_height: "",
                fixed_height: "",
            }
        },
        created() {
            if (!this.$route.query.reportId) { return; }
            this.reportId = this.$route.query.reportId;
            this.loadReportConfig();
            // let height= this.$refs.qqqqqq;  //100
        //    console.log(height)      
        },
        watch: {
            $route(newValue, oldValue) {
                this.comps = [];
                this.comps2 = [];
                this.reportId = newValue.query.reportId;
                this.loadReportConfig();
            }
        },
        methods: {
            loadReportConfig() {//根据报表Id查询当前报表的所有组件并加载组件
                this.paramDatas = "";
                this.$requestData('/sysReportDetail/list', 'get', { parentId: this.reportId, pageSize: 1000, sortNames: 'order_number' }).then(res => {
                    let tableData = [];
                    if (res.datas && res.datas.length) {
                        tableData = res.datas;
                        this.loadReport(tableData);
                    }
                });
            },
            loadReport(data) {
                for (let i = 0, j = data.length; i < j; i++) {
                    if (this.filters.indexOf(data[i].url) > -1) {
                        this.comps.push({ app: data[i].url, prop: { config: JSON.parse(data[i].config), sqls: data[i].sqls, params: "" } });
                    } else {
                        this.comps2.push({ app: data[i].url, prop: { config: JSON.parse(data[i].config), sqls: data[i].sqls, params: "" } });
                    }
                }
            },
            parentSearchEvent(datas) {
                datas = this.paramDatas ? this.addParam(datas) : datas;
                for (let data of this.comps) {
                    data.prop.params = datas;
                }
                for (let data of this.comps2) {
                    data.prop.params = datas;
                }
                setTimeout(() => {
                    this.div_height= this.$refs.elememt.offsetHeight -20 +"px";
                    this.fixed_height = this.$refs.elememt.offsetHeight -20 +"px";
                }, 500);
            },
            addParam(datas) {
                let param = {};
                let searchSelect = this.concatParams(this.paramDatas.searchSelect, datas.searchSelect);
                let searchDate = this.concatParams(this.paramDatas.searchDate, datas.searchDate);
                param.searchSelect = searchSelect;
                param.searchDate = searchDate;
                return param;
            },
            concatParams(sourceParams, targetParams) {
                if (!sourceParams) { return; }
                let concatArr = [];
                concatArr = sourceParams.concat(targetParams ? targetParams : []);
                let temp = {};   //用于tableField判断重复
                let result = [];  //最后的新数组
                concatArr.map(function (item, index) {
                    if (item.tableField && !temp[item.tableField]) {
                        result.push(item);
                        temp[item.tableField] = true;
                    }
                });
                return result;
            },
            parentSearchParam(datas) {
                if (datas.hideSearchBtn) {
                    this.paramDatas = datas;
                }
            },
            toggleFilterBar(){
                this.show_selector = !this.show_selector;
                this.div_height= this.show_selector ? this.fixed_height : '0';
            }
        }
    }
</script>
<style scoped>
    .container:after {
        clear: both;
        content: '';
        display: block;
        width: 0;
        height: 0;
        visibility: hidden;
    }

    .container {
        zoom: 1;
        padding: 30px 10px;
    }

    .filter-handler {
        position: relative;
        left: 0;
        top: 0;
        z-index: 999999;
        width: 98.5%;
        background-color: rgb(255, 255, 255);
        text-align: right;
        cursor: pointer;
        padding-right: 15px;
        font-size: 12px;
    }
    .fixed_top{
        position: fixed;
        /* border-bottom: 1px solid; */
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        top:0;
        background: #fff;
        color: black;
        opacity: 1;
        z-index: 100000;
        max-height: 98.9px;
        width: 99.5%;
    }
</style>