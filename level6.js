class Level6 extends Phaser.Scene {
    constructor() {
        super('Level6');
    }

    preload() {
        this.load.image('factory', 'https://labs.phaser.io/assets/skies/space2.png');
        this.load.audio('bgm6', 'https://labs.phaser.io/assets/audio/SoundEffects/zap.mp3');
        this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('belt', 'https://labs.phaser.io/assets/sprites/block.png');
        this.load.image('box', 'https://labs.phaser.io/assets/sprites/crate.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('robot', 'https://labs.phaser.io/assets/sprites/ufo.png', { frameWidth: 24, frameHeight: 21 });
        this.load.audio('boxSound', 'https://labs.phaser.io/assets/audio/SoundEffects/p-ping.mp3');
        this.load.audio('hurt', 'https://labs.phaser.io/assets/audio/SoundEffects/shoot1.wav');
    }

    create() {
        this.add.image(400, 300, 'factory');
        this.music = this.sound.add('bgm6', { loop: true, volume: 0.3 });
        this.music.play();
        this.boxSound = this.sound.add('boxSound');
        this.hurtSound = this.sound.add('hurt');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(300, 450, 'ground');
        this.platforms.create(500, 350, 'ground');

        // Conveyor belts (moving platforms)
        this.belts = this.physics.add.group();
        let belt = this.belts.create(200, 520, 'belt');
        belt.body.allowGravity = false;
        belt.setImmovable(true);
        belt.setVelocityX(50);

        let belt2 = this.belts.create(600, 520, 'belt');
        belt2.body.allowGravity = false;
        belt2.setImmovable(true);
        belt2.setVelocityX(-50);

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
            repeat: 9,
            setXY: { x: 40, y: 0, stepX: 80 }
        });

        this.boxes.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.robot = this.physics.add.sprite(600, 200, 'robot');
        this.robot.setBounce(1);
        this.robot.setCollideWorldBounds(true);
        this.robot.setVelocityX(-100);
        this.robot.body.allowGravity = false;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.boxes, this.platforms);
        this.physics.add.collider(this.robot, this.platforms);
        this.physics.add.collider(this.belts, this.player, this.onBelt, null, this);
        this.physics.add.collider(this.robot, this.player, this.hitRobot, null, this);
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
    }

    onBelt(player, belt) {
        player.x += (belt.body.velocity.x > 0 ? 1 : -1);
    }

    collectBox(player, box) {
        box.disableBody(true, true);
        this.score += 1;
        this.boxSound.play();
        this.scoreText.setText('Boxes: ' + this.score + '   Lives: ' + this.lives);
        if (this.score === 10) {
            this.music.stop();
            this.scoreText.setText('YOU ESCAPED THE FACTORY!');
        }
    }

    hitRobot(player, robot) {
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
