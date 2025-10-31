// This file serves as the entry point for the Halloween Shot Game application.
// It initializes the game engine and loads the game scene.

import { GameEngine } from './game/engine';

const gameEngine = new GameEngine();
gameEngine.start();