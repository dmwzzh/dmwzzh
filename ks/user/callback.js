const express = require('express');
const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    const payload = req.body;  // 来自快手的通知
    console.log('收到快手回调:', payload);

    // 处理逻辑，例如解除授权事件
    if (payload.event === 'deauthorize') {
        console.log('用户解除授权:', payload.user_id);
    }

    res.status(200).send('OK');
});

module.exports = app;