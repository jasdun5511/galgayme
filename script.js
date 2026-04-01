// 1. 获取页面中的音频元素
const bgm = document.getElementById('gameBgm');
const clickAudio = document.getElementById('clickSound');

// 2. 监听玩家的第一次点击行为，播放BGM
document.body.addEventListener('click', function() {
    if (bgm && bgm.paused) {
        bgm.play().catch(e => console.log("BGM等待交互中..."));
    }
}, { once: true });

// 3. 封装一个专门播放点击音效的函数
function playClickSound() {
    if (clickAudio) {
        clickAudio.currentTime = 0; // 进度归零，支持快速连点
        clickAudio.play().catch(e => console.log("音效加载中..."));
    }
}

// 4. 按钮的具体功能逻辑
// ====== 模拟当前游戏状态 ======
// 实际游戏中，这会随着玩家点击对话而改变
let currentGameState = {
    bgImage: 'bg.png',  // 当前画面的背景图
    chapter: '序章：搞笑的相遇' // 当前剧情进度
};

// 当前打开的面板模式 ('save' 还是 'load')
let menuMode = ''; 

// ==================== 菜单按钮功能 ====================

function startGame() {
    alert('进入游戏！现在你可以按 Esc 或者点菜单来存档了。');
    // 这里可以写切换到对话界面的代码
}

function loadGame() {
    openSaveLoadMenu('load'); // 打开读档面板
}

function continueGame() {
    // 读取最新存档的功能可以留到以后完善，这里先打开读档面板
    openSaveLoadMenu('load'); 
}

function flowchart() { alert('流程图功能开发中...'); }
function settings() { alert('设置功能开发中...'); }
function exitGame() { if(confirm('确定退出吗？')) alert('已退出'); }

// ==================== 存档与读档核心逻辑 ====================

// 打开面板
function openSaveLoadMenu(mode) {
    menuMode = mode;
    const overlay = document.getElementById('saveLoadOverlay');
    const title = document.getElementById('saveLoadTitle');
    
    title.innerText = mode === 'save' ? '【 保存游戏 】' : '【 读取游戏 】';
    overlay.classList.add('active'); // 显示遮罩层
    
    refreshSlots(); // 刷新显示的存档数据
}

// 关闭面板
function closeSaveLoadMenu() {
    document.getElementById('saveLoadOverlay').classList.remove('active');
}

// 刷新槽位显示
function refreshSlots() {
    for (let i = 1; i <= 3; i++) {
        // 从浏览器本地存储读取数据
        let savedData = localStorage.getItem('galgame_save_' + i);
        let imgEl = document.getElementById('slot-img-' + i);
        let infoEl = document.getElementById('slot-info-' + i);

        if (savedData) {
            // 如果有存档，解析JSON数据并显示
            let data = JSON.parse(savedData);
            imgEl.src = data.bgImage; // 显示那一帧（背景图）
            imgEl.style.display = 'block';
            infoEl.innerText = data.time; // 显示保存时间
        } else {
            // 如果没存档
            imgEl.src = '';
            imgEl.style.display = 'none';
            infoEl.innerText = 'NO DATA (空存档)';
        }
    }
}

// 点击具体的存档槽位 (1, 2 或 3)
function handleSlotClick(slotId) {
    if (menuMode === 'save') {
        // ========== 执行存档逻辑 ==========
        // 获取当前时间
        let now = new Date();
        let timeString = now.getMonth() + 1 + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
        
        // 打包当前状态
        let saveData = {
            bgImage: currentGameState.bgImage,
            chapter: currentGameState.chapter,
            time: timeString
        };
        
        // 存入浏览器
        localStorage.setItem('galgame_save_' + slotId, JSON.stringify(saveData));
        
        // 音效提示 (如果你搞定了音效的话)
        // playClickSound(); 
        
        alert(`已保存至槽位 ${slotId}！`);
        refreshSlots(); // 刷新画面显示刚刚存的图

    } else if (menuMode === 'load') {
        // ========== 执行读档逻辑 ==========
        let savedData = localStorage.getItem('galgame_save_' + slotId);
        if (savedData) {
            let data = JSON.parse(savedData);
            // 恢复游戏状态
            currentGameState.bgImage = data.bgImage;
            currentGameState.chapter = data.chapter;
            
            // 改变真实的网页背景来模拟读档成功
            document.querySelector('.game-container').style.backgroundImage = `url('${data.bgImage}')`;
            
            alert(`已读取进度：${data.time}`);
            closeSaveLoadMenu();
        } else {
            alert('这个槽位是空的，无法读取！');
        }
    }
}

// 绑定键盘 Esc 键，用来随时呼出【保存游戏】面板
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // 如果当前没打开面板，按 Esc 就打开存档面板
        const overlay = document.getElementById('saveLoadOverlay');
        if (!overlay.classList.contains('active')) {
            openSaveLoadMenu('save');
        } else {
            closeSaveLoadMenu();
        }
    }
});
