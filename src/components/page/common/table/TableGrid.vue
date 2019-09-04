<template>
    <el-table :data="tableData"  border stripe>
        <template v-for="(col, index) in tableColumns">
            <div @click="ddddddd">
                <el-table-column show-overflow-tooltip
                    :key="index"
                    :prop="col.prop"
                    :label="col.label" 
                    
                ></el-table-column>
            </div>
            <!-- v-if="col.style=='normal'"
            :width="col.width"
            :min-width="col.minWidth"
            :header-align="col.headerAlign"
            :column-key="index.toString()" -->
        </template>   
    </el-table>
</template>

<script>

import {requestData} from '@/api/RequestData';

export default {
    props: {prop: Object},
    data() {
        return {
            loading: true,
            tableColumns:[  
                { prop: "date", label: "店铺" },
                { prop: "name", label: "访客数" },
                { prop: "sss", label: "成交人数" },
                { prop: "ddd", label: "成交转化率" },
                { prop: "fff", label: "GMV" },
                { prop: "ggg", label: "人均消费222" }
            ],
            tableData: [{
            date: '天猫',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '苏宁',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '京东',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '拼多多',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }]
        }
    },
    created() {
        this.tableColumns = this.prop.config.items;
        this.getData();
    },
    methods: {
       ddddddd(){
           alert();
       },
       getData : function(params) {
            this.loading = true;
            requestData('/report/list','get').then(res => {
               
                if(res.datas && res.datas.length){
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