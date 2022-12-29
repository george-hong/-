console.log('worker.js加载成功');

onmessage = function(event) {
    // 在主线程worker.postMessage(message)方法中传递的message参数可通过onmessage函数中的event.data属性获取
    console.log('worker context', this);
    console.log('event', event);
    // 获取主线程发送的输入框的值
    const [firstInputValue, secondInputValue] = event.data;
    const computedResult = firstInputValue * secondInputValue;
    console.log('worker准备发送计算后的结果：', computedResult);
    // 向主线程发送消息
    // https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/postMessage
    postMessage(computedResult);
}