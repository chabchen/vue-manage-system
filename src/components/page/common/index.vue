<template>
    <div class="container">
        <async-load-comp v-for="(item,index) in comps" :key="index" :app="item.app" :prop="item.prop"></async-load-comp>
    </div>
</template>
<script>
    import asyncLoadComp from './asyncLoadComp.vue'
    export default {
        components: { asyncLoadComp },
        data() {
            return {
                reportId: '',
                comps: []
            }
        },
        created() {
            if(!this.$route.query.reportId){return;}
            this.reportId = this.$route.query.reportId;
            this.loadReportConfig();
        },
        watch:{
            $route(newValue, oldValue){
                this.comps = [];
                this.reportId = newValue.query.reportId;
                this.loadReportConfig();
            }
        },
        methods: {
            loadReportConfig(){//根据报表Id查询当前报表的所有组件并加载组件
                this.$requestData('/sysReportDetail/list','get',{parentId:this.reportId,pageSize:1000,sortNames:'order_number'}).then(res => {
                    let tableData = [];
                    if(res.datas && res.datas.length){
                        tableData = res.datas;
                        this.loadReport(tableData);
                    }                       
                });
            },
            loadReport(data){
                for(let i = 0 ,j = data.length;i<j;i++){
                    this.comps.push({app: data[i].url,prop: {config:JSON.parse(data[i].config),sqls:data[i].sqls,params:""}});
                }       
            },
            parentSearchEvent(datas){
                console.log(datas);
               for(let data of this.comps){
                    data.prop.params = datas;
               }
            }
        }
    }
</script>
<style scoped>
    .container:after{
        clear:both;
        content:'';
        display:block;
        width:0;
        height:0;
        visibility:hidden;
    }
    .container { 
        zoom:1; }
</style>