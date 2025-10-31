class HUD {
    score: number;
    lives: number;

    constructor() {
        this.score = 0;
        this.lives = 3;
    }

    updateScore(points: number) {
        this.score += points;
        this.render();
    }

    loseLife() {
        this.lives -= 1;
        this.render();
    }

    render() {
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');

        if (scoreElement) {
            scoreElement.innerText = `Score: ${this.score}`;
        }

        if (livesElement) {
            livesElement.innerText = `Lives: ${this.lives}`;
        }
    }
}

export default HUD;