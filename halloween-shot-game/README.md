# Halloween Shot Game

Welcome to the Halloween Shot Game project! This is a fun and spooky shooting game themed around Halloween. Below are the details on how to set up and run the project.

## Project Structure

The project is organized as follows:

```
halloween-shot-game
├── public
│   └── index.html          # Main HTML file containing the game's structure and resources
├── src
│   ├── main.ts             # Entry point of the application, initializes the game engine
│   ├── game
│   │   ├── engine.ts       # Defines the game engine class for main loop and rendering
│   │   ├── game.ts         # Contains the main game logic, state management, and event handling
│   │   └── entities
│   │       ├── player.ts   # Defines the player class with properties and methods
│   │       └── target.ts   # Defines the target class with properties and methods
│   ├── ui
│   │   ├── hud.ts          # Defines the HUD class for displaying game status and score
│   │   └── menu.ts         # Defines the game menu class for start, pause, and end menus
│   ├── styles
│   │   └── styles.css      # CSS styles defining the game's appearance and layout
│   └── assets
│       └── sounds          # Contains sound files required for the game
├── package.json             # npm configuration file listing dependencies and scripts
├── tsconfig.json            # TypeScript configuration file specifying compilation options
├── vite.config.ts           # Vite configuration file for development server and build options
├── .gitignore               # Lists files and folders to ignore in version control
└── README.md                # Project documentation
```

## Installation

To get started with the Halloween Shot Game, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd halloween-shot-game
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Game

To run the game, use the following command:
```
npm run dev
```
This will start the development server, and you can access the game in your browser at `http://localhost:3000`.

## Contributing

If you would like to contribute to the project, feel free to submit a pull request or open an issue for any suggestions or bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

Enjoy the game and have a spooky Halloween!