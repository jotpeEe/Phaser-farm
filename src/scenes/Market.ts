import Phaser from 'phaser'

import { createFarmerAnimation } from '../anims/Farmer'
import '../character/farmer';
export default class Market extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer!: Phaser.Physics.Arcade.Sprite
  
  constructor() {
    super('market')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    createFarmerAnimation(this.anims)

    const map = this.make.tilemap({ key: 'market' })
    const tileset = map.addTilesetImage('market', 'tiles')

    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)
    const midCharLayer = map.createLayer('mid-for-char', tileset)
  
    midLayer.setDepth(10);
    topLayer.setDepth(10);

    this.farmer = this.add.farmer(780, 150, 'farmer')

    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })
    midLayer.setCollisionByProperty({ collides: true })
    topLayer.setCollisionByProperty({ collides: true })

    this.physics.add.collider(this.farmer, bottomLayer)
    this.physics.add.collider(this.farmer, topLayer)
    this.physics.add.collider(this.farmer, midLayer)
    this.physics.add.collider(this.farmer, midCharLayer)

    this.cameras.main.startFollow(this.farmer, true)
  }
  
  update(t: number, dt: number) {
    if (this.farmer) {
      this.farmer.update(this.cursors)
    }
  }
}
