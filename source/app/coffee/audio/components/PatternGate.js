/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class PatternGate extends Component {
  static initClass() {
    this.property("pattern", {
      get() {
        return this.parameters.pattern;
      },
      set(value) {
        if (this.parameters.pattern === value) {
          return this.parameters.pattern;
        }
        this.parameters.pattern = value;
        return this.parameters.pattern;
      }
    });
  }

  constructor(data) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        this;
      }).toString();
      let thisName = thisFn
        .slice(thisFn.indexOf("{") + 1, thisFn.indexOf(";"))
        .trim();
      eval(`${thisName} = this;`);
    }
    this.update = this.update.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    super(data);

    this.parameters.bypass = data.settings.bypass;
    this.parameters.pattern = data.settings.pattern;

    App.SETTINGS_CHANGE.add(this.onSettingsChange);

    this.lookahead = 25.0;
    this.scheduleAheadTime = 0.1;
    this.nextNoteTime = 0.0;

    this.last16thNoteDrawn = -1;
    this.notesInQueue = [];

    this.timerWorker = new Worker("workers/timeworker.js");
    this.timerWorker.onmessage = e => {
      if (e.data === "tick") {
        this.scheduler();
      }
      return null;
    };
    this.timerWorker.postMessage({ interval: this.lookahead });

    this.aux.gain.value = 0.0;
    this.play();
  }

  destroy() {
    this.stop();
    return null;
  }

  nextNote() {
    const secondsPerBeat = 60.0 / Session.BPM;
    this.nextNoteTime += 0.25 * secondsPerBeat;
    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
    return null;
  }

  scheduleNote(beatNumber, time) {
    this.notesInQueue.push({ note: beatNumber, time });

    if (
      this.parameters.pattern[beatNumber] === true &&
      Session.SETTINGS[this.component_session_uid].settings.bypass === false
    ) {
      this.aux.gain.setValueAtTime(1.0, time);
      this.aux.gain.linearRampToValueAtTime(0.001, time + 0.1);
      this.aux.gain.linearRampToValueAtTime(1.0, time + 0.11);
    }

    App.PATTERN_GATE.dispatch(beatNumber);
    return null;
  }

  scheduler() {
    while (
      this.nextNoteTime <
      Audio.CONTEXT.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
    return null;
  }

  play() {
    this.current16thNote = 0;
    this.nextNoteTime = Audio.CONTEXT.currentTime;
    this.timerWorker.postMessage("start");
    this.doUpdate = true;
    this.update();
    return null;
  }

  stop() {
    this.timerWorker.postMessage("stop");
    this.doUpdate = false;
    return null;
  }

  update() {
    if (this.doUpdate) {
      requestAnimationFrame(this.update);
    }

    let currentNote = this.last16thNoteDrawn;
    const { currentTime } = Audio.CONTEXT;

    while (
      this.notesInQueue.length &&
      this.notesInQueue[0].time < currentTime
    ) {
      currentNote = this.notesInQueue[0].note;
      this.notesInQueue.splice(0, 1);

      if (this.last16thNoteDrawn !== currentNote) {
        this.last16thNoteDrawn = currentNote;
      }
    }
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.pattern =
        Session.SETTINGS[this.component_session_uid].settings.pattern;
    }
    return null;
  }
}
PatternGate.initClass();
