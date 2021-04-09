import Phaser from 'phaser'

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
    const map = this.make.tilemap({ key: 'farm' })
    const tileset = map.addTilesetImage('farm', 'tiles')
    
    const bottomLayer = map.createLayer('bottom', tileset)
    const midLayer = map.createLayer('mid', tileset)
    const topLayer = map.createLayer('top', tileset)

    const debugGraphics = this.add.graphics().setAlpha(0.7)
    
    bottomLayer.setCollisionByProperty({ collides: true})
    bottomLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
    midLayer.setCollisionByProperty({ collides: true})
    midLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
    topLayer.setCollisionByProperty({ collides: true})
    topLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })

    this.char = this.physics.add.sprite(500, 500, 'char', 'walk-down-1.png')
    this.char.body.setSize(this.char.width * 0.4, this.char.height * 0.8)
    this.char.body.offset.y = 6
    this.char.scale = 1.3

    this.anims.create({
      key: 'char-idle-down',
      frames: [{ key: 'char', frame: 'walk-down-1.png' }]
    })

    this.anims.create({
      key: 'char-idle-up',
      frames: [{ key: 'char', frame: 'walk-top-1.png' }]
    })

    this.anims.create({
      key: 'char-idle-left',
      frames: [{ key: 'char', frame: 'walk-left-1.png' }]
    })

    this.anims.create({
      key: 'char-idle-right',
      frames: [{ key: 'char', frame: 'walk-right-1.png' }]
    })

    this.anims.create({
      key: 'char-run-down',
      frames: this.anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-down-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })
    
    this.anims.create({
      key: 'char-run-up',
      frames: this.anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-top-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    this.anims.create({
      key: 'char-run-left',
      frames: this.anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    this.anims.create({
      key: 'char-run-right',
      frames: this.anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    this.char.anims.play('char-idle-down')

    this.physics.add.collider(this.char, bottomLayer)
    this.physics.add.collider(this.char, topLayer)
    this.physics.add.collider(this.char, midLayer)

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
  }
}
