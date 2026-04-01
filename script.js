// 获取音频元素
const bgm = document.getElementById('gameBgm');
const clickAudio = document.getElementById('clickSound');

// 游戏当前状态
let currentGameState = { bgImage: 'bg.png', chapter: '序章' };
let menuMode = ''; 

// ================= 音频核心逻辑 =================

/**
 * 核心执行函数：处理点击动作并解决音频独占问题
 * @param {Function} callback - 点击后要执行的业务逻辑（比如弹窗或跳转）
 */
function triggerAction(callback) {
    // 1. 如果 BGM 正在播，先把它停掉，腾出音频通道
    if (bgm && !bgm.paused) {
        bgm.pause();
    }

    // 2. 播放点击音效
    if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(e => console.log("音效加载失败"));
    }

    // 3. 稍微延迟一点再执行逻辑，防止 alert 瞬间卡死音效的开头
    setTimeout(() => {
        if (callback) callback();

        // 4. 【关键】逻辑执行完（比如你关掉 alert 后），重新恢复 BGM
        if (bgm) {
            bgm.play().catch(e => console.log("BGM恢复失败，需要再次点击"));
        }
    }, 150);
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
    // 关掉面板也算一次点击，遵循同样的音频逻辑
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
                // 注意：这里读档成功后，triggerAction 外部会再次尝试恢复 BGM
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
