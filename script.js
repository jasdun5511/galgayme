// ==============================
// 1. 核心元素获取
// ==============================
const bgm = document.getElementById('gameBgm');
const menuLayer = document.getElementById('menu-layer');
const gameplayLayer = document.getElementById('gameplay-layer');
const speakerName = document.getElementById('speakerName');
const dialogueText = document.getElementById('dialogueText');

// ==============================
// 2. 剧情数据分类 (Scenario Data)
// ==============================
const scenarios = {
    "main_menu": {
        bgm: 'bgm.mp3'
    },
    "scene1": { // 【场景 1】 (示例：校门口)
        background: 'scene1_gate.png', 
        bgm: 'scene1_bgm.mp3',         
        dialogue: [
            { name: '你（陈同学）', text: '呼，今天起得真早... （看向校门）' },
            { name: '你（陈同学）', text: '等下，那个是... 我们的同班同学，王同学？' },
            { name: '你（陈同学）', text: '他怎么看起来那么... （同学T恤上写着：不周）' },
            { name: '齐千玖', text: '毕竟作为NPC，要是让玩家误会的话，可能会被投诉 “为什么她不可攻略，你们是不是想卖DLC？”之类的吧。' } 
        ]
    }
};

// 游戏状态变量
let currentSceneId = null;
let currentLineIndex = 0;

// ==============================
// 3. 核心功能与交互逻辑
// ==============================

// 初始化主菜单 BGM
window.addEventListener('load', () => {
    bgm.src = scenarios["main_menu"].bgm;
});

// BGM 播放解锁机制 (应对浏览器限制)
document.body.addEventListener('click', function() {
    if (bgm.paused && bgm.src) { 
        bgm.play().then(() => {
            console.log("音频播放已开启！");
        }).catch(e => {
            console.error("音频播放失败 (需再次点击):", e);
        });
    }
}, { once: true }); 

// 开始新游戏
function startGame() {
    console.log('初始化场景脚本... 开始【新游戏】！');
    if (menuLayer) menuLayer.classList.add('hidden');
    gameplayLayer.classList.remove('hidden');
    loadScene("scene1");
}

// 加载指定场景
function loadScene(sceneId) {
    currentSceneId = sceneId;
    currentLineIndex = 0;
    const scene = scenarios[sceneId];

    if (!scene) {
        console.error(`场景 ID: ${sceneId} 未找到。`);
        return;
    }

    // 设置背景
    if (gameplayLayer && scene.background) {
        gameplayLayer.style.backgroundImage = `url('${scene.background}')`;
    }

    // 切换 BGM
    if (scene.bgm) {
        bgm.src = scene.bgm;
        bgm.play().catch(e => console.warn("BGM 自动播放受限:", e));
    }

    // 显示第一条对话
    showNextDialogueLine();
}

// 推进下一条对话
function showNextDialogueLine() {
    const scene = scenarios[currentSceneId];
    if (!scene || currentLineIndex >= scene.dialogue.length) {
        console.log("场景结束。");
        // 场景结束处理：目前退回主菜单
        gameplayLayer.classList.add('hidden');
        menuLayer.classList.remove('hidden');
        bgm.src = scenarios["main_menu"].bgm;
        bgm.play();
        currentSceneId = null;
        currentLineIndex = 0;
        return;
    }

    const currentLine = scene.dialogue[currentLineIndex];

    if (speakerName) speakerName.textContent = currentLine.name;
    if (dialogueText) dialogueText.textContent = currentLine.text;

    currentLineIndex++;
}

// 绑定点击推进对话事件
gameplayLayer.addEventListener('click', function(event) {
    // 阻止点击快速菜单时推进对话
    if (event.target.closest('.quick-menu')) return;
    showNextDialogueLine();
});

// 快速菜单按钮拦截
const quickMenuButtons = document.querySelectorAll('.quick-menu button');
quickMenuButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        console.log(`点击了快速菜单: ${this.textContent}`);
        event.stopPropagation(); 
    });
});

// 其他主菜单占位功能
function loadGame() { alert('打开【读取存档】面板...'); }
function continueGame() { alert('正在加载最新存档，【继续游戏】...'); }
function flowchart() { alert('打开【流程图】界面...'); }
function settings() { alert('打开【系统设置】面板...'); }
function exitGame() {
    if(confirm('确定要退出游戏吗？未保存的进度将会丢失。')) {
        alert('游戏已结束。');
    }
}
