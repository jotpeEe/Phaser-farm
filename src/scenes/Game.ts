import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';

import '../character/farmer';

export default class Game extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer: Phaser.Physics.Arcade.Sprite
  private activeFarm: Phaser.Physics.Arcade.Sprite
  private boxGroup: Phaser.Physics.Arcade.StaticGroup
  private clicked: boolean;
  private growthRate: number;
  private count: number;

  constructor() {
    super('game');
    this.clicked = false;
    this.growthRate = 1;
    this.count = 0;
  }

  private handlePortals = () => {
    this.scene.start('market');
  }

  private handleOverlap = (player: Phaser.Physics.Arcade.Sprite, body: any) => {
    if (this.activeFarm) {
      return;
    }
    this.activeFarm = body;
    this.activeFarm.setTint(0xD8D8D8);
  }

  private updateActiveTile = () => {
    if (!this.activeFarm) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeFarm.x, this.activeFarm.y - 16,
    );

    if (distance < 16) {
      return;
    }

    this.activeFarm.clearTint();
    this.activeFarm = undefined;
    this.clicked = false;
  }

  private createBoxes(x: number, y: number, rowes: number, columns: number) {
    const tempX = x;
    for (let row = 0; row < rowes; ++row) {
      for (let col = 0; col < columns; ++col) {
        this.boxGroup.get(x, y, 'ground');
        if (col === columns - 1) {
          x = tempX;
        } else {
          x += 32;
        }
      }
      y += 32;
    }
  }

  private upgradeFarms = (staticGroup: Phaser.Physics.Arcade.StaticGroup) => {
    staticGroup.children.each((e: Phaser.Physics.Arcade.Sprite) => {
      if (e.data !== null) {
        this.count += 1;
        const w = (Date.now() - e.data.get('created')) / 1000;
        if (w < this.growthRate) {
          e.setTexture('plantVerySmall');
        }
        if (w > this.growthRate && w < this.growthRate * 2) {
          e.setTexture('plantSmall');
        }
        if (w > this.growthRate * 2 && w < this.growthRate * 3) {
          e.setTexture('plantMedium');
        }
        if (w > this.growthRate * 3 && w < this.growthRate * 4) {
          e.setTexture('plantLarge');
        }
        if (w > this.growthRate * 4 && w < this.growthRate * 5) {
          e.setTexture('plantVeryLarge');
        }
        if (w > this.growthRate * 5 && w < this.growthRate * 6) {
          e.setTexture('plantExpire1');
        }
        if (w > this.growthRate * 6 && w < this.growthRate * 7) {
          e.setTexture('plantExpire2');
        }
        if (w > this.growthRate * 7 && w < this.growthRate * 8) {
          e.setTexture('plantExpire3');
        }
        if (w > this.growthRate * 8) {
          e.setTexture('ground');
          e.data.destroy();
          e.data = null;
        }
      }
    });
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);

    const map = this.make.tilemap({ key: 'farm' });
    const tileset = map.addTilesetImage('farm', 'tiles');

    const portals = map.createLayer('portals', tileset);
    const bottomLayer = map.createLayer('bottom', tileset);
    const midLayer = map.createLayer('mid', tileset);
    const topLayer = map.createLayer('top', tileset);
    const midCharLayer = map.createLayer('mid-for-char', tileset);

    midLayer.setDepth(10);
    topLayer.setDepth(10);

    this.boxGroup = this.physics.add.staticGroup();
    this.createBoxes(976, 464, 17, 7);
    this.createBoxes(48, 144, 3, 11);
    this.createBoxes(400, 208, 1, 1);
    this.createBoxes(368, 464, 8, 12);
    this.farmer = this.add.farmer(780, 1100, 'farmer');

    portals.setCollisionByProperty({ collides: true });
    midCharLayer.setCollisionByProperty({ collides: true });
    bottomLayer.setCollisionByProperty({ collides: true });

    this.physics.add.overlap(this.farmer, this.boxGroup, this.handleOverlap);
    this.physics.add.collider(this.farmer, portals, this.handlePortals, undefined, this);
    this.physics.add.collider(this.farmer, bottomLayer);
    this.physics.add.collider(this.farmer, midCharLayer);
    this.cameras.main.startFollow(this.farmer, true);
  }

  update() {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
    if (this.activeFarm !== undefined) {
      if (this.cursors.space.isDown && this.clicked === false) {
        this.activeFarm.data = new Phaser.Data.DataManager(this.activeFarm);
        this.activeFarm.data.set('created', Date.now());
        this.activeFarm.setTexture('plantVerySmall');
        this.clicked = true;
      }
    }

    this.upgradeFarms(this.boxGroup);
    this.updateActiveTile();
  }
}
