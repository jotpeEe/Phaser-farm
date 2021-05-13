import Phaser from 'phaser';
import createAnimation from '../utils/createAnimation';
import Merchant from '../character/girl';

interface Layers {
  bottomLayer: Phaser.Tilemaps.TilemapLayer
  midLayer: Phaser.Tilemaps.TilemapLayer
  midCharLayer: Phaser.Tilemaps.TilemapLayer
  waypoints: Phaser.Tilemaps.TilemapLayer
}

interface Npcs {
  farmer: Phaser.Physics.Arcade.Sprite
  shopper: Merchant
  shopDoor: Phaser.Physics.Arcade.Sprite
}
export default class Shop extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private activeTouch: Merchant
  private dialogBox: Phaser.GameObjects.Container
  private mapLayers: Layers
  private NPCs: Npcs
  private text: Phaser.GameObjects.Text
  private money: number
  private seeds: number

  constructor() {
    super('shop');
  }

  private handleDoor = () => {
    this.registry.set('lastScene', 'shop');
    this.registry.set('seeds', this.seeds);
    this.registry.set('money', this.money);
    this.scene.start('market');
  }

  private clearDialogBox = () => {
    this.input.keyboard.off('keyup-ONE');
    this.input.keyboard.off('keyup-TWO');
    this.input.keyboard.off('keyup-THREE');
    this.dialogBox.removeAll(true);
    this.dialogBox.destroy();
    this.dialogBox = undefined;
  }

  private handleTouch = (
    player: Phaser.Physics.Arcade.Sprite,
    shopper: Merchant,
  ) => {
    if (this.activeTouch) {
      return;
    }

    this.activeTouch = shopper;
    this.createDialogBox('Hello, would you like to buy some seeds?', true);
    this.activeTouch.collideTrue();
  }

  private updateActiveTile = () => {
    if (!this.activeTouch) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.NPCs.farmer.x, this.NPCs.farmer.y, this.activeTouch.x, this.activeTouch.y,
    );

    if (distance < 96) {
      return;
    }
    this.clearDialogBox();
    this.activeTouch.collideFalse();
    this.activeTouch = undefined;
  }

  private createDialogBox = (msg: string, confirm: boolean) => {
    const bg = this.add.rectangle(0, 0, this.scale.width, 150, 0x914f1d)
      .setOrigin(0);
    const textWidth = bg.width * 0.7;
    this.text = this.add.text(10, 10, msg);
    this.dialogBox = this.add.container(0, this.scale.height * 0.8)
      .setScrollFactor(0, 0)
      .add(bg)
      .add(this.text);
    if (confirm === true) {
      const yesText = this.add.text(this.text.x + textWidth + 10, 10, 'Yes, please!');
      const noText = this.add.text(yesText.x, yesText.y + yesText.height + 10, 'No, thank you');
      this.dialogBox.add(yesText)
        .add(noText);

      this.input.keyboard.on('keyup-Y', () => {
        if (this.activeTouch !== undefined) {
          this.text.text = 'What quantity?';
          this.dialogBox.remove(yesText)
            .remove(noText);
          yesText.destroy();
          noText.destroy();
          const textPress = this.add.text(this.text.x + textWidth + 10, 10, 'Press: ');
          const text1 = this.add.text(textPress.x, textPress.height + 15, '1. I want 1');
          const text2 = this.add.text(text1.x, text1.y + text1.height + 10, '2. I want 5');
          const text3 = this.add.text(text2.x, text2.y + text2.height + 10, '3. I want 10');
          this.dialogBox.add(textPress)
            .add(text1)
            .add(text2)
            .add(text3);

          this.input.keyboard.on('keyup-ONE', () => {
            if (this.money < 5) {
              const warning = this.add.text(text3.x - 2 * text3.width, text1.y, 'Not enough money');
              this.dialogBox.add(warning);
            } else {
              this.seeds += 1;
              this.money -= 5;
            }
          });
          this.input.keyboard.on('keyup-TWO', () => {
            if (this.money < 25) {
              const warning = this.add.text(text3.x - 2 * text3.width, text2.y, 'Not enough money');
              this.dialogBox.add(warning);
            } else {
              this.seeds += 5;
              this.money -= 25;
            }
          });
          this.input.keyboard.on('keyup-THREE', () => {
            if (this.money < 50) {
              const warning = this.add.text(text3.x - 2 * text3.width, text3.y, 'Not enough money');
              this.dialogBox.add(warning);
            } else {
              this.seeds += 10;
              this.money -= 50;
            }
          });
        }
      });

      this.input.keyboard.on('keyup-N', () => {
        if (this.activeTouch !== undefined) {
          this.dialogBox.setVisible(false);
        }
      });
    }
  }

  private createMap = () => {
    const map = this.make.tilemap({ key: 'shop' });
    const tileset = map.addTilesetImage('house', 'tilesHouse');

    const bottomLayer = map.createLayer('bottom', tileset)
      .setCollisionByProperty({ collides: true });

    const midLayer = map.createLayer('mid', tileset)
      .setDepth(10)
      .setCollisionByProperty({ collides: true });

    const midCharLayer = map.createLayer('mid-for-char', tileset)
      .setCollisionByProperty({ collides: true });

    const waypoints = map.createLayer('waypoints', tileset)
      .setCollisionByProperty({ collides: true });

    map.createLayer('top', tileset);

    this.mapLayers = {
      bottomLayer,
      midLayer,
      midCharLayer,
      waypoints,
    };
  }

  private addNPCs = () => {
    const merchant = this.physics.add.group({
      classType: Merchant,
      createCallback: (go) => {
        const merchantGo = go as Merchant;
        merchantGo.body.onCollide = true;
      },
    });

    const shopper = merchant.get(110, 298, 'girl');
    shopper.setDepth(1);
    shopper.body.setSize(160, 160);
    const farmer = this.add.farmer(240, 394, 'farmer');
    const shopDoor = this.physics.add.sprite(240, 400, 'floor')
      .setDepth(-1);
    shopDoor.body.offset.y = 32;

    this.NPCs = {
      shopper,
      farmer,
      shopDoor,
    };
  }

  private addColliders = () => {
    this.physics.add.collider(this.NPCs.shopper, this.mapLayers.waypoints);
    this.physics.add.collider(this.NPCs.farmer, this.mapLayers.bottomLayer);
    this.physics.add.collider(this.NPCs.farmer, this.mapLayers.midCharLayer);
    this.physics.add.collider(this.NPCs.farmer, this.mapLayers.midLayer);
    this.physics.add.collider(this.NPCs.farmer, this.NPCs.shopDoor, this.handleDoor);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createAnimation(this.anims, 'farmer', 15);
    createAnimation(this.anims, 'girl', 5);

    this.createMap();
    this.addNPCs();
    this.addColliders();

    this.money = this.registry.get('money');
    this.seeds = this.registry.get('seeds');

    this.physics.add.overlap(this.NPCs.farmer, this.NPCs.shopper, this.handleTouch);

    this.cameras.main.startFollow(this.NPCs.farmer, true);
  }

  update() {
    if (this.NPCs.farmer) {
      this.NPCs.farmer.update(this.cursors);
    }
    this.updateActiveTile();
  }
}
