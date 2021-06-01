import Phaser from 'phaser';

// Loads animations which depends on character texture.
export default function createAnimation(
  anims: Phaser.Animations.AnimationManager,
  texture: string,
  frames: number,
) {
  anims.create({
    key: `${texture}-idle-down`,
    frames: [{ key: `${texture}`, frame: 'walk-down-1.png' }],
  });

  anims.create({
    key: `${texture}-idle-up`,
    frames: [{ key: `${texture}`, frame: 'walk-up-1.png' }],
  });

  anims.create({
    key: `${texture}-idle-left`,
    frames: [{ key: `${texture}`, frame: 'walk-left-1.png' }],
  });

  anims.create({
    key: `${texture}-idle-right`,
    frames: [{ key: `${texture}`, frame: 'walk-right-1.png' }],
  });

  anims.create({
    key: `${texture}-run-down`,
    frames: anims.generateFrameNames(`${texture}`, {
      start: 1, end: 3, prefix: 'walk-down-', suffix: '.png',
    }),
    repeat: -1,
    frameRate: frames,
  });

  anims.create({
    key: `${texture}-run-up`,
    frames: anims.generateFrameNames(`${texture}`, {
      start: 1, end: 3, prefix: 'walk-up-', suffix: '.png',
    }),
    repeat: -1,
    frameRate: frames,
  });

  anims.create({
    key: `${texture}-run-left`,
    frames: anims.generateFrameNames(`${texture}`, {
      start: 1, end: 3, prefix: 'walk-left-', suffix: '.png',
    }),
    repeat: -1,
    frameRate: frames,
  });

  anims.create({
    key: `${texture}-run-right`,
    frames: anims.generateFrameNames(`${texture}`, {
      start: 1, end: 3, prefix: 'walk-right-', suffix: '.png',
    }),
    repeat: -1,
    frameRate: frames,
  });
}
