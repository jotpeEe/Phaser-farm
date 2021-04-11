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

    this.physics.add.collider(this.char, bottomLayer)
    this.physics.add.collider(this.char, topLayer)
    this.physics.add.collider(this.char, midLayer)
    this.physics.add.collider(this.char, midCharLayer)

    this.cameras.main.startFollow(this.char, true)
  }
  
  update(t: number, dt: number) {
    
}
