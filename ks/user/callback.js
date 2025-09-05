const express = require('express');
const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    const payload = req.body;
    console.log('收到快手回调:', payload);

    if (payload.event === 'deauthorize') {
        console.log('用户解除授权:', payload.user_id);
    }

    res.status(200).send('OK');
});

// ❌ 不要 app.listen()
// ✅ 必须导出给 Vercel
module.exports = app;
