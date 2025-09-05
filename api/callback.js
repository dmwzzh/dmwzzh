export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log('收到快手回调:', req.body);
        res.status(200).json({ msg: '回调成功' });
    } else {
        res.status(200).json({ msg: 'Vercel API 正常工作' });
    }
}
