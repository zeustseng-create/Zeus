class Target {
    constructor(public x: number, public y: number, public width: number, public height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    spawn() {
        // Logic to randomly position the target on the game field
        this.x = Math.random() * (window.innerWidth - this.width);
        this.y = Math.random() * (window.innerHeight - this.height);
    }

    checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
        return !(playerX > this.x + this.width ||
                 playerX + playerWidth < this.x ||
                 playerY > this.y + this.height ||
                 playerY + playerHeight < this.y);
    }
}