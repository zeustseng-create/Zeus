// 本地測試腳本
const http = require('http');

const PORT = process.env.PORT || 3000;

// 測試服務器是否正常啟動
function testServer() {
    const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`✅ 服務器響應狀態: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log('🎃 萬聖節射擊遊戲服務器運行正常！');
            console.log(`🌐 訪問地址: http://localhost:${PORT}`);
        }
    });

    req.on('error', (err) => {
        console.error('❌ 服務器連接失敗:', err.message);
        console.log('💡 請確保先運行 "npm start" 啟動服務器');
    });

    req.end();
}

// 延遲測試，給服務器啟動時間
setTimeout(testServer, 2000);

console.log('🔍 正在測試本地服務器...');