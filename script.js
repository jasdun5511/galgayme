// ================= 音频系统 =================
const bgm = document.getElementById('gameBgm');
const clickAudio = document.getElementById('clickSound');

// 监听玩家的第一次点击行为，播放BGM
document.body.addEventListener('click', function() {
    if (bgm && bgm.paused) {
        bgm.play().catch(e => console.log("BGM等待交互中..."));
    }
}, { once: true });

// 封装播放点击音效的函数
function playClickSound() {
    if (clickAudio) {
        clickAudio.currentTime = 0; // 进度归零，支持快速连点
        clickAudio.play().catch(e => console.log("音效加载中..."));
    }
}


// ================= 模拟当前游戏状态 =================
let currentGameState = {
    bgImage: 'bg.png',  // 当前画面的背景图 (存档时会记录这个)
    chapter: '序章' 
};

// 当前打开的面板模式 ('save' 还是 'load')
let menuMode = ''; 


// ================= 菜单按钮功能 =================
function startGame() {
    playClickSound();
    setTimeout(() => { 
        alert('进入游戏！现在你可以按 Esc 或者点菜单来存档了。'); 
    }, 100);
}

function loadGame() {
    playClickSound();
    setTimeout(() => { 
        openSaveLoadMenu('load'); 
    }, 100);
}

function continueGame() {
    playClickSound();
    setTimeout(() => { 
        openSaveLoadMenu('load'); 
    }, 100);
}

function flowchart() {
    playClickSound();
    setTimeout(() => { alert('打开【流程图】界面...'); }, 100);
}

function settings() {
    playClickSound();
    setTimeout(() => { alert('打开【系统设置】面板 (音量、分辨率、文字速度等)...'); }, 100);
}

function exitGame() {
    playClickSound();
    setTimeout(() => { 
        if(confirm('确定要退出游戏吗？未保存的进度将会丢失。')) {
            alert('游戏已结束。');
        }
    }, 100);
}


// ================= 存档与读档核心逻辑 =================

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
    playClickSound();
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
            // 如果有存档，解析数据并显示
            let data = JSON.parse(savedData);
            imgEl.src = data.bgImage; // 显示保存的那一帧（背景图）
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
    playClickSound();

    // 延迟一点执行，防止音效被阻塞
    setTimeout(() => {
        if (menuMode === 'save') {
            // ========== 执行存档 ==========
            let now = new Date();
            let timeString = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            
            let saveData = {
                bgImage: currentGameState.bgImage,
                chapter: currentGameState.chapter,
                time: timeString
            };
            
            localStorage.setItem('galgame_save_' + slotId, JSON.stringify(saveData));
            alert(`已保存至槽位 ${slotId}！`);
            refreshSlots(); 

        } else if (menuMode === 'load') {
            // ========== 执行读档 ==========
            let savedData = localStorage.getItem('galgame_save_' + slotId);
            if (savedData) {
                let data = JSON.parse(savedData);
                
                // 恢复状态
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
    }, 100);
}

// 绑定键盘 Esc 键，用来随时呼出【保存游戏】面板
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const overlay = document.getElementById('saveLoadOverlay');
        if (!overlay.classList.contains('active')) {
            openSaveLoadMenu('save');
        } else {
            closeSaveLoadMenu();
        }
    }
});
