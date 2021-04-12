import Phaser from 'phaser'

const createGirlAnimation = (anims: Phaser.Animations.AnimationManager) => {
    
  anims.create({
    key: 'girl-idle-down',
    frames: [{ key: 'girl', frame: 'walk-down-1.png' }]
  })

  anims.create({
    key: 'girl-idle-up',
    frames: [{ key: 'girl', frame: 'walk-up-1.png' }]
  })

  anims.create({
    key: 'girl-idle-left',
    frames: [{ key: 'girl', frame: 'walk-left-1.png' }]
  })

  anims.create({
    key: 'girl-idle-right',
    frames: [{ key: 'girl', frame: 'walk-right-1.png' }]
  })

  anims.create({
    key: 'girl-run-down',
    frames: anims.generateFrameNames('girl', { start: 1, end: 3, prefix: 'walk-down-', suffix: '.png' }),
    repeat: -1,
    frameRate: 5
  })
  
  anims.create({
    key: 'girl-run-up',
    frames: anims.generateFrameNames('girl', { start: 1, end: 3, prefix: 'walk-up-', suffix: '.png' }),
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'girl-run-left',
    frames: anims.generateFrameNames('girl', { start: 1, end: 3, prefix: 'walk-left-', suffix: '.png' }),
    repeat: -1,
    frameRate: 5
  })

  anims.create({
    key: 'girl-run-right',
    frames: anims.generateFrameNames('girl', { start: 1, end: 3, prefix: 'walk-right-', suffix: '.png' }),
    repeat: -1,
    frameRate: 5
  })
}

export {
  createGirlAnimation
}
