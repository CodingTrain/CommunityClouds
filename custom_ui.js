class FormFields {
    constructor() {
        this.id = null;
        this.nodesRef = null;
    }

    setId() {
        let id = "",
            length = 32,
            charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(let i = 0; i < length; i++) {
            id += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return id;
    }
}

class MaterialText extends FormFields {
    constructor(toolTip, regExPattern, regExDesc, required, name, label, value) {
        super();
        this.id            = this.setId();
        this.toolTip       = toolTip || "";
        this.regExPattern  = regExPattern || "";
        this.regExDesc     = regExDesc || "";
        this.required      = required || false;
        this.name          = name || "";
        this.label         = label || "";
        this.value         = value || "";
        this.validInput    = "";
        this.containerNode = "";
        this.labelNode     = "";
        this.inputNode     = "";
        this.nodesRef      = this.generateTree();
        this.validity      = true;

        this.addTextFieldListeners();

        document.getElementById("clouds-form-options").addEventListener("keypress", e => {
            let key = e.charCode || e.keyCode || 0;
            if(key === 13) e.preventDefault();
        });
    }

    generateTree() {
        let c = document.createElement("div"),
            l = document.createElement("label"),
            i = document.createElement("input");

        c.setAttribute("class", "text");

        l.setAttribute("for", this.id);
        l.classList.add("label-field-empty");
        l.innerText = this.label;

        i.setAttribute("type", "text");
        i.setAttribute("name", this.name);
        i.setAttribute("id", this.id);
        i.setAttribute("value", this.value);

        c.appendChild(l);
        c.appendChild(i);

        this.containerNode = c;
        this.labelNode     = l;
        this.inputNode     = i;

        return c;
    }

    modifyTextFieldLabel(e) {
        if(!this.labelNode) {
            return;
        }
        let newClass = "label-field-filled-nofocus"
        if(this.inputNode === document.activeElement) {
            newClass = "label-field-focus";
        } else if(!this.value) {
            newClass = "label-field-empty";
        }
        this.labelNode.className = newClass;
    }

    modifyTooltip(e) {
        let toolTip;
        /**if(this.toolTip && this.inputNode === document.activeElement) {
            toolTip = this.label ? "<span class='tooltip-title'>" + this.label + "</span></br>" + this.toolTip : this.toolTip;
            tooltipContainer.innerHTML = toolTip;
        } else {
            return;
        }**/
    }

    showErrorMessages() {
        let errorInfo = this.containerNode.querySelectorAll(".error-info")[0];
        if(this.inputNode.classList.contains("invalid")) {
            if(!errorInfo) {
                let errorInfo = document.createElement("span");
                if(this.required) {
                    errorInfo.innerText = "Required; " + this.regExDesc;
                } else {
                    errorInfo.innerText = this.regExDesc;
                }
                errorInfo.setAttribute("class", "error-info");
                this.containerNode.appendChild(errorInfo);
            }
        } else {
            if(errorInfo) {
                this.containerNode.removeChild(errorInfo);
            }
        }
    }

    validateInputEvent(e) {
        let regEx = new RegExp(this.regExPattern);
        this.validity = regEx.test(this.value);

        if(this.regExPattern && this.regExPattern.length > 0) {
            if(this.validity) {
                this.inputNode.removeAttribute("class");
            } else if(!this.value.length > 0) {
                this.inputNode.removeAttribute("class");
                if(!this.required) {
                    this.validity = true;
                }
            } else {
                this.inputNode.setAttribute("class", "invalid");
            }
        }
        if(this.validity || this.value === "") {
            this.validInput = this.value;
        }

        this.showErrorMessages();

        return true;
    }

    addTextFieldListeners() {
            this.inputNode.addEventListener("focus", this.modifyTextFieldLabel.bind(this));
            this.inputNode.addEventListener("blur", this.modifyTextFieldLabel.bind(this));
            this.inputNode.focus();
            this.inputNode.blur();

            this.inputNode.addEventListener("focus", this.modifyTooltip.bind(this));
            this.inputNode.addEventListener("blur", this.modifyTooltip.bind(this));
            this.inputNode.addEventListener("input", this.validateInputEvent.bind(this));

            this.inputNode.addEventListener("onchange", this.validateInputEvent.bind(this));

            this.validateInputEvent();
    }

    get value() {
        this.value = this.inputNode.value ? this.inputNode.value : "";
        return this._value;
    }

    set value(value) {
        return this._value = value;
    }
}

class MaterialSelect extends FormFields {
    constructor(selectableOptions, toolTip, callback) {
        super();
        this.id                = this.setId();
        this.toolTip           = toolTip || "";
        this.value             = "";
        this.containerNode     = "";
        this.ulNode            = "";
        this.curOpt            = "";
        this.curIndex          = "";
        this.curOptNode        = "";
        this.allOptNode        = "";
        this.optionsNodes      = [];
        this.selectableOptions = selectableOptions;
        this.changeCallback    = callback || null;
        this.nodesRef          = this.generateTree();

        this.addSelectorListeners();
    }

    generateTree() {
        let s = document.createElement("div"), // Selector container
            u = document.createElement("ul"),  // Outer ul
            c = document.createElement("li"),  // Current option
            a = document.createElement("li");  // All options

        s.setAttribute("id", this.id);
        s.setAttribute("class", "selection-container");

        u.setAttribute("class", "select-input");

        c.setAttribute("class", "opt-cur");
        c.setAttribute("id", "optCur");

        a.setAttribute("class", "all-opt");
        a.setAttribute("id", "allOpt");
        a.style.display = "none";

        s.appendChild(u);
        u.appendChild(c);
        u.appendChild(a);

        let selectableKeys = Object.keys(this.selectableOptions);
        selectableKeys.forEach(key => {
            let n = this.selectableOptions[key];
            let tmp = document.createElement("li");
            if(key === "default") {
                this.curOpt = n;
                this.curIndex = selectableKeys.indexOf(this.curOpt);
                this.value = this.selectableOptions[this.curOpt];
                return;
            }
            tmp.innerText = n;
            tmp.dataset.optionVal = key;
            tmp.dataset.optionIndex = selectableKeys.indexOf(key);
            tmp.classList.add("material-select-option");
            tmp.id = key.split(" ").join("_");
            this.optionsNodes.push(tmp);
            this.curOptNode = tmp;
            a.appendChild(tmp);
        });

        c.innerText = this.value;

        this.containerNode = s;
        this.ulNode        = u;
        this.curOptNode    = c;
        this.allOptNode    = a;

        return s;
    }

    chooseOptions(e) {
        if(e.target === this.curOptNode) {
            this.allOptNode.style.display = "block";
            return;
        } else if(e.target.classList.contains("material-select-option")) {
            this.curOpt = e.target.dataset.optionVal;
            this.curIndex = e.target.dataset.optionIndex;
            this.value = e.target.innerText;
            this.curOptNode.innerText = e.target.innerText;
        }
        this.allOptNode.style.display = "none";

        if(this.changeCallback !== null) {
            this.changeCallback();
        }

    }

    addSelectorListeners(){
        window.addEventListener("click", this.chooseOptions.bind(this));
    }
}
