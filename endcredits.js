
class EndCredits extends Phaser.Scene {
    constructor() {
        super('EndCredits');
    }

    preload() {
        this.load.audio('endMusic', 'https://labs.phaser.io/assets/audio/SoundEffects/alien_death1.wav');
    }

    create() {
        this.music = this.sound.add('endMusic', { loop: true, volume: 0.3 });
        this.music.play();

        this.add.text(200, 150, "YOU WON THE 1/1 WAXPAX CARD!", { fontSize: '28px', fill: '#ffff00' });
        this.add.text(270, 220, "Thanks for Playing!", { fontSize: '24px', fill: '#ffffff' });
        this.add.text(240, 270, "Created by WAXPAX 2025", { fontSize: '20px', fill: '#cccccc' });
        this.add.text(250, 320, "Press R to Restart", { fontSize: '20px', fill: '#999' });

        this.input.keyboard.once('keydown-R', () => {
            this.music.stop();
            this.scene.start('StartScreen');
        });
    }
}
