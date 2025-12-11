// now turning on the background music for some relaxing tunes
// Credit for music: haruta @ https://opengameart.org/content/land-of-snow (attribution free)

// this class is useful for abstracting audio logic, which isn't really part of the examination criteria so I didn't want it in main.js
export class AudioManager {
    constructor() {
        this.bgMusic = new Audio("./assets/audio/land_of_snow.mp3");
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;
        this.isMuted = false;
    } // in case autoplay isn't working, the start btn can fix it

    pauseMusic() {
        try { this.bgMusic.pause(); } catch (e) {}
    }

    resumeMusic() {
        this.playMusic();
    }

    playMusic() {
        this.bgMusic.play().catch(() => {});// in case browser blocks autoplay, start btn can call playMusic again
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.bgMusic.muted = this.isMuted;
        return this.isMuted;
    }
}
// [Dev note] the event listner for this is in popup.js, because it triggers the tunes start when start game btn click, not immediantly (logic works best this way)
