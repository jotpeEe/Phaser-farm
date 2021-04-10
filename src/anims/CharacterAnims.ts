import Phaser from 'phaser'

const createCharacterAnimations = (anims: Phaser.Animations.AnimationManager) => {
    
  anims.create({
    key: 'char-idle-down',
    frames: [{ key: 'char', frame: 'walk-down-1.png' }]
  })

  anims.create({
    key: 'char-idle-up',
    frames: [{ key: 'char', frame: 'walk-top-1.png' }]
  })

  anims.create({
    key: 'char-idle-left',
    frames: [{ key: 'char', frame: 'walk-left-1.png' }]
  })

  anims.create({
    key: 'char-idle-right',
    frames: [{ key: 'char', frame: 'walk-right-1.png' }]
  })

  anims.create({
    key: 'char-run-down',
    frames: anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-down-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })
  
  anims.create({
    key: 'char-run-up',
    frames: anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-top-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  anims.create({
    key: 'char-run-left',
    frames: anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-left-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  anims.create({
    key: 'char-run-right',
    frames: anims.generateFrameNames('char', { start: 1, end: 9, prefix: 'walk-right-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })
}

export {
  createCharacterAnimations
}
