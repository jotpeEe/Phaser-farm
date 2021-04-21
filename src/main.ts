import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import Market from './scenes/Market'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1024, // 1248
	height: 768, //1088
	physics: {
		default: 'arcade',
		arcade: {
      debug: true,
			gravity: { y: 0 }
		}
	},
	scene: [Preloader, Game, Market],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH
  }
}

export default new Phaser.Game(config)
