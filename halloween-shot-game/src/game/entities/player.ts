class Player {
    constructor(name) {
        this.name = name;
        this.health = 100;
        this.score = 0;
        this.position = { x: 0, y: 0 };
    }

    move(x, y) {
        this.position.x += x;
        this.position.y += y;
    }

    shoot() {
        console.log(`${this.name} shoots!`);
        // Implement shooting logic here
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`${this.name} has died.`);
        // Implement death logic here
    }

    updateScore(points) {
        this.score += points;
    }
}

export default Player;