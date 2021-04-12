import Phaser from 'phaser'

import { debugDraw } from '../utils/debug';
import { createFarmerAnimation } from '../anims/Farmer';
import { createGirlAnimation } from '../anims/girl';
import '../character/farmer'
export default class Game extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer!: Phaser.Physics.Arcade.Sprite
  private farmer2!: Phaser.Physics.Arcade.Sprite

	constructor() {
		super('game')
	}

	preload() {
      this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {

    createFarmerAnimation(this.anims)

    const map = this.make.tilemap({ key: 'farm' })
    const tileset = map.addTilesetImage('farm', 'tiles')
    
    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)
    const midCharLayer = map.createLayer('mid-for-char', tileset)
    midLayer.setDepth(10);
    topLayer.setDepth(10);
  
    this.farmer = this.add.farmer(228, 228, 'farmer')

    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })
    midLayer.setCollisionByProperty({ collides: true })
    topLayer.setCollisionByProperty({ collides: true })

    // debugDraw(bottomLayer, this)
    // debugDraw(midLayer, this)
    // debugDraw(topLayer, this)
    // debugDraw(midCharLayer, this)

    // this.farmer.body.setSize(this.farmer.width * 0.4, this.farmer.height * 0.4)
    // this.farmer.body.offset.y = 18
    // this.farmer.scale = 1.3

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

    /* setTimeout(() => {
      this.scene.start('market')
    }, 5000) */
  }
}
