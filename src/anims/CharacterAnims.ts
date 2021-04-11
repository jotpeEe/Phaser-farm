import Phaser from 'phaser'

const createCharacterAnimations = (anims: Phaser.Animations.AnimationManager) => {
    
  anims.create({
    key: 'farmer-idle-down',
    frames: [{ key: 'farmer', frame: 'walk-down-1.png' }]
  })

  anims.create({
    key: 'farmer-idle-up',
    frames: [{ key: 'farmer', frame: 'walk-top-1.png' }]
  })

  anims.create({
    key: 'farmer-idle-left',
    frames: [{ key: 'farmer', frame: 'walk-left-1.png' }]
  })

  anims.create({
    key: 'farmer-idle-right',
    frames: [{ key: 'farmer', frame: 'walk-right-1.png' }]
  })

  anims.create({
    key: 'farmer-run-down',
    frames: anims.generateFrameNames('farmer', { start: 1, end: 9, prefix: 'walk-down-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })
  
  anims.create({
    key: 'farmer-run-up',
    frames: anims.generateFrameNames('farmer', { start: 1, end: 9, prefix: 'walk-top-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  anims.create({
    key: 'farmer-run-left',
    frames: anims.generateFrameNames('farmer', { start: 1, end: 9, prefix: 'walk-left-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  anims.create({
    key: 'farmer-run-right',
    frames: anims.generateFrameNames('farmer', { start: 1, end: 9, prefix: 'walk-right-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })
}

export {
  createCharacterAnimations
}
