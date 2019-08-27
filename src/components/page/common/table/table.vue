<template>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
        <template v-for="(col, index) in tableColumns">
            <el-table-column
                show-overflow-tooltip
                :key="index"
                :prop="col.prop"
                :label="col.label" 
            ></el-table-column>
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
    data() {
        return {
            loading: true,
            tableColumns:[],
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
    props: {prop: Object},
    created() {
        this.tableColumns = this.prop.tableColumns;
        this.getData();
    },
    methods: {
        
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