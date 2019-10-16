<template>
    <div>
        <div>
            <div class="kpi_list">
                <div class="kpi_item" v-for="(item, index) in items">
                    <div v-if="item.children" v-for="(item2, index2) in item.children" class="item-compare">
                        <p class="pro_kpi_title">{{item2.key}}</p>
                        <p class="kpi_content">{{item2.value}}</p>
                        <i>{{item.unit}}</i>
                    </div>
                    <div v-if="!item.children" class="item-compare">
                        <p class="pro_kpi_title">{{item.key}}</p>
                        <p class="kpi_content">{{item.value}}</p>
                        <i>{{item.unit}}</i>
                    </div>

                </div>
                <div v-if="showButton">
                    <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">{{buttonTitle}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>


    export default {
        props: { prop: Object },
        data() {
            return {
                items: [],
                showButton: false,
                buttonTitle: '查询',
                url: "",
                sqlFlag: false,
                sql2: "",
            }
        },
        created() {
            this.items = this.prop.config.items;
            this.showButton = this.prop.config.showButton;
            this.buttonTitle = this.prop.config.buttonTitle;
            this.sql2 = this.prop.config.sql2;
            this.url = this.prop.config.url;
            this.loadReportData(this.prop.params);
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
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            searchEvent() {

            },
            getParams(params){
                if(!params || (!params.searchSelect && !params.searchDate)){return "";}
                let param = "";
                if(params.searchSelect){
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }

                        if (obj.type && obj.operation != 'in') {
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                        if(obj.type && obj.operation == 'in'){
                            if(!obj.value.length && !Array.isArray(obj.value)){continue;}
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation;
                            let inValue = "";
                            for(let value of obj.value){
                                if(!value){continue;}
                                inValue += "'" + value + "',";
                            }
                            inValue = inValue.substring(0,inValue.length-1);
                            if(inValue){
                                param += " (" + inValue + ")";
                            }                   
                        }
                        //多sql情况下根据筛选器选择对应的sql
                        if(obj.tableField == "sqlFlag"){
                            //酸奶调拨【吨|件】切换
                            this.sqlFlag = obj.value == "sql2" ? true : false;
                        }
                    }
                }

                if(!params.searchDate){ return param}
                for (let obj of params.searchDate) {
                    if (!obj.value) { continue; }
                    param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                }
                return param;             
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                let param = this.getParams(params);
                debugger
                if(this.sqlFlag){
                    sql = this.sql2;
                }
                if(!sql || !this.url){return;} 
                this.$requestData(this.url, 'post', { params: sql + param }).then(res => {
                    this.data = res.datas;
                });
            },
        }
    }
</script>

<style scoped>
    .kpi_list {
        display: flex;
        flex-direction: row;
    }

    .kpi_list .kpi_item {
        display: flex;
        flex-direction: column;
        -ms-flex: 1;
        -webkit-box-flex: 1;
        -webkit-box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
        -webkit-box-sizing: border-box;
        background: #fff;
        border: 1px solid #ebebeb;
        border-radius: 3px;
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
        box-sizing: border-box;
        flex: 1;
        text-align: center;
        min-height: 74px;
    }

    .kpi_list .kpi_item .item-compare {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
    }


    .kpi_list .kpi_item .kpi_content {
        color: #888;
        font-weight: 700;
        padding: 5px;
        font-size: 20px;
        margin-left: 5px;
    }

    .pro_kpi_title {
        font-size: 14px;
        white-space: nowrap;
        margin-left: 5px;
        color: rgb(61, 122, 183);
        font-weight: 700;
        min-width: 80px;
        padding: 5px;
        margin: 0px;
    }
</style>