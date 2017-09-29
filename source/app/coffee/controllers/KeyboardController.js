/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class KeyboardController {
  static initClass() {
    this.map = [];
    this.map[0] = { label: "A", keyCode: 65, note: "C2", midi: 48 };
    this.map[1] = { label: "W", keyCode: 87, note: "C2#", midi: 49 };
    this.map[2] = { label: "S", keyCode: 83, note: "D2", midi: 50 };
    this.map[3] = { label: "E", keyCode: 69, note: "D2#", midi: 51 };
    this.map[4] = { label: "D", keyCode: 68, note: "E2", midi: 52 };
    this.map[5] = { label: "F", keyCode: 70, note: "F2", midi: 53 };
    this.map[6] = { label: "T", keyCode: 84, note: "F2#", midi: 54 };
    this.map[7] = { label: "G", keyCode: 71, note: "G2", midi: 55 };
    this.map[8] = { label: "Y", keyCode: 89, note: "G2#", midi: 56 };
    this.map[9] = { label: "H", keyCode: 72, note: "A2", midi: 57 };
    this.map[10] = { label: "U", keyCode: 85, note: "A2#", midi: 58 };
    this.map[11] = { label: "J", keyCode: 74, note: "B2", midi: 59 };
    this.map[12] = { label: "K", keyCode: 75, note: "C3", midi: 60 };
    this.map[13] = { label: "O", keyCode: 79, note: "D3#", midi: 61 };
    this.map[14] = { label: "L", keyCode: 76, note: "D3", midi: 62 };
    this.map[15] = { label: "P", keyCode: 80, note: "D3#", midi: 63 };
  }

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.currentKeys = [];

    if ("onkeyup" in document.documentElement) {
      window.addEventListener("keydown", this.onKeyDown, false);
      window.addEventListener("keyup", this.onKeyUp, false);
    }
  }

  onKeyDown(e) {
    if (!AppData.KEYPRESS_ALLOWED) {
      return;
    }
    let value = false;
    for (
      let i = 0, end = KeyboardController.map.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (e.keyCode === KeyboardController.map[i].keyCode) {
        value = KeyboardController.map[i].midi;
        break;
      }
    }
    if (value) {
      if (this.currentKeys[value] === undefined) {
        this.currentKeys[value] = 1;
        App.NOTE_ON.dispatch({ note: value, velocity: 127.0 });
      }
    }
    return null;
  }

  onKeyUp(e) {
    if (!AppData.KEYPRESS_ALLOWED) {
      return;
    }
    let value = false;
    for (
      let i = 0, end = KeyboardController.map.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (e.keyCode === KeyboardController.map[i].keyCode) {
        value = KeyboardController.map[i].midi;
        break;
      }
    }
    if (value) {
      if (this.currentKeys[value]) {
        delete this.currentKeys[value];
        App.NOTE_OFF.dispatch({ note: value });
      }
    }
    return null;
  }
}
KeyboardController.initClass();
