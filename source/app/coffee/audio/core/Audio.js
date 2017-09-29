/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Audio {
    static initClass() {
    
        // stats
        this.STATS = {
            ChannelStrip: 0,
            Oscillator: 0,
            NoiseGenerator: 0
        };
    
        // audio context
        this.CONTEXT = new (window.AudioContext || window.webkitAudioContext)();
    
        // wave type
        this.WAVE_TYPE = [];
        this.WAVE_TYPE[AppData.WAVE_TYPE.SINE] = 'sine';
        this.WAVE_TYPE[AppData.WAVE_TYPE.TRIANGLE] = 'triangle';
        this.WAVE_TYPE[AppData.WAVE_TYPE.SQUARE] = 'square';
        this.WAVE_TYPE[AppData.WAVE_TYPE.SAWTOOTH] = 'sawtooth';
    
        // octave
        this.OCTAVE = [];
        this.OCTAVE[AppData.OCTAVE_TYPE.THIRTY_TWO] = 0.5;
        this.OCTAVE[AppData.OCTAVE_TYPE.SIXTEEN] = 1;
        this.OCTAVE[AppData.OCTAVE_TYPE.EIGHT] = 2;
        this.OCTAVE[AppData.OCTAVE_TYPE.FOUR] = 3;
    
        // noise
        this.NOISE_TYPE = [];
        this.NOISE_TYPE[AppData.NOISE_TYPE.WHITE] = 0;
        this.NOISE_TYPE[AppData.NOISE_TYPE.PINK] = 1;
        this.NOISE_TYPE[AppData.NOISE_TYPE.BROWN] = 2;
    
        // filter
        this.FILTER_TYPE = [];
        this.FILTER_TYPE[AppData.FILTER_TYPE.LOWPASS] = 'lowpass';
        this.FILTER_TYPE[AppData.FILTER_TYPE.HIGHPASS] = 'highpass';
        this.FILTER_TYPE[AppData.FILTER_TYPE.BANDPASS] = 'bandpass';
        this.FILTER_TYPE[AppData.FILTER_TYPE.LOWSHELF] = 'lowshelf';
        this.FILTER_TYPE[AppData.FILTER_TYPE.HIGHSHELF] = 'highshelf';
        this.FILTER_TYPE[AppData.FILTER_TYPE.PEAKING] = 'peaking';
        this.FILTER_TYPE[AppData.FILTER_TYPE.NOTCH] = 'notch';
        this.FILTER_TYPE[AppData.FILTER_TYPE.ALLPASS] = 'allpass';
    
        this.OCTAVE_STEP = 3;
        this.CUR_OCTAVE = [0.125, 0.25, 0.5, 1, 2, 4, 8];
    }

    // note to frequency
    static noteToFrequency(note)  {
        //global keyboard octave!
        const frequency = 440.0 * Math.pow( 2, ( note - 69 ) / 12 );
        return frequency;
    }
}
Audio.initClass();
