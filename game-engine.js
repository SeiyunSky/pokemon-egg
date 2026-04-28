// ============================================================
// 游戏状态
// ============================================================
const GameState = {
  attributes: { fire: 0, water: 0, grass: 0, electric: 0, psychic: 0, ghost: 0, fighting: 0, dragon: 0 },
  currentScene: 'scene_01',

  reset() {
    this.attributes = { fire: 0, water: 0, grass: 0, electric: 0, psychic: 0, ghost: 0, fighting: 0, dragon: 0 };
    this.currentScene = 'scene_01';
  },

  applyWeights(weights) {
    for (const [attr, val] of Object.entries(weights)) {
      if (this.attributes[attr] !== undefined) this.attributes[attr] += val;
    }
    updateDebugPanel();
  },

  determineOutcome() {
    for (const pokemon of POKEMON_OUTCOMES) {
      if (pokemon.condition(this.attributes)) return pokemon;
    }
    return POKEMON_OUTCOMES.find(p => p.id === 'eevee');
  },
};

// ============================================================
// 工具函数
// ============================================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let _typingAbort = false;

async function typeWriter(containerEl, lines, speed = 38) {
  _typingAbort = false;
  containerEl.innerHTML = '';
  for (const line of lines) {
    if (_typingAbort) break;
    if (line === ' ') {
      containerEl.appendChild(document.createElement('br'));
      await sleep(speed * 2);
      continue;
    }
    const span = document.createElement('span');
    containerEl.appendChild(span);
    for (const char of line) {
      if (_typingAbort) { span.textContent += line.slice(span.textContent.length); break; }
      span.textContent += char;
      await sleep(speed);
    }
    containerEl.appendChild(document.createElement('br'));
  }
}

// ============================================================
// 调试面板
// ============================================================
function updateDebugPanel() {
  const panel = document.getElementById('debug-panel');
  if (!panel || panel.style.display === 'none') return;
  panel.innerHTML = Object.entries(GameState.attributes)
    .map(([k, v]) => `${ATTRIBUTES[k].label}: ${v}`)
    .join(' | ');
}

let debugVisible = false;
document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'D') {
    debugVisible = !debugVisible;
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.display = debugVisible ? 'block' : 'none';
      updateDebugPanel();
    }
  }
  // 点击屏幕跳过打字
  if (e.key === ' ' || e.key === 'Enter') _typingAbort = true;
});

// ============================================================
// 场景渲染
// ============================================================
async function renderScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return;
  GameState.currentScene = sceneId;

  const textEl = document.getElementById('game-text');
  const choicesEl = document.getElementById('game-choices');
  choicesEl.innerHTML = '';
  choicesEl.style.display = 'none';

  await typeWriter(textEl, scene.text);

  if (scene.isEnding) {
    await sleep(600);
    showOutcome();
    return;
  }

  choicesEl.style.display = 'flex';
  scene.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${i + 1}. ${choice.text}`;
    btn.addEventListener('click', () => {
      GameState.applyWeights(choice.weights);
      choicesEl.innerHTML = '';
      choicesEl.style.display = 'none';
      renderScene(choice.next);
    });
    choicesEl.appendChild(btn);
  });
}

// ============================================================
// 结局展示
// ============================================================
async function showOutcome() {
  const pokemon = GameState.determineOutcome();
  const textEl = document.getElementById('game-text');
  const choicesEl = document.getElementById('game-choices');

  // 闪烁过渡
  textEl.style.opacity = '0';
  await sleep(600);
  textEl.style.transition = 'opacity 1s';
  textEl.innerHTML = '';

  // 宝可梦名字
  const nameEl = document.createElement('div');
  nameEl.className = 'pokemon-reveal';
  nameEl.style.color = pokemon.color;
  nameEl.style.textShadow = `0 0 10px ${pokemon.color}, 0 0 20px ${pokemon.color}`;
  nameEl.textContent = `${pokemon.sprite} ${pokemon.name}`;
  textEl.appendChild(nameEl);
  textEl.appendChild(document.createElement('br'));

  const typeEl = document.createElement('div');
  typeEl.className = 'pokemon-type';
  typeEl.style.color = pokemon.color;
  typeEl.textContent = `[ ${pokemon.types.join(' / ')} ]  ${pokemon.rarity}`;
  textEl.appendChild(typeEl);
  textEl.appendChild(document.createElement('br'));
  textEl.appendChild(document.createElement('br'));

  textEl.style.opacity = '1';
  await sleep(800);

  // 描述逐字打印
  const descEl = document.createElement('span');
  descEl.className = 'pokemon-desc';
  textEl.appendChild(descEl);
  for (const char of pokemon.description) {
    descEl.textContent += char;
    await sleep(30);
  }

  await sleep(500);

  // 再玩按钮
  choicesEl.style.display = 'flex';
  const restartBtn = document.createElement('button');
  restartBtn.className = 'choice-btn restart-btn';
  restartBtn.textContent = '▶ 再次孵化';
  restartBtn.addEventListener('click', () => {
    GameState.reset();
    choicesEl.innerHTML = '';
    choicesEl.style.display = 'none';
    textEl.style.transition = '';
    textEl.style.opacity = '1';
    renderScene('scene_01');
  });
  choicesEl.appendChild(restartBtn);
}

// ============================================================
// 启动
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderScene('scene_01');

  // 点击屏幕跳过打字动画
  document.getElementById('screen').addEventListener('click', () => {
    _typingAbort = true;
  });
});
