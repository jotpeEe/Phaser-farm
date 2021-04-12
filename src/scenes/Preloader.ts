import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'tiles/farm.png')
    this.load.tilemapTiledJSON('farm', 'tiles/farm.json')
    this.load.tilemapTiledJSON('market', 'tiles/market.json')

    this.load.atlas('farmer', 'character/farmer.png', 'character/farmer.json')
    this.load.atlas('girl', 'character/girl.png', 'character/girl.json')
  }

  create() {
    this.scene.start('market')
  }
}
