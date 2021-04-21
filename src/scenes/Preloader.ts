import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'tiles/farm.png')
    this.load.image('bubble', 'resources/bubble.png')
    this.load.image('ground', 'tiles/ground.png')

    this.load.tilemapTiledJSON('farm', 'tiles/farm.json')
    this.load.tilemapTiledJSON('market', 'tiles/market.json')

    this.load.atlas('farmer', 'character/farmer.png', 'character/farmer.json')
    this.load.atlas('girl', 'character/girl.png', 'character/girl.json')
    this.load.atlas('girl2', 'character/girl2.png', 'character/girl2.json')
    this.load.atlas('girl3', 'character/girl3.png', 'character/girl3.json')
  }

  create() {
    this.scene.start('game')
  }
}
