import Phaser from 'phaser'

import { createCharacterAnimations } from '../anims/CharacterAnims'
export default class Market extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private char!: Phaser.Physics.Arcade.Sprite
  
  constructor() {
    super('market')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    createCharacterAnimations(this.anims)

    const map = this.make.tilemap({ key: 'market' })
    const tileset = map.addTilesetImage('market', 'tiles')

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
    
    this.char = this.physics.add.sprite(780, 150, 'char', 'walk-down-1.png')
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
    let charVelocity = new Phaser.Math.Vector2();

    if (this.cursors.left?.isDown) {

      charVelocity.x -= 1;

    } else if (this.cursors.right?.isDown) {

      charVelocity.x += 1;
    } 
    
    if (this.cursors.up?.isDown) {
      
      charVelocity.y -= 1;
      
    } else if (this.cursors.down?.isDown) {
      
      charVelocity.y += 1;

    } else {

      const parts = this.char.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.char.play(parts.join('-'))
      this.char.setVelocity(0, 0)

    }

    charVelocity.normalize();
    charVelocity.scale(speed);
    this.char.setVelocity(charVelocity.x, charVelocity.y);
  }
}
