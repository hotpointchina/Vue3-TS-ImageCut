import * as tsModel from '/@/views/ztest/model';

// table 的自适应高度 & table 上方[展开]与[折叠]按钮的响应
export const isFolder = ( 
  obj:tsModel.seachGroupInfoModel={status:false,height:'70'},
  sourceTableHeight:tsModel.autoTableHeightInfoModel,
  subtract:number = (64+24+41+36+63+40)
)=>{
  const height = {
    body: '100vh',
    subtract: subtract + parseInt(obj.height),
    str:''
  };
  height.str = `calc(${height.body} - ${height.subtract}px)`;
  sourceTableHeight.tableHeight = height.str;
  sourceTableHeight.seachGroupInfo = {...obj};
};

// 使 elementPlus 的 input 失去焦点
export const inputBlur = ( el: any ) => {
  el = Object.keys(el).includes('_value') ? el.value : el;
  el.ref.focus();
  el.ref.setSelectionRange(el.ref.selectionStart - 1, el.ref.selectionStart - 1)
  setTimeout(()=>{el.ref.blur();},33);
};