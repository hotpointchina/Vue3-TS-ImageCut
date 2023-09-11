import { updateGenTable } from '/@/api/codeGeneration/index';
import { useMessage } from '/@/hooks/web/useMesage';
import { useCodeGeneration } from '/@/stores/modules/codeGeneration';

const { createMessage } = useMessage();

const userStore = useCodeGeneration();

type ParamsActionFunction = (data:object)=>void;
interface RetrunFunction{
  submitUpdateGenTable: ParamsActionFunction
}
type actionFunction = ()=>RetrunFunction;

export const editTableHandle:actionFunction = ()=>{
  // 提交
  const submitUpdateGenTable = async (data)=>{
    const res = await updateGenTable(data);
    if( res.data.message == "成功" ){
      createMessage.success("成功",2000);
      userStore.setCloseState(false);
    }else{
      createMessage.error('失败', 2000);
    }
  };
  return {
    submitUpdateGenTable
  }
};
