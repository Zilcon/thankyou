document.addEventListener('DOMContentLoaded', () => {
    // 2秒後（花火が爆発するタイミング）にパーティクルを生成
    setTimeout(createExplosion, 2000);
});

function createExplosion() {
    const particleCount = 100; // パーティクルの数
    const container = document.body;
    const colors = ['#ff4f4f', '#ffc14f', '#ffff4f', '#4fff4f', '#4fbfff', '#a44fff', '#ff4fa4'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        container.appendChild(particle);

        const angle = Math.random() * Math.PI * 2; // 360度ランダムな角度
        const distance = Math.random() * 150 + 50; // 爆発の半径
        const duration = Math.random() * 1.5 + 0.5; // アニメーション時間
        const delay = Math.random() * 0.2; // 開始の遅延

        // 最終的な位置
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        // パーティクルのスタイル設定
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // アニメーションの定義
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.1, 0.5, 0.2, 1)',
            fill: 'forwards'
        });

        // アニメーション終了後に要素を削除
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }
}
