<route lang="yaml">
  name: Login
  meta:
    layout: BlankLayout
</route>

<template>
  <h1>vueCropper</h1>
  <div class="wrap">
    <VueCropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :style="{
        width:'800px',
        height:'450px',
      }"
      :infoTrue="true"
      
      
      :autoCrop="option.autoCrop"
      :fixed="option.fixed"
      :info="option.info"
      :fixedNumber="option.fixedNumber"

    ></vueCropper>
  </div>

  <div class="button-group">
    <el-button type="primary" @click="changeRatio('R16to9')">16比9</el-button>
    <el-button type="primary" @click="changeRatio('R5to3')">5比3</el-button>
    <el-button type="primary" @click="downLoadPic">下载</el-button>
  </div>

</template>

<script setup lang="ts" name="Login">
import { ref, reactive } from 'vue';
import { VueCropper }  from "vue-cropper";


  
const cropper = ref();
interface optionModel{
  img:string,
  size:number,
  outputType:'jpg'|'png'|'webp',
  info:boolean,
  fixed:boolean,
  autoCrop:boolean,
  fixedNumber: number[],
  Ratio:{
    R16to9: number[],
    R5to3: number[],
  },
};
const option:optionModel = reactive({
  img:'https://t7.baidu.com/it/u=2621658848,3952322712&fm=193&f=GIF',
  size:1,
  outputType:'jpg',

  info:true,
  fixed:true,
  autoCrop:true,

  fixedNumber: [200,113],
  Ratio:{
    R16to9: [200,113],
    R5to3: [200,200],
  },
});

const changeRatio = (key)=>{
  option.info = false;
  option.fixed = false;
  option.autoCrop = false;
  
  option.fixedNumber = option.Ratio[key];
  
  setTimeout(()=>{
    option.info = true;
    option.fixed = true;
    option.autoCrop = true;
  },99);
};

const downLoadPic = ()=>{
  console.log( ' downLoadPic cropper -> ', cropper );

  var aLink = document.createElement('a')
  aLink.download = 'zzdemo'
  cropper.value.getCropBlob(data => {
    // do something
    console.log(data)  

    aLink.href = window.URL.createObjectURL(data)
    aLink.click()

  })

}


</script>

<style lang="scss" scoped>
h1,
.wrap{
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
h1{
  font-size: 36px;
  font-weight: bold;
  padding-top: 20px;
  padding-bottom: 20px;
}
.button-group{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 20px 0;
}

</style>

