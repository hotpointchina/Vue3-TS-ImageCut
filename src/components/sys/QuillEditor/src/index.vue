
<!--
 * @Author: zhaoxu
 * @Date: 2023-02-13
 * @Description: file content
-->
<template>
  <div :class="['edit_box', isError?'is-error':'']" ref="edit_box">
    <QuillEditor 
      class="ql_editor"
      ref="myQuillEditor" 
      theme="snow" 
      v-model:content="data.content"
      :options="data.editorOption"
      contentType="html"
      @click="clickHandler"
      @ready="onEditorReady($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
    />
    <imgControl 
      :styleDate="imgControlStyleData"
      @add="imgControlAdd"
      @sub="imgControlSub"
      @rank="imgControlRank"
      @rankNumberChange="rankNumberChange"
    />
    <input type="file" name="file" id="uploadFileImg" ref="uploadFileImg" @change="uploadInputChange" style="opacity: 0; width: 0; height: 0;cursor: pointer" />
  </div>
</template>

<script lang="ts" name="zeditQuill">
import { reactive, onMounted, ref, toRaw, onUnmounted, watch  } from 'vue';
import { ElMessage } from 'element-plus';
import imgControl from '/@/components/sys/QuillEditor/components/imgControl.vue';
import * as gyQuillModal from '/@/components/sys/QuillEditor/model/zeditModal';


const titleConfig:gyQuillModal.titleConfigModal[] = [
  { Choice: '.ql-insertMetric', title: '跳转配置' },
  { Choice: '.ql-bold', title: '加粗' },
  { Choice: '.ql-italic', title: '斜体' },
  { Choice: '.ql-underline', title: '下划线' },
  { Choice: '.ql-header', title: '段落格式' },
  { Choice: '.ql-strike', title: '删除线' },
  { Choice: '.ql-blockquote', title: '块引用' },
  { Choice: '.ql-code', title: '插入代码' },
  { Choice: '.ql-code-block', title: '插入代码段' },
  { Choice: '.ql-font', title: '字体' },
  { Choice: '.ql-size', title: '字体大小' },
  { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
  { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
  { Choice: '.ql-direction', title: '文本方向' },
  { Choice: '.ql-header[value="1"]', title: 'h1' },
  { Choice: '.ql-header[value="2"]', title: 'h2' },
  { Choice: '.ql-align', title: '对齐方式' },
  { Choice: '.ql-color', title: '字体颜色' },
  { Choice: '.ql-background', title: '背景颜色' },
  { Choice: '.ql-image', title: '图像' },
  { Choice: '.ql-video', title: '视频' },
  { Choice: '.ql-link', title: '添加链接' },
  { Choice: '.ql-formula', title: '插入公式' },
  { Choice: '.ql-clean', title: '清除字体格式' },
  { Choice: '.ql-script[value="sub"]', title: '下标' },
  { Choice: '.ql-script[value="super"]', title: '上标' },
  { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
  { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
  { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一' },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二' },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三' },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四' },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五' },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六' },
  { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号' },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号' },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号' },
  { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
  { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐' }
];

export default {
  props:{
    content:{
      type: String,
      required:true,
      default:''
    },
    // 上传图片成功后，远程的图片地址
    imgageUrl:{
      type: String,
      required: false,
      default:''
    },
    /*
      是否对富文本编辑器中的内容进行更新
        - 如果每次 onkeydown 时都更新内容，
          会导致光标错乱的情况
    */ 
    isUpdated:{
      type: Boolean,
      required: true,
      default: false
    },
    isError:{
      type: Boolean,
      required: false,
      default: false
    },
  },
  components:{ imgControl },
  setup( props, { emit } ) {
    const edit_box = ref();
    const myQuillEditor = ref();
    // 编辑器的配置项
    const data = reactive({
      content: '',
      editorOption: {
        modules: {
          toolbar: [
          	['bold', 'italic', 'underline', 'strike'],
          	[{'size': ['small', false, 'large', 'huge']}],
          	[{'font': []}],
          	[{'align': []}],
          	[{'list': 'ordered'}, {'list': 'bullet'}],
          	[{'indent': '-1'}, {'indent': '+1'}],
          	[{'header': 1}, {'header': 2}], 
            ['clean'], // 清除文本格式
          	[{'direction': 'rtl' }],    //文字编辑方向，从左到右还是从右到左
          	[{ 'color': [] }, { 'background': [] }], 
          	['link', 'image'],
          ]
        },
        placeholder: '请输入内容...'
      }
    });
    const initTitle = ()=>{
      const qlToolBar = document.getElementsByClassName('ql-toolbar')[0] as HTMLElement;
      qlToolBar.dataset.placeholder = '';
      for (let item of titleConfig) {
        let tip = document.querySelector('.ql-formats ' + item.Choice);
        if (!tip) continue;
        tip.setAttribute('title', item.title);
      }
    };
    watch(
      ()=> props.imgageUrl,
      val=>{ val !== '' && insertImage( val ); },
      { deep:true, immediate:true }
    );
    const isErrorFlag = ref<boolean>(false);
    watch(
      ()=> props.isError,
      val=>{ isErrorFlag.value = val },
      { deep:true, immediate:true }
    );
    watch(
      ()=> props.content,
      val=>{
        if( props.isUpdated && myQuillEditor.value ){
          myQuillEditor.value.editor.querySelector('.ql-editor').innerHTML = val;
          emit('updateDone' );
        }
      },
      { deep:true, immediate:true }
    );

    const insertImage = ( url )=>{
      let quill = toRaw(myQuillEditor.value).getQuill()
      let length = quill.getSelection().index
      quill.insertEmbed(length, 'image', url );
      const imgArr = myQuillEditor.value.editor.querySelectorAll('img');      
      [...imgArr].forEach(it=>{ if( !it.index ){ it.index = Date.now(); } });
      quill.setSelection(length + 1);
    };
    const editPic:gyQuillModal.editPicModal = {
      isShow: false,
      editBox:null,
      editBoxClientRect: {...gyQuillModal.ElementRectDefault},
      el: null,
      elClientRect: {...gyQuillModal.ElementRectDefault},
      parent: null,
      parentClientRect: {...gyQuillModal.ElementRectDefault},
      ctrlPosition:{ top: '0px', left: '0px', },
      ctrlEl:null,
      fileINPUT: null,
    };
    const imgControlStyleData = reactive({
      display:'none',
      top:'0px',
      left:'0px',
      opacity: 0,
      inputTop:'40px',
      inputRight:'0px',
      rankNumber: 100,
      rankNumberMax: 300,
      rankNumberMin: 5,
      isShowRank: false
    });
    const collectElement = ()=>{ editPic.fileINPUT = document.querySelector('#uploadFileImg'); };
    const uploadInputChange = async ()=>{
      editPic.fileINPUT = document.querySelector('#uploadFileImg');
      const formData = new FormData();
      const fileINPUT = editPic.fileINPUT as HTMLInputElement;
      const filesList = fileINPUT.files as FileList;
      formData.append('fileData', filesList[0] );
      emit( 'uploadFile', { action: 'uploadFile', files: filesList[0], formData } );
    };
    const imgHandler = async (state) => {
      if (state) {
        const fileINPUT = editPic.fileINPUT as HTMLInputElement;
        fileINPUT.click();
      }
    };
    const setImgControl = (bol)=>{
      editPic.isShow = bol;
      if( bol ){
        imgControlStyleData.top = editPic.ctrlPosition.top;
        imgControlStyleData.left = editPic.ctrlPosition.left;
        imgControlStyleData.display = 'flex';
        setTimeout(()=>{imgControlStyleData.opacity = 1;},33);
        return ;
      }
      editPic.el = null;
      imgControlStyleData.opacity = 0;
      setTimeout(()=>{imgControlStyleData.display = 'none';},33);
    };
    const checkImgSize = num=>{
      const nowElRect = {
        elInfo: editPic.el?.getBoundingClientRect(),
        resWidth: 0,
        resHeight: 0,
      };
      nowElRect.resWidth = ((editPic.el as gyQuillModal.diyELement).sourceRect.width * num/100);
      nowElRect.resHeight = ((editPic.el as gyQuillModal.diyELement).sourceRect.height * num/100);
      if( nowElRect.resWidth < 90 || nowElRect.resHeight < 90 ){
        ElMessage({ message: '调整后的尺寸将会过于小了', type: 'warning', });
        return true
      }
      if( nowElRect.resWidth > editPic.editBoxClientRect.width ){
        ElMessage({ message: '调整后的尺寸将会超出了边界', type: 'warning', });
        return true
      }
      return false;
    };
    const rankNumberChange = (num)=>{
      if( checkImgSize(num) ){ return }
      (editPic.el as gyQuillModal.diyELement).scale = num;
      imgControlStyleData.rankNumber = num;
      (editPic.el as gyQuillModal.diyELement).style.width = 
        ((editPic.el as gyQuillModal.diyELement).sourceRect.width * num/100) +  'px';
        (editPic.el as gyQuillModal.diyELement).style.height = 
          ( (editPic.el as gyQuillModal.diyELement).sourceRect.height * num/100) + 'px';
      mathCtrlButtonPosition();
    };
    const imgControlAdd = ()=>{
      imgControlStyleData.rankNumber++;
      (editPic.el as gyQuillModal.diyELement).scale = imgControlStyleData.rankNumber;
      editPic.elClientRect = (editPic.el as gyQuillModal.diyELement).getBoundingClientRect();
      (editPic.el as gyQuillModal.diyELement).style.width = 
        ( (editPic.el as gyQuillModal.diyELement).sourceRect.width * imgControlStyleData.rankNumber/100) + 'px';
      (editPic.el as gyQuillModal.diyELement).style.height = 
        ( (editPic.el as gyQuillModal.diyELement).sourceRect.height * imgControlStyleData.rankNumber/100) + 'px';
      mathCtrlButtonPosition();
    };
    const imgControlSub = ()=>{
      imgControlStyleData.rankNumber--;
      (editPic.el as gyQuillModal.diyELement).scale = imgControlStyleData.rankNumber;
      editPic.elClientRect = (editPic.el as gyQuillModal.diyELement).getBoundingClientRect();
      (editPic.el as gyQuillModal.diyELement).style.width =
        ( (editPic.el as gyQuillModal.diyELement).sourceRect.width * imgControlStyleData.rankNumber/100) + 'px';
      (editPic.el as gyQuillModal.diyELement).style.height = 
        ( (editPic.el as gyQuillModal.diyELement).sourceRect.height * imgControlStyleData.rankNumber/100) + 'px';
      mathCtrlButtonPosition();
    };
    const imgControlRank = ( boolean )=>{ imgControlStyleData.isShowRank = boolean; };

    const mathCtrlButtonPosition = ()=>{
      editPic.elClientRect = (editPic.el as gyQuillModal.diyELement).getBoundingClientRect();
      editPic.parentClientRect = (editPic.parent as gyQuillModal.diyELement).getBoundingClientRect();
      editPic.editBoxClientRect = (editPic.editBox as gyQuillModal.diyELement).getBoundingClientRect();
      editPic.ctrlPosition.top = editPic.elClientRect.top - editPic.editBoxClientRect.top + 10 + 'px';
      editPic.ctrlPosition.left = editPic.elClientRect.left - editPic.editBoxClientRect.left + editPic.elClientRect.width - 130 + 'px';
      imgControlStyleData.top = editPic.ctrlPosition.top;
      imgControlStyleData.left = editPic.ctrlPosition.left;
    };
    const detailDown = e=>{
      if( editPic.el ){ e.wheelDelta > 0 ? imgControlAdd() : imgControlSub(); }
    };
    const clickHandler = ( e )=>{
      const imgArr = myQuillEditor.value.editor.querySelectorAll('img');
      [...imgArr].forEach(it=>{
        it.style['box-shadow'] = 'unset';
        it.style['z-index'] = 'unset';
        it.style.position = 'unset';
      });
      if( e.srcElement.nodeName == 'IMG' ){
        editPic.el = e.srcElement;
        (editPic.el as gyQuillModal.diyELement).style['box-shadow'] = '0px 0px 10px 0px rgba(24,174,102,.7)';
        (editPic.el as gyQuillModal.diyELement).style['z-index'] = 9;
        (editPic.el as gyQuillModal.diyELement).style.position = 'relative';
        editPic.parent = e.srcElement.parentNode;
        if( !(editPic.el as gyQuillModal.diyELement).sourceRect ){
          (editPic.el as gyQuillModal.diyELement).sourceRect = (editPic.el as gyQuillModal.diyELement).getBoundingClientRect();
        }
        imgControlStyleData.rankNumber = 
        (editPic.el as gyQuillModal.diyELement).scale ? (editPic.el as gyQuillModal.diyELement).scale : 100;
          imgControlStyleData.isShowRank = false;
        mathCtrlButtonPosition();
        setImgControl(true);
      }else{ setImgControl(false); }
    };
    const clickOutSide = e=>{
      const flag = e.path.some(it=>it.id == 'gyImgCtrBox');
      if( flag ){ return }
      if( e.target != editPic.el && editPic.el ){
        editPic.el.style['box-shadow'] = 'unset';
        editPic.el.style['z-index'] = 'unset';
        editPic.el.style.position = 'unset';
        setImgControl(false);
        imgControlRank(false);
      }
    };
    const onEditorReady = (editor)=>{
      data.content = props.content;
      editor.container.querySelector('.ql-blank').innerHTML = props.content;
      quillOnKeyDown();
    };
    const onEditorChange = (editor)=>{
      const qbox = editor.value.querySelector('.ql-editor');
      emit( 'change', { action:'change', content: qbox.innerHTML } )
    };
    const onEditorFocus = (editor)=>{
      const qbox = editor.value.querySelector('.ql-editor');
      emit( 'focus', { action:'focus', content: qbox.innerHTML } )
    };
    const onEditorBlur = (editor)=>{
      const qbox = editor.value.querySelector('.ql-editor');
      emit( 'blur', { action:'blur', content: qbox.innerHTML } )
    };
    const quillOnKeyDown = ()=>{
      myQuillEditor.value.editor.addEventListener('keydown', e=>{
        setTimeout(()=>{
          emit( 'change', { action:'change', content: e.target.innerHTML } )
        }, 33);
      });
    };
    window.addEventListener( 'click', clickOutSide );
    window.addEventListener( 'resize', clickOutSide );
    window.addEventListener( 'mousewheel', detailDown );
    onMounted(() => {
      let quill = toRaw(myQuillEditor.value).getQuill();
      editPic.editBox = toRaw(edit_box.value);
      if (myQuillEditor.value) { quill.getModule("toolbar").addHandler("image", imgHandler); };
      initTitle();
      collectElement();
      data.content = props.content;
    });
    onUnmounted(()=>{
      window.removeEventListener('click', clickOutSide );
      window.removeEventListener('resize', clickOutSide );
      window.removeEventListener('mousewheel', detailDown );
    });

    return {
      edit_box,
      imgControl,
      imgControlStyleData,
      imgControlAdd,
      imgControlSub,
      imgControlRank,
      rankNumberChange,
      uploadInputChange,
      myQuillEditor,
      data,
      imgHandler,
      clickHandler,
      onEditorReady,
      onEditorBlur,
      onEditorFocus,
      onEditorChange,
      quillOnKeyDown,
    }
  }
}
</script>

<style lang="scss" scoped>
:deep( .ql-container ){ height: 83%; }
:deep( .ql-editor p img){
  display: unset;
  vertical-align: unset;
}
.edit_box{
  position: relative;
  width: 100%;
  height: 100%;
}
.edit_box.is-error{
  :deep(.ql_editor),
  :deep(.ql_editor.ql-container),
  :deep(.ql-toolbar){
    border-color: #f56c6c;
  }
}
.ql_editor{ min-height: 300px; }
.tip{
  position: relative;
  width: 80vw;
  height: 66px;
}
:deep(.ql-toolbar.ql-snow .ql-picker-label){
  display: flex;
  align-items: center;
}
</style>