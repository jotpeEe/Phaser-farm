import Phaser from 'phaser'

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
  }
}
