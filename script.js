// ==============================
// 1. 核心元素获取
// ==============================
const bgm = document.getElementById('gameBgm');
const menuLayer = document.getElementById('menu-layer');
const gameplayLayer = document.getElementById('gameplay-layer');
// 【新增】获取整个名字框的父级元素，方便隐藏它
const nameTagContainer = document.querySelector('.name-tag'); 
const speakerName = document.getElementById('speakerName');
const dialogueText = document.getElementById('dialogueText');

// ==============================
// 2. 剧情数据分类 (Scenario Data)
// ==============================
const scenarios = {
    "main_menu": {
        bgm: 'bgm.mp3'
    },
    "scene1": { // 【场景 1】 (校门口 - 经典开局立Flag)
        background: 'scene1_gate.png', // 占位图：校门口
        bgm: 'scene1_bgm.mp3',         
        nextScene: 'scene2', // 【新增】播完后自动跳转到 scene2
        dialogue: [
            { name: '', text: '清晨的阳光不算刺眼，学校门口挤满了刚返校的学生。' },
            { name: '', text: '有穿着旧校服的高二高三学长学姐，也有和我一样、手里攥着新生报到单、背着满满当当双肩包的高一新生。' },
            { name: '', text: '我叫子涵。此时正背着装满新课本的书包，捏着皱巴巴的报到单，站在高中校门口。' },
            { name: '', text: '深吸了一口带着书香的空气，我心里满是对高中生活的憧憬。' },
            { name: '', text: '当场在心里默默立下了开学第一份誓言——' },
            { name: '', text: '“高中三年，我一定要收心好好奋斗！上课认真听讲不偷懒，争取每次考试都排在前列，目标冲个好大学！”' },
            { name: '', text: '“当然，作为正常男生，也想在枯燥的高中生活里，遇见一个性格温柔、安安静静的女同学。”' },
            { name: '', text: '“谈一场纯纯的、普普通通的校园恋爱，放学一起走出校门，课间能说说话，这日子就太完美了！”' },
            { name: '', text: '带着这样美好的期盼，我迈开步子进入了学校。' }
        ]
    },
    "scene2": { // 【场景 2】 (看公告栏 - 赶时间)
        background: 'scene2_notice.jpg', // 占位图：公告栏
        bgm: 'scene1_bgm.mp3', // 可以保持同一首BGM，或者换一首略带急促的
        nextScene: 'scene3', // 播完后自动跳转到 scene3
        dialogue: [
            { name: '', text: '我盯着校门口墙上的报到指引，高一新生要去教学楼三楼的教室报到。' },
            { name: '', text: '而且班主任说八点半就截止签到，再磨蹭就要迟到挨批了。' },
            { name: '', text: '当下也顾不上打量身边路过的女同学，赶紧把报到单塞进书包侧兜。' },
            { name: '', text: '低着头，加快脚步往校门里冲。' },
            { name: '', text: '心里还不停念叨：“先顺利报到，找好教室，恋爱这事慢慢来，咱先做个听话的好学生！”' }
        ]
    },
    "scene3": { // 【场景 3】 (转角撞人 - 宿命的相遇)
        background: 'scene3_corridor.jpg', // 占位图：教学楼走廊转角
        bgm: 'scene2_bump.mp3', // 建议在这里换一首音乐，或者加个音效
        nextScene: null, // 暂时没有后续场景，播完退回主菜单
        dialogue: [
            { name: '', text: '我只顾着低头看路，避开扎堆聊天的同学……' },
            { name: '', text: '没留意教室门内侧、入口的转角处。' },
            { name: '', text: '“砰——！”' }, // 自己加了个语气词增加画面感
            { name: '', text: '突然狠狠撞上了一堵又高又挺、带着温热体温的结实胸膛！' }
        ]
    }
};

// 游戏状态变量
let currentSceneId = null;
let currentLineIndex = 0;


// ==============================
// 以下是需要替换的 showNextDialogueLine 函数
// ==============================

// 推进下一条对话
function showNextDialogueLine() {
    const scene = scenarios[currentSceneId];
    
    // 如果当前场景的对话已经播放完毕
    if (!scene || currentLineIndex >= scene.dialogue.length) {
        console.log(`场景 [${currentSceneId}] 结束。`);
        
        // 【新增逻辑】判断是否有下一个场景
        if (scene && scene.nextScene) {
            console.log(`跳转到下一幕: ${scene.nextScene}`);
            loadScene(scene.nextScene); // 直接加载下一个场景
        } else {
            // 如果没有下一个场景了，退回主菜单
            console.log("全部剧情结束，返回主菜单。");
            gameplayLayer.classList.add('hidden');
            menuLayer.classList.remove('hidden');
            bgm.src = scenarios["main_menu"].bgm;
            bgm.play();
            currentSceneId = null;
            currentLineIndex = 0;
        }
        return;
    }

    const currentLine = scene.dialogue[currentLineIndex];

    // 判断是否显示名字框 (有名字且不为空时显示)
    if (currentLine.name && currentLine.name.trim() !== "") {
        nameTagContainer.style.display = 'block';
        if (speakerName) speakerName.textContent = currentLine.name;
    } else {
        nameTagContainer.style.display = 'none';
    }

    // 更新对话内容
    if (dialogueText) dialogueText.textContent = currentLine.text;

    currentLineIndex++;
}



// ==============================
// 3. 核心功能与交互逻辑
// ==============================

// 初始化主菜单 BGM
window.addEventListener('load', () => {
    bgm.src = scenarios["main_menu"].bgm;
});

// BGM 播放解锁机制
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
    if (menuLayer) menuLayer.classList.add('hidden');
    gameplayLayer.classList.remove('hidden');
    loadScene("scene1");
}

// 加载指定场景
function loadScene(sceneId) {
    currentSceneId = sceneId;
    currentLineIndex = 0;
    const scene = scenarios[sceneId];

    if (!scene) return;

    if (gameplayLayer && scene.background) {
        gameplayLayer.style.backgroundImage = `url('${scene.background}')`;
    }

    if (scene.bgm) {
        bgm.src = scene.bgm;
        bgm.play().catch(e => console.warn("BGM 自动播放受限:", e));
    }

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

    // 【新增逻辑】判断是否显示名字框
    if (currentLine.name && currentLine.name.trim() !== "") {
        // 如果有名字，显示名字框并更新名字
        nameTagContainer.style.display = 'block';
        if (speakerName) speakerName.textContent = currentLine.name;
    } else {
        // 如果没有名字（旁白/内心独白），隐藏名字框
        nameTagContainer.style.display = 'none';
    }

    // 更新对话内容
    if (dialogueText) dialogueText.textContent = currentLine.text;

    currentLineIndex++;
}

// 绑定点击推进对话事件
gameplayLayer.addEventListener('click', function(event) {
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

// 主菜单功能
function loadGame() { alert('打开【读取存档】面板...'); }
function continueGame() { alert('正在加载最新存档，【继续游戏】...'); }
function flowchart() { alert('打开【流程图】界面...'); }
function settings() { alert('打开【系统设置】面板...'); }
function exitGame() {
    if(confirm('确定要退出游戏吗？未保存的进度将会丢失。')) {
        alert('游戏已结束。');
    }
}
