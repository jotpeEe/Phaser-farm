import Phaser from 'phaser';

import tiles from '../assets/tiles/farm.png';
import bubble from '../assets/resources/bubble.png';
import ground from '../assets/tiles/ground.png';

import farmer from '../assets/character/farmer.png';
import girl from '../assets/character/girl.png';
import girl2 from '../assets/character/girl2.png';
import girl3 from '../assets/character/girl3.png';

import farmerDate from '../assets/character/farmer.json';
import girlData from '../assets/character/girl.json';
import girl2Data from '../assets/character/girl2.json';
import girl3Data from '../assets/character/girl3.json';
import farmData from '../assets/tiles/farm.json';
import marketData from '../assets/tiles/market.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', tiles);
    this.load.image('bubble', bubble);
    this.load.image('ground', ground);

    this.load.tilemapTiledJSON('farm', farmData);
    this.load.tilemapTiledJSON('market', marketData);

    this.load.atlas('farmer', farmer, farmerDate);
    this.load.atlas('girl', girl, girlData);
    this.load.atlas('girl2', girl2, girl2Data);
    this.load.atlas('girl3', girl3, girl3Data);
  }

  create() {
    this.scene.start('game');
  }
}
