// 获取音频
const bgm = document.getElementById('gameBgm');
const clickAudio = document.getElementById('clickSound');

// 核心功能：统一播放控制
function playAudioSystem() {
    // 1. 尝试播放 BGM（如果还没播的话）
    if (bgm && bgm.paused) {
        bgm.play().then(() => {
            console.log("BGM 启动成功");
        }).catch(err => {
            console.log("等待交互以启动 BGM");
        });
    }
    // 2. 播放点击音效
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(e => {});
    }
}

// 初始点击监听（针对第一次进入页面的情况）
document.body.addEventListener('click', function() {
    playAudioSystem();
}, { once: true });


// ================= 游戏逻辑 =================
let currentGameState = { bgImage: 'bg.png', chapter: '序章' };
let menuMode = ''; 

function startGame() {
    playAudioSystem();
    setTimeout(() => { alert('新游戏开始！'); }, 150);
}

function loadGame() {
    playAudioSystem();
    setTimeout(() => { openSaveLoadMenu('load'); }, 150);
}

function continueGame() {
    playAudioSystem();
    setTimeout(() => { openSaveLoadMenu('load'); }, 150);
}

function flowchart() { playAudioSystem(); setTimeout(() => { alert('流程图暂未开放'); }, 150); }
function settings() { playAudioSystem(); setTimeout(() => { alert('设置面板暂未开放'); }, 150); }
function exitGame() { 
    playAudioSystem(); 
    setTimeout(() => { if(confirm('退出游戏？')) alert('已退出'); }, 150); 
}

// ================= 存档/读档 =================
function openSaveLoadMenu(mode) {
    menuMode = mode;
    document.getElementById('saveLoadTitle').innerText = mode === 'save' ? '【 保存游戏 】' : '【 读取游戏 】';
    document.getElementById('saveLoadOverlay').classList.add('active');
    refreshSlots();
}

function closeSaveLoadMenu() {
    playAudioSystem();
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
            imgEl.style.display = 'none';
            infoEl.innerText = 'NO DATA';
        }
    }
}

function handleSlotClick(slotId) {
    playAudioSystem();
    setTimeout(() => {
        if (menuMode === 'save') {
            let now = new Date();
            let timeString = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            let saveData = { bgImage: currentGameState.bgImage, time: timeString };
            localStorage.setItem('galgame_save_' + slotId, JSON.stringify(saveData));
            alert('保存成功！');
            refreshSlots();
        } else {
            let savedData = localStorage.getItem('galgame_save_' + slotId);
            if (savedData) {
                let data = JSON.parse(savedData);
                document.querySelector('.game-container').style.backgroundImage = `url('${data.bgImage}')`;
                alert('读取成功！');
                closeSaveLoadMenu();
            } else {
                alert('槽位为空');
            }
        }
    }, 150);
}

// Esc 键呼出存档
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('saveLoadOverlay');
        overlay.classList.contains('active') ? closeSaveLoadMenu() : openSaveLoadMenu('save');
    }
});
