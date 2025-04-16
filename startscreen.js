
class StartScreen extends Phaser.Scene {
    constructor() {
        super('StartScreen');
    }

    preload() {
        this.load.audio('startMusic', 'https://labs.phaser.io/assets/audio/loop.mp3');
    }

    create() {
        this.music = this.sound.add('startMusic', { loop: true, volume: 0.4 });
        this.music.play();

        this.add.text(180, 150, "WAXY'S BLOCK PARTY", { fontSize: '40px', fill: '#fff' });
        this.add.text(250, 220, "Press SPACE to Start", { fontSize: '24px', fill: '#fff' });
        this.add.text(260, 270, "Arrow keys to move", { fontSize: '20px', fill: '#ccc' });
        this.add.text(240, 300, "Collect all boxes & dodge bullies!", { fontSize: '20px', fill: '#ccc' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.music.stop();
            this.scene.start('Level1');
        });
    }
}
