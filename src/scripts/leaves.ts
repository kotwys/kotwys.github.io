type Leaf = {
  x0: number,
  y: number,
  t: number,
  el: HTMLElement,
};

const imagery = document.querySelector('.aboutme-imagery');

const createLeaf = (el?: HTMLElement): Leaf => {
  if (!el) {
    el = document.createElement('div');
    imagery.appendChild(el);
  }

  const leaf = {
    x0: Math.random() * 320,
    y: -40,
    t: 0,
    el,
  };

  el.className = `aboutme-leaf aboutme-leaf-${Math.random() > 0.6 ? '1' : '2'}`;
  el.style.display = 'block';
  updateLeafStyle(leaf);

  return leaf;
}

const dx = 20;
const w = Math.PI / 2000;
const updateLeafStyle = (leaf: Leaf) => {
  const x = leaf.x0 + Math.sin(leaf.t * w) * dx;
  leaf.el.style.left = x.toFixed(3) + 'px';
  leaf.el.style.top = leaf.y.toFixed(3) + 'px';
}

const leaves: Leaf[] = [];
const conservedLeaves: Leaf[] = [];
const conserveLeaf = (leaf: Leaf) => {
  leaf.el.style.display = 'none';
  conservedLeaves.push(leaf);
}

const reuseLeaf = (leaf: Leaf): Leaf => createLeaf(leaf.el);

let lastTime: number = 0, lastSpawn: number = 0, id: number;
const SPEED = 0.05;
const SPAWN_TIME = 2000;
const LIFETIME = 480 / SPEED;
const update = (now: number) => {
  const dt = now - lastTime;
  lastSpawn += dt;
  const leavesCount = leaves.length;
  const removeIds = [];
  for (let i = 0; i < leavesCount; i++) {
    const leaf = leaves[i];
    leaf.t += dt;
    if (leaf.t >= LIFETIME) {
      conserveLeaf(leaf);
      removeIds.push(i);
      continue;
    }

    leaf.y += SPEED * dt;
    updateLeafStyle(leaf);
  }

  for (const id of removeIds) {
    conservedLeaves.push(...leaves.splice(id, 1));
  }

  if (lastSpawn > SPAWN_TIME) {
    lastSpawn = 0;
    if (!conservedLeaves.length) {
      leaves.push(createLeaf());
    } else {
      leaves.push(reuseLeaf(conservedLeaves.pop()));
    }
  }

  lastTime = now;
  id = requestAnimationFrame(update);
}

if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  update(performance.now());
}