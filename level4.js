class Level4 extends Phaser.Scene {
    constructor() {
        super('Level4');
    }

    preload() {
        this.load.image('mall', 'https://labs.phaser.io/assets/skies/gradient1.png');
        this.load.audio('bgm4', 'https://labs.phaser.io/assets/audio/SoundEffects/alien_death1.wav');
        this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('cart', 'https://labs.phaser.io/assets/sprites/car90.png');
        this.load.image('box', 'https://labs.phaser.io/assets/sprites/crate.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('enemy', 'https://labs.phaser.io/assets/sprites/baddie.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('boxSound', 'https://labs.phaser.io/assets/audio/SoundEffects/p-ping.mp3');
        this.load.audio('hurt', 'https://labs.phaser.io/assets/audio/SoundEffects/shoot1.wav');
    }

    create() {
        this.add.image(400, 300, 'mall');
        this.music = this.sound.add('bgm4', { loop: true, volume: 0.3 });
        this.music.play();
        this.boxSound = this.sound.add('boxSound');
        this.hurtSound = this.sound.add('hurt');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(200, 450, 'ground');
        this.platforms.create(600, 350, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.boxes = this.physics.add.group({
            key: 'box',
            repeat: 7,
            setXY: { x: 50, y: 0, stepX: 90 }
        });

        this.boxes.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bully = this.physics.add.sprite(700, 300, 'enemy');
        this.bully.setBounce(1);
        this.bully.setCollideWorldBounds(true);
        this.bully.setVelocityX(-120);

        this.carts = this.physics.add.group();
        const cart = this.carts.create(0, 510, 'cart');
        cart.setVelocityX(100);
        cart.setCollideWorldBounds(true);
        cart.setBounce(1);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.boxes, this.platforms);
        this.physics.add.collider(this.bully, this.platforms);
        this.physics.add.collider(this.carts, this.platforms);
        this.physics.add.collider(this.bully, this.player, this.hitBully, null, this);
        this.physics.add.collider(this.player, this.carts, this.hitBully, null, this);
        this.physics.add.overlap(this.player, this.boxes, this.collectBox, null, this);

        this.score = 0;
        this.lives = 3;
        this.scoreText = this.add.text(16, 16, 'Boxes: 0   Lives: 3', { fontSize: '32px', fill: '#fff' });
    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }

        if (Math.abs(this.player.x - this.bully.x) < 150) {
            this.bully.setVelocityX(this.player.x > this.bully.x ? 150 : -150);
        }
    }

    collectBox(player, box) {
        box.disableBody(true, true);
        this.score += 1;
        this.boxSound.play();
        this.scoreText.setText('Boxes: ' + this.score + '   Lives: ' + this.lives);
        if (this.score === 8) {
            this.music.stop();
            this.scoreText.setText('YOU SURVIVED THE MALL!');
        }
    }

    hitBully(player, bully) {
        this.hurtSound.play();
        this.lives -= 1;
        this.scoreText.setText('Boxes: ' + this.score + '   Lives: ' + this.lives);
        if (this.lives <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.music.stop();
            this.scoreText.setText('GAME OVER');
            this.gameOver = true;
        } else {
            this.player.setX(100);
            this.player.setY(450);
        }
    }
}
