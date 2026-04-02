// ==================== 音频逻辑 (仅保留 BGM) ====================
const bgm = document.getElementById('gameBgm');

// 监听玩家在页面的第一次点击，用来启动背景音乐
document.body.addEventListener('click', function() {
    if (bgm && bgm.paused) {
        bgm.play().catch(e => console.log("等待交互以启动 BGM"));
    }
}, { once: true });


// ==================== 以下为你提供的完整存档与功能代码 ====================

// ====== 模拟当前游戏状态 ======
let currentGameState = {
    bgImage: 'bg.png',  
    chapter: '序章：搞笑的相遇' 
};

let menuMode = ''; 

// ==================== 菜单按钮功能 (加入 0.1 秒延迟防止卡死 BGM) ====================

function startGame() {
    setTimeout(() => {
        alert('进入游戏！现在你可以按 Esc 或者点菜单来存档了。');
    }, 100); // 延迟 0.1 秒弹窗，给音乐留出出声的时间
}

function loadGame() {
    openSaveLoadMenu('load'); 
}

function continueGame() {
    openSaveLoadMenu('load'); 
}

function flowchart() { 
    setTimeout(() => { alert('流程图功能开发中...'); }, 100); 
}

function settings() { 
    setTimeout(() => { alert('设置功能开发中...'); }, 100); 
}

function exitGame() { 
    setTimeout(() => { 
        if(confirm('确定退出吗？')) alert('已退出'); 
    }, 100); 
}

// ==================== 存档与读档核心逻辑 ====================

function openSaveLoadMenu(mode) {
    menuMode = mode;
    const overlay = document.getElementById('saveLoadOverlay');
    const title = document.getElementById('saveLoadTitle');
    
    title.innerText = mode === 'save' ? '【 保存游戏 】' : '【 读取游戏 】';
    overlay.classList.add('active'); 
    
    refreshSlots(); 
}

function closeSaveLoadMenu() {
    document.getElementById('saveLoadOverlay').classList.remove('active');
}

function refreshSlots() {
    for (let i = 1; i <= 3; i++) {
        let savedData = localStorage.getItem('galgame_save_' + i);
        let imgEl = document.getElementById('slot-img-' + i);
        let infoEl = document.getElementById('slot-info-' + i);

        if (savedData) {
            let data = JSON.parse(savedData);
            imgEl.src = data.bgImage; 
            imgEl.style.display = 'block';
            infoEl.innerText = data.time; 
        } else {
            imgEl.src = '';
            imgEl.style.display = 'none';
            infoEl.innerText = 'NO DATA (空存档)';
        }
    }
}

function handleSlotClick(slotId) {
    // 同样加入 0.1 秒延迟，防止存/读档的弹窗卡死可能正在启动的音乐
    setTimeout(() => {
        if (menuMode === 'save') {
            let now = new Date();
            let timeString = now.getMonth() + 1 + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
            
            let saveData = {
                bgImage: currentGameState.bgImage,
                chapter: currentGameState.chapter,
                time: timeString
            };
            
            localStorage.setItem('galgame_save_' + slotId, JSON.stringify(saveData));
            alert(`已保存至槽位 ${slotId}！`);
            refreshSlots(); 

        } else if (menuMode === 'load') {
            let savedData = localStorage.getItem('galgame_save_' + slotId);
            if (savedData) {
                let data = JSON.parse(savedData);
                currentGameState.bgImage = data.bgImage;
                currentGameState.chapter = data.chapter;
                document.querySelector('.game-container').style.backgroundImage = `url('${data.bgImage}')`;
                alert(`已读取进度：${data.time}`);
                closeSaveLoadMenu();
            } else {
                alert('这个槽位是空的，无法读取！');
            }
        }
    }, 100);
}

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
