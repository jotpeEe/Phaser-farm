import Phaser from 'phaser';

import createAnimation from '../utils/createAnimation';
import '../character/farmer';
import Girl from '../character/girl';

interface ILayers {
  portals: Phaser.Tilemaps.TilemapLayer,
  bottomLayer: Phaser.Tilemaps.TilemapLayer,
  midLayer: Phaser.Tilemaps.TilemapLayer,
  midCharLayer: Phaser.Tilemaps.TilemapLayer,
  boundries: Phaser.Tilemaps.TilemapLayer
}
export default class Market extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private farmer: Phaser.Physics.Arcade.Sprite
  private shopDoors: Phaser.Physics.Arcade.Sprite
  private dialogBubble: Phaser.Physics.Arcade.Sprite
  private townPeople: Phaser.Physics.Arcade.Group
  private activeTile: Girl
  private mapLayers: ILayers

  constructor() {
    super('market');
  }

  // Called before the Scenes create method, allowing you to preload assets that the Scene may need.
  preload = () => {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Called at the start of the scene, only once.
  create = () => {
    createAnimation(this.anims, 'farmer', 15);
    createAnimation(this.anims, 'girl', 5);
    createAnimation(this.anims, 'girl2', 5);
    createAnimation(this.anims, 'girl3', 5);

    this.createMap();
    this.createMainCharacter();
    this.createTownPeople();
    this.shopDoors = this.physics.add.sprite(560, 144, 'door')
      .setDepth(-1);

    this.addColliders();
    this.addNpcInteraction();

    this.cameras.main.startFollow(this.farmer, true);
  }

  // Main loop of the scene.
  update = () => {
    if (this.farmer) {
      this.farmer.update(this.cursors);
    }
    this.updateActiveTile();
  }

  private handlePortal = (
    player: Phaser.Physics.Arcade.Sprite,
    tile: Phaser.Physics.Arcade.Sprite,
  ) => {
    if (tile === this.shopDoors) {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, this.farmer.y));
      this.registry.set('lastScene', 'market');
      this.scene.start('shop');
    } else {
      this.registry.set('farmerPosition', new Phaser.Math.Vector2(this.farmer.x, 1100));
      this.scene.start('game');
    }
  }

  private handleOverlap = (
    player: Phaser.Physics.Arcade.Sprite,
    body: Girl,
  ) => {
    if (this.activeTile) {
      return;
    }

    this.activeTile = body;
  }

  private updateActiveTile = () => {
    if (!this.activeTile) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.farmer.x, this.farmer.y, this.activeTile.x, this.activeTile.y,
    );

    if (distance < 40) {
      this.activeTile.collideTrue();
      if (this.dialogBubble === undefined) {
        this.dialogBubble = this.physics.add.sprite(this.activeTile.x, this.activeTile.y - 20, 'bubble');
      }
      return;
    }
    this.activeTile.collideFalse();
    this.activeTile = undefined;
    this.dialogBubble.destroy();
    this.dialogBubble = undefined;
  }

  private createMainCharacter = () => {
    if (this.registry.values.farmerPosition !== undefined) {
      if (this.registry.values.lastScene === 'game') {
        this.farmer = this.add.farmer(this.registry.values.farmerPosition.x, 32, 'farmer');
      } else {
        this.farmer = this.add.farmer(this.registry.values.farmerPosition.x, this.registry.values.farmerPosition.y, 'farmer');
      }
    } else {
      this.farmer = this.add.farmer(780, 32, 'farmer');
    }
  }

  private createTownPeople = () => {
    this.townPeople = this.physics.add.group({
      classType: Girl,
      createCallback: (go) => {
        const girlGo = go as Girl;
        girlGo.body.onCollide = true;
        girlGo.setSize(girlGo.width * 0.5, girlGo.height);
      },
    });

    this.townPeople.get(780, 350, 'girl');
    this.townPeople.get(850, 850, 'girl2');
    this.townPeople.get(550, 650, 'girl3');
    this.townPeople.get(250, 450, 'girl3');
    this.townPeople.get(250, 850, 'girl');
    this.townPeople.get(450, 350, 'girl2');
  }

  private createMap = () => {
    const map = this.make.tilemap({ key: 'market' });
    const tileset = map.addTilesetImage('market', 'tiles');

    // Creating map layers with appropriate rendering order, and set collision if needed.
    const portals = map.createLayer('portals', tileset)
      .setCollisionByProperty({ collides: true });
    const boundries = map.createLayer('collision', tileset)
      .setCollisionByProperty({ collides: true });
    const bottomLayer = map.createLayer('bottom', tileset)
      .setCollisionByProperty({ collides: true });
    const midLayer = map.createLayer('mid', tileset)
      .setCollisionByProperty({ collides: true })
      .setDepth(10);
    map.createLayer('top', tileset)
      .setDepth(10);
    const midCharLayer = map.createLayer('mid-for-char', tileset)
      .setCollisionByProperty({ collides: true });

    this.mapLayers = {
      portals,
      boundries,
      bottomLayer,
      midCharLayer,
      midLayer,
    };
  }

  private addColliders = () => {
    this.physics.add.collider(this.farmer, this.shopDoors, this.handlePortal);
    this.physics.add.collider(this.farmer, this.mapLayers.portals, this.handlePortal);
    this.physics.add.collider(this.farmer, this.mapLayers.bottomLayer);
    this.physics.add.collider(this.farmer, this.mapLayers.midLayer);
    this.physics.add.collider(this.farmer, this.mapLayers.midCharLayer);
    this.physics.add.collider(this.townPeople, this.mapLayers.boundries);
    this.physics.add.collider(this.townPeople, this.mapLayers.midCharLayer);
  }

  private addNpcInteraction = () => {
    this.physics.add.overlap(this.farmer, this.townPeople, this.handleOverlap);
  }
}
