import Phaser from 'phaser'

import { debugDraw } from '../utils/debug';
import { createCharacterAnimations } from '../anims/CharacterAnims';
export default class Game extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private char!: Phaser.Physics.Arcade.Sprite

	constructor() {
		super('game')
	}

	preload() {
      this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {

    createCharacterAnimations(this.anims)

    const map = this.make.tilemap({ key: 'farm' })
    const tileset = map.addTilesetImage('farm', 'tiles')
    
    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)
    const midCharLayer = map.createLayer('mid-for-char', tileset)
    midLayer.setDepth(10);
    topLayer.setDepth(10);
    
    midCharLayer.setCollisionByProperty({ collides: true })
    bottomLayer.setCollisionByProperty({ collides: true })
    midLayer.setCollisionByProperty({ collides: true })
    topLayer.setCollisionByProperty({ collides: true })

    // debugDraw(bottomLayer, this)
    // debugDraw(midLayer, this)
    // debugDraw(topLayer, this)
    // debugDraw(midCharLayer, this)

    this.char = this.physics.add.sprite(500, 500, 'char', 'walk-down-1.png')
    this.char.body.setSize(this.char.width * 0.4, this.char.height * 0.4)
    this.char.body.offset.y = 18
    this.char.scale = 1.3

    this.char.anims.play('char-idle-down')

    this.physics.add.collider(this.char, bottomLayer)
    this.physics.add.collider(this.char, topLayer)
    this.physics.add.collider(this.char, midLayer)
    this.physics.add.collider(this.char, midCharLayer)

    this.cameras.main.startFollow(this.char, true)
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.char) {
      return
    }

    const speed = 150;

    if (this.cursors.left?.isDown) {

      this.char.play('char-run-left', true)
      this.char.setVelocity(-speed, 0)


    } else if (this.cursors.right?.isDown) {

      this.char.play('char-run-right', true)
      this.char.setVelocity(speed, 0)


    } else if (this.cursors.up?.isDown) {
      
      this.char.play('char-run-up', true)
      this.char.setVelocity(0, -speed)
      
    } else if (this.cursors.down?.isDown) {
      
      this.char.play('char-run-down', true)
      this.char.setVelocity(0, speed)

    } else {

      const parts = this.char.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.char.play(parts.join('-'))
      this.char.setVelocity(0, 0)

    }
    setTimeout(() => {
      this.scene.start('market')
    }, 5000)
  }
}
