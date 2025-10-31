class Game {
    constructor() {
        this.state = 'menu'; // Possible states: menu, playing, gameOver
        this.score = 0;
        this.player = null;
        this.targets = [];
    }

    init() {
        this.player = new Player();
        this.spawnTargets();
        this.startGameLoop();
    }

    spawnTargets() {
        for (let i = 0; i < 5; i++) {
            const target = new Target();
            this.targets.push(target);
        }
    }

    startGameLoop() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        if (this.state === 'playing') {
            this.player.update();
            this.targets.forEach(target => target.update());
            this.checkCollisions();
        }
    }

    render() {
        // Render game elements (player, targets, score, etc.)
    }

    checkCollisions() {
        this.targets.forEach((target, index) => {
            if (this.player.collidesWith(target)) {
                this.score += 10;
                this.targets.splice(index, 1);
                this.spawnTargets();
            }
        });
    }

    start() {
        this.state = 'playing';
        this.init();
    }

    gameOver() {
        this.state = 'gameOver';
        // Handle game over logic
    }
}