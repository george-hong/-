### 应用场景

- 大文件分片上传
- 密集型计算
- 图片压缩

### 使用限制

- 同源限制：Worker使用的脚本必须与主线程同源。
- 文件限制：Worker不能使用本机的文件（file://...），内容必须来源于网络。

#### 相关文献

[MDN - 使用Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
