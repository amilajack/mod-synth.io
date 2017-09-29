/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Prompt {
  constructor() {
    // builds the HTML
    // <div class="prompt--holder">
    //     <div class="prompt--holder-window">
    //         <div class="prompt--holder-message">Please choose patch name:</div>
    //         <input class="prompt--holder-input" type="text" name="fname">
    //         <div class="prompt--holder-buttons">
    //             <button>CANCEL</button>
    //             <button>OK</button>
    //         </div>
    //     </div>
    // </div>

    // Example:
    // App.PROMPT.dispatch {
    //     question: 'Patch name:'
    //     input: true
    //     onConfirm: (data) =>
    //         null
    // }

    // regular expression for input field
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.defaultREGEXP = /^.{4,}/;
    this.defaultValidationMessage = "Must have 4 or more characters";

    this.validateInput = false;
    this.validationMessage = this.defaultValidationMessage;
    this.validationREGEXP = this.defaultREGEXP;

    // confirm function (set by event prop)
    this.confirmFN = null;

    this.holder = document.createElement("div");
    this.holder.className = "prompt--holder";
    document.body.appendChild(this.holder);

    this.holderWindow = document.createElement("div");
    this.holderWindow.className = "prompt--holder-window";
    this.holder.appendChild(this.holderWindow);

    this.holderMessage = document.createElement("div");
    this.holderMessage.innerHTML = "QUESTION?";
    this.holderMessage.className = "prompt--holder-message";
    this.holderWindow.appendChild(this.holderMessage);

    this.holderInput = document.createElement("input");
    this.holderInput.type = "text";
    this.holderInput.className = "prompt--holder-input";
    this.holderInput.style.display = "none";
    this.holderWindow.appendChild(this.holderInput);

    this.holderInputValidation = document.createElement("p");
    this.holderInputValidation.className = "prompt--holder-input-validation";
    this.holderInputValidation.style.display = "none";
    this.holderWindow.appendChild(this.holderInputValidation);

    this.holderButtons = document.createElement("div");
    this.holderButtons.className = "prompt--holder-buttons";
    this.holderWindow.appendChild(this.holderButtons);

    this.cancel = document.createElement("button");
    this.cancel.innerHTML = "cancel";
    this.holderButtons.appendChild(this.cancel);

    this.confirm = document.createElement("button");
    this.confirm.innerHTML = "confirm";
    this.holderButtons.appendChild(this.confirm);
  }

  handleCancel(e) {
    this.hide();
    return null;
  }

  handleConfirm(e) {
    // if using validation the confirmFN will be called by validation method
    if (this.handleValidation()) {
      if (this.confirmFN) {
        this.confirmFN(this.holderInput.value);
      }
      this.hide();
    }
    return null;
  }

  handleValidation(regexp) {
    if (this.validateInput === false) {
      return true;
    }

    // implement regexp validation and toggle warning if is not valid
    if (this.defaultREGEXP.test(this.holderInput.value) === false) {
      this.holderInputValidation.style.display = "block";
      this.holderInputValidation.innerHTML = this.validationMessage;
      return false;
    } else {
      return true;
    }
  }

  show(data) {
    if (data.onConfirm) {
      this.confirmFN = data.onConfirm;
    }

    if (data.question) {
      this.holderMessage.innerHTML = data.question;
    }

    if (data.input) {
      this.holderInput.style.display = "block";
      this.validateInput = true;
      if (data.regexp) {
        this.validationREGEXP = data.regexp;
      }
    }

    AppData.KEYPRESS_ALLOWED = false;
    TweenLite.to(this.holder, 0.5, { autoAlpha: 1 });

    this.cancel.addEventListener("click", this.handleCancel, false);
    this.confirm.addEventListener("click", this.handleConfirm, false);
    return null;
  }

  hide() {
    this.cancel.removeEventListener("click", this.handleCancel, false);
    this.confirm.removeEventListener("click", this.handleConfirm, false);
    TweenLite.to(this.holder, 0.5, {
      autoAlpha: 0,
      onComplete: () => {
        AppData.KEYPRESS_ALLOWED = true;

        // reset everything
        this.holderInput.value = "";
        this.holderInput.style.display = "none";
        this.holderInputValidation.style.display = "none";

        this.validateInput = false;
        this.validationMessage = this.defaultValidationMessage;
        this.validationREGEXP = this.defaultREGEXP;

        this.confirmFN = null;

        return null;
      }
    });
    return null;
  }
}
