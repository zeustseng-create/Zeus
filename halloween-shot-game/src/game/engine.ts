class GameEngine {
    private lastTime: number;
    private gameObjects: any[];

    constructor() {
        this.lastTime = 0;
        this.gameObjects = [];
    }

    public start(): void {
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number): void {
        for (const gameObject of this.gameObjects) {
            gameObject.update(deltaTime);
        }
    }

    private render(): void {
        // Clear the canvas and render game objects
        for (const gameObject of this.gameObjects) {
            gameObject.render();
        }
    }

    public addGameObject(gameObject: any): void {
        this.gameObjects.push(gameObject);
    }
}