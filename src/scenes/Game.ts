import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';

import '../character/farmer';

export default class Game extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer: Phaser.Physics.Arcade.Sprite
  private activeFarm: Phaser.Physics.Arcade.Sprite
  private plants: Phaser.Physics.Arcade.StaticGroup
  private houseDoor: Phaser.Physics.Arcade.Sprite
  private growthRate: number;
  private money: number;
  private seeds: number;

  constructor() {
    super('game');
    this.growthRate = 4;
  }

  private handlePortals = (player: Phaser.Physics.Arcade.Sprite, portal: any) => {
    if (portal === this.houseDoor) {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, this.farmer.y));
      this.scene.start('house');
    } else {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, 1100));
      this.registry.set('lastScene', 'game');
      this.scene.start('market');
    }
    this.registry.set('money', this.money);
    this.registry.set('seeds', this.seeds);
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
  }

  private createBoxes(x: number, y: number, rowes: number, columns: number) {
    const tempX = x;
    for (let row = 0; row < rowes; ++row) {
      for (let col = 0; col < columns; ++col) {
        this.plants.get(x, y, 'ground');
        if (col === columns - 1) {
          x = tempX;
        } else {
          x += 32;
        }
      }
      y += 32;
    }
  }

  private plantsLoop = (plants: Phaser.Physics.Arcade.StaticGroup) => {
    const array: number[] = [];
    let index = 0;
    plants.children.each((plant: Phaser.Physics.Arcade.Sprite) => {
      if (plant.data !== null) {
        array[index] = plant.data.values.created;
        index += 1;
        const dt = (Date.now() - plant.data.get('created')) / 1000;
        if (dt < this.growthRate) {
          plant.setTexture('plantVerySmall');
        }
        if (dt > this.growthRate && dt < this.growthRate * 2) {
          plant.setTexture('plantSmall');
        }
        if (dt > this.growthRate * 2 && dt < this.growthRate * 3) {
          plant.setTexture('plantMedium');
        }
        if (dt > this.growthRate * 3 && dt < this.growthRate * 4) {
          plant.setTexture('plantLarge');
        }
        if (dt > this.growthRate * 4 && dt < this.growthRate * 5) {
          plant.setTexture('plantVeryLarge');
        }
        if (dt > this.growthRate * 5 && dt < this.growthRate * 6) {
          plant.setTexture('plantExpire1');
        }
        if (dt > this.growthRate * 6 && dt < this.growthRate * 7) {
          plant.setTexture('plantExpire2');
        }
        if (dt > this.growthRate * 7) {
          plant.setTexture('plantExpire3');
        }
      } else {
        array[index] = null;
        index += 1;
      }
    });
    this.registry.set('plants', array);
  }

  private loadPlantsFromRegistry = (array: number[], plants: Phaser.Physics.Arcade.StaticGroup) => {
    let index = 0;
    plants.children.each((plant: Phaser.Physics.Arcade.Sprite) => {
      if (array[index] !== null) {
        plant.data = new Phaser.Data.DataManager(plant);
        plant.data.set('created', array[index]);
      }
      index += 1;
    });
  }

  private seedsAvailability = () => {
    if (this.seeds > 0) {
      return true;
    }
    return false;
  }

  private gatherPositive = () => {
    this.activeFarm.data = null;
    this.activeFarm.setTexture('ground');
    this.money += 6;
  }

  private clearPot = () => {
    this.activeFarm.data = null;
    this.activeFarm.setTexture('ground');
    this.money -= 15;
  }

  private plantActionManager = () => {
    if (this.activeFarm !== undefined) {
      if (this.cursors.space.isDown) {
        if (this.activeFarm.data === null && this.seedsAvailability()) {
          this.activeFarm.data = new Phaser.Data.DataManager(this.activeFarm);
          this.activeFarm.data.set('created', Date.now());
          this.activeFarm.setTexture('plantVerySmall');
          this.seeds -= 1;
        } else {
          const actions = {
            plantVeryLarge: () => this.gatherPositive(),
            plantExpire1: () => this.gatherPositive(),
            plantExpire2: () => this.clearPot(),
            plantExpire3: () => this.clearPot(),
          }[this.activeFarm.texture.key];
          actions?.();
        }
      }
    }
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);

    const map = this.make.tilemap({ key: 'farm' });
    const tileset = map.addTilesetImage('farm', 'tiles');

    const portals = map.createLayer('portals', tileset)
      .setCollisionByProperty({ collides: true });
    const bottomLayer = map.createLayer('bottom', tileset)
      .setCollisionByProperty({ collides: true });
    const midLayer = map.createLayer('mid', tileset);
    const topLayer = map.createLayer('top', tileset);
    const midCharLayer = map.createLayer('mid-for-char', tileset)
      .setCollisionByProperty({ collides: true });

    midLayer.setDepth(10);
    topLayer.setDepth(10);

    this.plants = this.physics.add.staticGroup();
    this.houseDoor = this.physics.add.sprite(624, 96, 'door');

    this.createBoxes(976, 464, 17, 7);
    this.createBoxes(48, 144, 3, 11);
    this.createBoxes(400, 208, 1, 1);
    this.createBoxes(368, 464, 8, 12);

    if (this.registry.values.money === undefined) {
      this.money = 0;
    } else {
      this.money = this.registry.get('money');
    }

    if (this.registry.values.seeds === undefined) {
      this.seeds = 10;
    } else {
      this.seeds = this.registry.get('seeds');
    }

    if (this.registry.values.plants !== undefined) {
      const array = this.registry.get('plants');
      this.loadPlantsFromRegistry(array, this.plants);
    }

    if (this.registry.values.farmerPosition !== undefined) {
      this.farmer = this.add.farmer(this.registry.values.farmerPosition.x, this.registry.values.farmerPosition.y, 'farmer');
    } else {
      this.farmer = this.add.farmer(780, 1100, 'farmer');
    }

    this.physics.add.overlap(this.farmer, this.plants, this.handleOverlap);
    this.physics.add.collider(this.farmer, portals, this.handlePortals, undefined, this);
    this.physics.add.collider(this.farmer, bottomLayer);
    this.physics.add.collider(this.farmer, midCharLayer);
    this.physics.add.overlap(this.farmer, this.houseDoor, this.handlePortals);

    this.cameras.main.startFollow(this.farmer, true);
  }

  update() {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
    this.plantActionManager();
    this.plantsLoop(this.plants);
    this.updateActiveTile();
  }
}
