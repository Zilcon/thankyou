// HTML要素の取得
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const message = document.querySelector('.message');

// キャンバスのサイズを画面全体に設定
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 花火とパーティクルを格納する配列
let fireworks = [];
let particles = [];

// ウィンドウサイズが変更されたらキャンバスサイズも追従させる
window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = canvas.innerHeight; // innerHeightを使用
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

// 乱数を生成するヘルパー関数
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 花火の粒子（パーティクル）を管理するクラス
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity; // 速度
        this.opacity = 1;         // 透明度
        this.gravity = 0.03;      // 重力
        this.friction = 0.99;     // 摩擦
        this.radius = random(1.5, 3); // パーティクルの大きさを少しランダムに
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 半径を使用
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        // 速度、位置、透明度を更新
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 0.005;
        this.draw();
    }
}

// 打ち上げから爆発までを管理する花火クラス
class Firework {
    constructor(x, y, targetY, color, isBig) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.isBig = isBig; // 巨大花火かどうかのフラグ
        this.velocity = { x: 0, y: random(-11, -7) };
        this.exploded = false;
        // 打ち上がる光
        this.trail = new Particle(this.x, this.y, this.color, this.velocity);
    }

    update() {
        // 爆発していなければ、目標の高さまで上昇
        if (!this.exploded) {
            this.trail.y += this.velocity.y;
            // 目標の高さに達したら爆発
            if (this.trail.y <= this.targetY) {
                this.explode();
                this.exploded = true;
                // もし巨大花火ならメッセージを表示し、背景花火を開始
                if (this.isBig) {
                    message.style.opacity = 1;
                    startSmallFireworks();
                }
            }
        }
    }

    draw() {
        if (!this.exploded) {
            this.trail.draw();
        }
    }
    
    // 爆発処理
    explode() {
        // 花火の大きさに応じて粒子の数を変える
        const particleCount = this.isBig ? 1500 : 150; // 巨大花火の粒子数を大幅に増加
        const angleIncrement = (Math.PI * 2) / particleCount;

        for (let i = 0; i < particleCount; i++) {
            // 爆発の強さをランダムにする
            const power = this.isBig ? random(5, 18) : random(2, 6); // 巨大花火の爆発の強さも増加
            const velocity = {
                x: Math.cos(angleIncrement * i) * power,
                y: Math.sin(angleIncrement * i) * power
            };
            particles.push(new Particle(this.trail.x, this.trail.y, this.color, velocity));
        }
    }
}

// アニメーションを継続的に実行する関数
function animate() {
    requestAnimationFrame(animate);
    // 画面を少しずつ暗くして残像効果を出す
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // すべての花火を更新・描画
    fireworks.forEach((firework, index) => {
        if (firework.exploded) {
            fireworks.splice(index, 1);
        } else {
            firework.update();
            firework.draw();
        }
    });

    // すべてのパーティクルを更新・描画
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
}

// 小さな花火を定期的に打ち上げる関数
function startSmallFireworks() {
    // 複数の花火が同時に上がるように、短い間隔で複数回打ち上げ処理を予約
    setInterval(() => {
        const numFireworksPerInterval = random(2, 5); // 2～5個の花火を同時に打ち上げる
        for (let i = 0; i < numFireworksPerInterval; i++) {
            setTimeout(() => {
                const x = random(canvasWidth * 0.1, canvasWidth * 0.9);
                const targetY = random(canvasHeight * 0.1, canvasHeight * 0.6); // 少し低めにも打ち上がるように
                const color = `hsl(${random(0, 360)}, 100%, 50%)`; // HSL色空間でカラフルな色を生成
                fireworks.push(new Firework(x, canvasHeight, targetY, color, false));
            }, random(0, 700)); // 0～0.7秒のランダムな遅延で打ち上げ
        }
    }, 500); // 0.5秒ごとに新しいグループの花火を打ち上げる
}

// 最初に巨大な花火を1つだけ打ち上げる
function launchInitialFirework() {
    const x = canvasWidth / 2;
    const targetY = canvasHeight / 3;
    const color = `hsl(${random(0, 360)}, 100%, 70%)`; // 少し明るい色
    fireworks.push(new Firework(x, canvasHeight, targetY, color, true));
}

// 実行開始
launchInitialFirework();
animate();
