import 'phaser';

import MainScene from './scenes/MainScene';

const config:GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    scene: [
      MainScene
    ],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    }
};

new Phaser.Game(config);
