// import Message from '/@/components/sys/Message';
import { ElMessage } from 'element-plus';

interface CreateMessage {
  info(content: string): void;
  success(content: string): void;
  error(content: string): void;
  warning(content: string): void;
}

class MessageProxy implements CreateMessage {
  protected message: typeof ElMessage;

  constructor() {
    this.message = ElMessage;
  }
  info(message: string, duration = 3000) {
    this.message({
      message,
      duration,
    });
  }
  success(message: string, duration = 3000) {
    this.message({
      type: 'success',
      message,
      duration,
    });
  }
  error(message: string, duration = 3000) {
    this.message({
      type: 'error',
      message,
      duration,
    });
  }
  warning(message: string, duration = 3000) {
    this.message({
      type: 'warning',
      message,
      duration,
    });
  }
}

const createMessage = new MessageProxy();

export function useMessage() {
  return {
    createMessage,
  };
}
