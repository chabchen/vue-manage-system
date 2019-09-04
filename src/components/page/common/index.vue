<template>
    <div class="container">
        <async-load-comp v-for="(item,index) in comps" :key="index" :app="item.app" :prop="item.prop"></async-load-comp>
    </div>
</template>
<script>
    import asyncLoadComp from './asyncLoadComp.vue'
    import {requestData} from '@/api/RequestData';
    export default {
        components: { asyncLoadComp },
        data() {
            return {
                reportId: '',
                comps: []
            }
        },
        created() {
            debugger
            if(!this.$route.query.reportId){return;}
            this.reportId = this.$route.query.reportId;
            this.loadReportConfig();
        },
        methods: {
            loadReportConfig(){
                requestData('/sysReportDetail/list','get',{'parentId':this.reportId}).then(res => {
                    let tableData = [];
                    if(res.datas && res.datas.length){
                        tableData = res.datas;
                        this.loadReport(tableData);
                    }                       
                });
            },
            loadReport(data){
                this.comps = [];
                for(let i = 0 ,j = data.length;i<j;i++){
                    this.comps.push({app: data[i].url,prop: {config:JSON.parse(data[i].config)}});
                }       
            },
            parentSearchEvent(datas){
               console.log(datas);
            }
        }
    }
</script>