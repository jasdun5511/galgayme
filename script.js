// 获取音频元素
const bgm = document.getElementById('gameBgm');

// 游戏当前状态
let currentGameState = { bgImage: 'bg.png', chapter: '序章' };
let menuMode = ''; 

// ================= 音频逻辑 (仅保留BGM) =================

/**
 * 核心执行函数：处理点击动作并确保BGM在弹窗后能恢复
 */
function triggerAction(callback) {
    // 1. 如果 BGM 正在播，先把它停掉，防止被 alert 阻塞导致异常
    if (bgm && !bgm.paused) {
        bgm.pause();
    }

    // 2. 执行业务逻辑 (弹窗等)
    if (callback) callback();

    // 3. 逻辑执行完（比如你关掉 alert 后），重新恢复 BGM
    if (bgm) {
        bgm.play().catch(e => console.log("BGM恢复失败"));
    }
}

// 针对第一次进入页面，必须点一下才能播音乐
document.body.addEventListener('click', function() {
    if (bgm && bgm.paused) {
        bgm.play().catch(e => {});
    }
}, { once: true });


// ================= 菜单按钮功能 =================

function startGame() {
    triggerAction(() => {
        alert('新游戏开始！');
    });
}

function loadGame() {
    triggerAction(() => {
        openSaveLoadMenu('load');
    });
}

function continueGame() {
    triggerAction(() => {
        openSaveLoadMenu('load');
    });
}

function flowchart() {
    triggerAction(() => { alert('流程图功能开发中...'); });
}

function settings() {
    triggerAction(() => { alert('设置面板开发中...'); });
}

function exitGame() {
    triggerAction(() => {
        if(confirm('确定要退出游戏吗？')) {
            alert('感谢游玩！');
        }
    });
}


// ================= 存档/读档 逻辑 =================

function openSaveLoadMenu(mode) {
    menuMode = mode;
    document.getElementById('saveLoadTitle').innerText = mode === 'save' ? '【 保存游戏 】' : '【 读取游戏 】';
    document.getElementById('saveLoadOverlay').classList.add('active');
    refreshSlots();
}

function closeSaveLoadMenu() {
    triggerAction(() => {
        document.getElementById('saveLoadOverlay').classList.remove('active');
    });
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
    triggerAction(() => {
        if (menuMode === 'save') {
            let now = new Date();
            let timeString = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            let saveData = { bgImage: currentGameState.bgImage, time: timeString };
            localStorage.setItem('galgame_save_' + slotId, JSON.stringify(saveData));
            alert(`已保存至槽位 ${slotId}`);
            refreshSlots();
        } else {
            let savedData = localStorage.getItem('galgame_save_' + slotId);
            if (savedData) {
                let data = JSON.parse(savedData);
                document.querySelector('.game-container').style.backgroundImage = `url('${data.bgImage}')`;
                alert('读档成功！');
                document.getElementById('saveLoadOverlay').classList.remove('active');
            } else {
                alert('槽位为空！');
            }
        }
    });
}

// Esc 键呼出存档
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('saveLoadOverlay');
        if (overlay.classList.contains('active')) {
            closeSaveLoadMenu();
        } else {
            openSaveLoadMenu('save');
        }
    }
});
