// 本地測試腳本
const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

console.log('🧪 開始測試本地服務器...');

// 測試服務器是否正常運行
const testServer = () => {
    const options = {
        hostname: HOST,
        port: PORT,
        path: '/health',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const healthData = JSON.parse(data);
                console.log('✅ 服務器運行正常');
                console.log('📊 健康檢查結果:', healthData);
                console.log(`🌐 遊戲地址: http://${HOST}:${PORT}`);
                console.log('🎮 可以開始遊戲了！');
            } else {
                console.log('❌ 服務器響應異常:', res.statusCode);
            }
        });
    });

    req.on('error', (err) => {
        console.log('❌ 無法連接到服務器:', err.message);
        console.log('💡 請確保服務器已啟動: npm start');
    });

    req.end();
};

// 等待服務器啟動後測試
setTimeout(testServer, 2000);

console.log(`🔍 正在檢查 http://${HOST}:${PORT}/health ...`);