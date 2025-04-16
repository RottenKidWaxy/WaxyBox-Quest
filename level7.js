class Level7 extends Phaser.Scene {
    constructor() {
        super('Level7');
    }

    preload() {
        this.load.image('vault', 'https://labs.phaser.io/assets/skies/starfield.png');
        this.load.audio('bgm7', 'https://labs.phaser.io/assets/audio/SoundEffects/key.wav');
        this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('goldcard', 'https://labs.phaser.io/assets/sprites/gold.png');
        this.load.image('projectile', 'https://labs.phaser.io/assets/sprites/shmup-bullet.png');
        this.load.image('prize', 'https://labs.phaser.io/assets/sprites/yellow_ball.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('collector', 'https://labs.phaser.io/assets/sprites/metalface78x92.png', { frameWidth: 78, frameHeight: 92 });
        this.load.audio('boxSound', 'https://labs.phaser.io/assets/audio/SoundEffects/p-ping.mp3');
        this.load.audio('hurt', 'https://labs.phaser.io/assets/audio/SoundEffects/shoot1.wav');
    }

    create() {
        this.add.image(400, 300, 'vault');
        this.music = this.sound.add('bgm7', { loop: true, volume: 0.3 });
        this.music.play();
        this.boxSound = this.sound.add('boxSound');
        this.hurtSound = this.sound.add('hurt');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(300, 450, 'ground');
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

        this.goldCards = this.physics.add.group({
            key: 'goldcard',
            repeat: 4,
            setXY: { x: 100, y: 0, stepX: 150 }
        });

        this.goldCards.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.collector = this.physics.add.sprite(400, 200, 'collector');
        this.collector.setImmovable(true);
        this.collector.body.allowGravity = false;

        this.projectiles = this.physics.add.group();

        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const proj = this.projectiles.create(this.collector.x, this.collector.y + 50, 'projectile');
                proj.setVelocityY(200);
            },
            loop: true
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.goldCards, this.platforms);
        this.physics.add.collider(this.player, this.projectiles, this.hitProjectile, null, this);
        this.physics.add.overlap(this.player, this.goldCards, this.collectGoldCard, null, this);

        this.prize = this.physics.add.sprite(400, 100, 'prize');
        this.prize.setVisible(false);
        this.physics.add.overlap(this.player, this.prize, this.winGame, null, this);

        this.score = 0;
        this.lives = 3;
        this.won = false;
        this.scoreText = this.add.text(16, 16, 'Gold Cards: 0   Lives: 3', { fontSize: '32px', fill: '#fff' });
    }

    update() {
        if (this.won || this.gameOver) return;

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
    }

    collectGoldCard(player, card) {
        card.disableBody(true, true);
        this.score += 1;
        this.boxSound.play();
        this.scoreText.setText('Gold Cards: ' + this.score + '   Lives: ' + this.lives);
        if (this.score === 5) {
            this.prize.setVisible(true);
        }
    }

    hitProjectile(player, proj) {
        proj.destroy();
        this.hurtSound.play();
        this.lives -= 1;
        this.scoreText.setText('Gold Cards: ' + this.score + '   Lives: ' + this.lives);
        if (this.lives <= 0) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.music.stop();
            this.scoreText.setText('GAME OVER');
            this.gameOver = true;
        }
    }

    winGame(player, prize) {
        prize.disableBody(true, true);
        this.music.stop();
        this.physics.pause();
        this.player.anims.play('turn');
        this.scoreText.setText('YOU WON THE 1/1 WAXPAX CARD!'); this.scene.start("EndCredits");
        this.won = true;
    }
}
