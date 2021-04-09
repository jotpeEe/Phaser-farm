import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1248,
	height: 1088,
	physics: {
		default: 'arcade',
		arcade: {
      debug: true,
			gravity: { y: 0 }
		}
	},
	scene: [Preloader, Game],
}

export default new Phaser.Game(config)
