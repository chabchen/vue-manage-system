
/**
 * 数字格式转换成千分位
 *@param{Object}num
 */
export function setFinanceVal(num) {
    if ((num + "").trim() == "") { return ""; }
    if (isNaN(num)) { return ""; }
    num = num + "";
    if (/^.*\..*$/.test(num)) {
        var pointIndex = num.lastIndexOf(".");
        var intPart = num.substring(0, pointIndex);
        var pointPart = num.substring(pointIndex + 1, num.length);
        intPart = intPart + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
            intPart = intPart.replace(re, "$1,$2")
        }
        num = intPart + "." + pointPart.substring(0, 2);
    } else {
        num = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
            num = num.replace(re, "$1,$2")
        }
        num += ".00";
    }
    num = !num || num == "null" || num == "undefined" ? 0 : num;
    return num;
}
//数值转换
export function setDecimalVal(num) {
    num += "";
    if (num.trim() == "") { return ""; }
    num = num.replace(/,/gi, '');
    return num;
}

//组件列表
export function getComponents() {
    let comps = [
        { label: '筛选器1', value: 'filter/ConditionalSeaechs' },
        // { label: '筛选器2', value: 'filter/ConditionalSeaech' },
        { label: '卡片1', value: 'filter/filter-card' },
        { label: '柱状图-折线图', value: 'echarts/LineBar' },
        { label: '堆叠柱状图', value: 'echarts/BarStack' },
        { label: '折线图', value: 'echarts/Line' },
        { label: '饼状图', value: 'echarts/PieChart' },
        { label: '表单1', value: 'form/Form' },
        { label: '表格1', value: 'table/TableGrid' },
        { label: '三级下钻表格', value: 'table/DynamicTable' },
        { label: '三级下钻表格2', value: 'table/DynamicTable2' },
        { label: 'KPI指标', value: 'title/title-kpi' },
        { label: '地图', value: 'map/Map' },
        { label: '地图-散点', value: 'map/MapGeo' },
        { label: '单选框1', value: 'filter/filter-radio' }
    ];
    return comps;
}

/**
 * 
 * @param {*} sql 
 * @param {*} params 
 * @param {*} limitFields 限制参数字段集 
 * @param {*} lastDateFlag 取日期区间最后一个值
 */
export function setParams(sql,params,limitFields,lastDateFlag,noTime){
    if(!params){return "";}
    if (!params.searchSelect && !params.searchDate) { return ""; }
    let param = "";let param2 = "";
    if (params.searchSelect) {//获取下拉框筛选器的值
        for (let obj of params.searchSelect) {
            if (!obj.value || !obj.value.length) { continue; }
            
            if (obj.type && obj.tableField && Array.isArray(obj.value) && !obj.getBehind) {
                param += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
            }
            if (obj.type && obj.tableField && !Array.isArray(obj.value)) {
                param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
            }
            if(!limitFields || !limitFields.length || limitFields.indexOf(obj.tableField) == -1){continue;}
            if(obj.type && obj.tableField && obj.getBehind){
                param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value.substring(obj.value.lastIndexOf("-")+1) + "'";
                continue;
            }
            if (obj.type && obj.tableField && Array.isArray(obj.value)) {
                param2 += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
            }
            if (obj.type && obj.tableField && !Array.isArray(obj.value)) {
                param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
            }
        }
    }
    if (params.searchDate) { 
        for (let obj of params.searchDate) {//获取日期筛选器的值
            if (!obj.value || !obj.value.length || !obj.dataShow || noTime) { continue; }
            if (Array.isArray(obj.value)) {
                param += " " + obj.type + " " + obj.tableField + " >= " + obj.value[0];
                param += " " + obj.type + " " + obj.tableField + " <= " + obj.value[1];
                if(lastDateFlag){
                    param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value[1];
                }                
            } else {
                param += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value;
                if(!lastDateFlag){continue;}
                param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value;
            }
        }
    }
    if(!sql && lastDateFlag){return param2;}
    if(!sql && !lastDateFlag){return param;}
    return concatParams(sql,param,param2);
}

function concatParams(sql,param,param2){
    let sqlArr = sql.trim().split("1=1");
    let newSql = param2 ? sqlArr[0] + " 1=1 " + param2 : sqlArr[0] + " 1=1 " + param;
    for(let i = 1,j = sqlArr.length -1;i<j;i++){
        newSql += sqlArr[i] + " 1=1 "+param;
    }
    newSql = newSql + sqlArr[sqlArr.length-1];
    newSql = newSql.replace("groupby","group by");
    return newSql;
}