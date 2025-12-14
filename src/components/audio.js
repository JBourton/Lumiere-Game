// now turning on the background music for some relaxing tunes
// Credit for music: haruta @ https://opengameart.org/content/land-of-snow (attribution free)

// this class is useful for abstracting audio logic, which isn't really part of the examination criteria so I didn't want it in main.js
export class AudioManager {
    constructor() {
        this.bg_music = new Audio("./assets/audio/land_of_snow.mp3");  // (fyi bg is "background")
        this.bg_music.loop = true;  // its a pretty short song so has to loop otherwise it just goes silent
        this.bg_music.volume = 0.3;
        this.is_muted = false;
    } // in case autoplay isn't working, the start btn can fix it

    pauseMusic() {
        this.bg_music.pause();
    }

    resumeMusic() {
        this.playMusic();
    }

    playMusic() {
        this.bg_music.play();// in case browser blocks autoplay, start btn can call playMusic again
    }

    toggleMute() {
        this.is_muted = !this.is_muted;
        this.bg_music.muted = this.is_muted;
        return this.is_muted;
    }
}
// [Dev note] the event listner for this is in popup.js, because it triggers the tunes start when start game btn click, not immediantly (logic works best this way)
