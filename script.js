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
function startGame() {
    playClickSound(); // 先播放声音
    // 延迟 100 毫秒 (0.1秒) 再弹窗，给声音留出播放的时间
    setTimeout(() => { 
        alert('初始化脚本... 开始【新游戏】！'); 
    }, 100);
}

function loadGame() {
    playClickSound();
    setTimeout(() => { alert('打开【读取存档】面板...'); }, 100);
}

function continueGame() {
    playClickSound();
    setTimeout(() => { alert('正在加载最新存档，【继续游戏】...'); }, 100);
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
