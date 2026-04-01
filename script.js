// 获取页面中的音频元素
const bgm = document.getElementById('gameBgm');

// 监听玩家的第一次点击行为
document.body.addEventListener('click', function() {
    // 如果音乐当前是暂停状态（或者还没开始播放）
    if (bgm.paused) {
        bgm.play(); // 开始播放
        console.log("Música tocando! (音乐播放中!)");
    }
}, { once: true }); // { once: true } 非常重要！它确保这个检测只触发一次，避免每次点击都重新触发播放命令
function startGame() {
    alert('初始化脚本... 开始【新游戏】！');
    // 在这里写进入游戏第一幕的代码，例如隐藏菜单层，显示对话框层
}

function loadGame() {
    alert('打开【读取存档】面板...');
}

function continueGame() {
    alert('正在加载最新存档，【继续游戏】...');
}

function flowchart() {
    alert('打开【流程图】界面...');
}

function settings() {
    alert('打开【系统设置】面板 (音量、分辨率、文字速度等)...');
}

function exitGame() {
    // 注意：由于浏览器的安全限制，JS 通常不能直接关闭非自己打开的窗口。
    // 在实际的 Web Galgame 中，这里通常是返回主页或者弹出一个黑屏感谢游玩。
    if(confirm('确定要退出游戏吗？未保存的进度将会丢失。')) {
        alert('游戏已结束。');
        // window.close(); // 仅在独立窗口或套壳应用(如Electron)中有效
    }
}
