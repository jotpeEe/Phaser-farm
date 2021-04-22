import Phaser from 'phaser';
import './style.css';

import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import Market from './scenes/Market';
import House from './scenes/House';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800, // 1248
  height: 600, // 1088
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, House, Game, Market],
  scale: {
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
