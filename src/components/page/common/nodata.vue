<template>
    <div class='nodata' :class="size" :style="divHeight">
      <div class="innerContent" v-show="!loading">
        <p class='nodataText'>{{nodataText}}</p>
        <img style="height: 101px;" class='nodataImg' src="@/assets/img/nodata.png"/>
      </div>
      <div v-loading="loading" class="loading"></div>
    </div> 
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '250px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    nodataText: {
      type: String,
      default: '啊噢,没有找到任何数据......'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    divHeight() {
      return `height: ${this.height}`
    }
  }
}
</script>
<style scoped>
.nodata{
  position: relative;
  z-index: 213;
}
.innerContent{
  width: 100%;
    text-align: center;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
}
.loading{
  position: absolute;
  width: 100%;
  height: 100%;
  top:0 ;
  left:0;
  z-index: 9;
}
</style>
