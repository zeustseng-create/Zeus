// 簡單 Canvas 射擊遊戲（純原生 JS）
(() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const restartBtn = document.getElementById('restart');
  let width, height;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.floor(rect.width);
    height = Math.floor(rect.height);
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  window.addEventListener('resize', resize);

  // game state
  let player = { x: 0, y: 0, radius: 18 };
  let bullets = [];
  let targets = [];
  let lastSpawn = 0;
  let spawnInterval = 1000; // ms
  let lastTime = 0;
  let score = 0;
  let running = true;

  function start() {
    resize();
    player.x = width / 2;
    player.y = height - 40;
    bullets = [];
    targets = [];
    lastSpawn = performance.now();
    lastTime = performance.now();
    score = 0;
    running = true;
    scoreEl.textContent = `分數: ${score}`;
    requestAnimationFrame(loop);
  }

  function spawnTarget() {
    const r = 14 + Math.random() * 18;
    const x = r + Math.random() * (width - r * 2);
    const speed = 40 + Math.random() * 80;
    const colors = ['#ff7043', '#ffd54f', '#ea80fc', '#81d4fa'];
    targets.push({ x, y: -r, r, speed, color: colors[Math.floor(Math.random()*colors.length)] });
  }

  function loop(ts) {
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;
    if (!running) return;

    // spawn
    if (ts - lastSpawn > spawnInterval) {
      spawnTarget();
      lastSpawn = ts;
      // gradually increase difficulty
      if (spawnInterval > 350) spawnInterval *= 0.98;
    }

    // update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed * dt;
      if (bullets[i].y < -10) bullets.splice(i,1);
    }

    // update targets
    for (let i = targets.length - 1; i >= 0; i--) {
      targets[i].y += targets[i].speed * dt;
      if (targets[i].y - targets[i].r > height) {
        // game over
        running = false;
      }
    }

    // collisions
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dx = t.x - b.x;
        const dy = t.y - b.y;
        const dist = Math.hypot(dx,dy);
        if (dist < t.r + b.r) {
          // hit
          targets.splice(i,1);
          bullets.splice(j,1);
          score += 10;
          scoreEl.textContent = `分數: ${score}`;
          break;
        }
      }
    }

    // render
    ctx.clearRect(0,0,width,height);

    // night sky
    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0,'#0b1220');
    g.addColorStop(1,'#1a1f2d');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // draw player (pumpkin-like)
    ctx.beginPath();
    ctx.fillStyle = '#ffb74d';
    ctx.ellipse(player.x, player.y, player.radius+6, player.radius+4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(player.x-6, player.y-22, 12, 8);

    // bullets
    for (const b of bullets) {
      ctx.beginPath();
      ctx.fillStyle = '#fff59d';
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
    }

    // targets
    for (const t of targets) {
      ctx.beginPath();
      // glow
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
      ctx.arc(t.x, t.y, t.r, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // face (simple)
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(t.x-4, t.y-2, Math.max(1, t.r*0.15), 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t.x+4, t.y-2, Math.max(1, t.r*0.15), 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillRect(t.x-6, t.y+3, 12, Math.max(1, t.r*0.2));
    }

    if (!running) {
      // game over overlay
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0,0,width,height);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = '36px system-ui, sans-serif';
      ctx.fillText('遊戲結束', width/2, height/2 - 10);
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(`最終分數：${score}`, width/2, height/2 + 24);
      return;
    }

    requestAnimationFrame(loop);
  }

  // input: click to shoot toward pointer
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    // create bullet from player to click direction
    const angle = Math.atan2(y - player.y, x - player.x);
    const speed = 420;
    bullets.push({ x: player.x, y: player.y, r:4, speed, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed });
  });

  // update bullet movement using vx/vy
  const origRequest = window.requestAnimationFrame;
  // override loop logic slightly to move bullets with vx/vy
  function moveBullets(dt) {
    for (let i = bullets.length -1; i>=0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < -10 || b.x > width+10 || b.y < -10 || b.y > height+10) bullets.splice(i,1);
    }
  }

  // patch loop to use moveBullets
  function loopPatched(ts) {
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;
    if (!running) return;

    if (ts - lastSpawn > spawnInterval) {
      spawnTarget();
      lastSpawn = ts;
      if (spawnInterval > 350) spawnInterval *= 0.98;
    }

    moveBullets(dt);

    for (let i = targets.length - 1; i >= 0; i--) {
      targets[i].y += targets[i].speed * dt;
      if (targets[i].y - targets[i].r > height) {
        running = false;
      }
    }

    // collisions
    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dx = t.x - b.x;
        const dy = t.y - b.y;
        const dist = Math.hypot(dx,dy);
        if (dist < t.r + b.r) {
          targets.splice(i,1);
          bullets.splice(j,1);
          score += 10;
          scoreEl.textContent = `分數: ${score}`;
          break;
        }
      }
    }

    // render (reuse previous render code)
    ctx.clearRect(0,0,width,height);
    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0,'#0b1220');
    g.addColorStop(1,'#1a1f2d');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // player
    ctx.beginPath();
    ctx.fillStyle = '#ffb74d';
    ctx.ellipse(player.x, player.y, player.radius+6, player.radius+4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(player.x-6, player.y-22, 12, 8);

    // bullets
    for (const b of bullets) {
      ctx.beginPath();
      ctx.fillStyle = '#fff59d';
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
    }

    // targets
    for (const t of targets) {
      ctx.beginPath();
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
      ctx.arc(t.x, t.y, t.r, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(t.x-4, t.y-2, Math.max(1, t.r*0.15), 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t.x+4, t.y-2, Math.max(1, t.r*0.15), 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillRect(t.x-6, t.y+3, 12, Math.max(1, t.r*0.2));
    }

    if (!running) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0,0,width,height);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = '36px system-ui, sans-serif';
      ctx.fillText('遊戲結束', width/2, height/2 - 10);
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(`最終分數：${score}`, width/2, height/2 + 24);
      return;
    }

    requestAnimationFrame(loopPatched);
  }

  restartBtn.addEventListener('click', () => {
    start();
  });

  // initial start
  start();
  // replace default loop with patched version
  requestAnimationFrame(loopPatched);
})();
