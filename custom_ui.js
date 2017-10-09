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
            let index = Math.floor(Math.random() * charSet.length);
            id += charSet[index];
        }
        return id;
    }
}

class MaterialText extends FormFields {
    constructor(toolTip, rxPattern, rxDesc, required, name, label, value) {
        super();
        this.id            = this.setId();
        this.toolTip       = toolTip || "";
        this.rxPattern     = rxPattern || "";
        this.rxDesc        = rxDesc || "";
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

        document.getElementById("clouds-form-options")
            .addEventListener("keypress", e => {
                let key = e.charCode || e.keyCode || 0;
                if(key === 13) e.preventDefault();
            });
    }

    generateTree() {
        let c = document.createElement("div"),
            l = document.createElement("label"),
            i = document.createElement("input");

        c.classList.add("text");

        l.classList.add("label-field");
        l.innerText = this.label;
        l.setAttribute("for", this.id);

        i.id = this.id;
        i.value = this.value;
        i.setAttribute("type", "text");
        i.setAttribute("name", this.name);
        if(this.required) {
            i.setAttribute("required", "");
        }

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
        this.labelNode.classList.toggle("label-field-focus", this.focused);
        this.labelNode.classList.toggle("label-field-filled", this.value);
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
                errorInfo = document.createElement("span");
                if(this.required) {
                    errorInfo.innerText = "Required; " + this.rxDesc;
                } else {
                    errorInfo.innerText = this.rxDesc;
                }
                errorInfo.classList.add("error-info");
                this.containerNode.appendChild(errorInfo);
            }
        } else if(errorInfo) {
            this.containerNode.removeChild(errorInfo);
        }
    }

    validateInputEvent(e) {
        let rx = new RegExp(this.rxPattern);
        this.validity = rx.test(this.value);

        if(this.rxPattern && this.rxPattern.length > 0) {
            if(this.validity) {
                this.inputNode.className = "";
            } else if(!this.value.length > 0) {
                this.inputNode.className = "";
                if(!this.required) {
                    this.validity = true;
                }
            } else {
                this.inputNode.className = "";
                this.inputNode.classList.add("invalid");
            }
        }
        if(this.validity || this.value === "") {
            this.validInput = this.value;
        }

        this.showErrorMessages();

        return true;
    }

    addTextFieldListeners() {
        let modifyTextFieldLabel = this.modifyTextFieldLabel.bind(this),
            modifyTooltip = this.modifyTooltip.bind(this),
            validateInputEvent = this.validateInputEvent.bind(this);

        this.inputNode.addEventListener("focus", modifyTextFieldLabel);
        this.inputNode.addEventListener("blur", modifyTextFieldLabel);
        this.inputNode.focus();
        this.inputNode.blur();

        this.inputNode.addEventListener("focus", modifyTooltip);
        this.inputNode.addEventListener("blur", modifyTooltip);
        this.inputNode.addEventListener("input", validateInputEvent);
        this.inputNode.addEventListener("onchange", validateInputEvent);

        this.validateInputEvent();
    }

    get value() {
        this.value = this.inputNode.value || "";
        return this._value;
    }

    set value(value) {
        return this._value = value;
    }

    get focused() {
        return this.inputNode === document.activeElement;
    }
}

class MaterialSelect extends FormFields {
    constructor(selectableOptions, toolTip, sorted, changeCallback) {
        super();
        this.id                = this.setId();
        this.toolTip           = toolTip || "";
        this.value             = "";
        this.containerNode     = "";
        this.ulNode            = "";
        this.curOpt            = "";
        this.curIndex          = "";
        this.passedOrder       = [];
        this.optionsInOrder    = [];
        this.curOptNode        = "";
        this.optAllNode        = "";
        this.optionsNodes      = [];
        this.groupNodes        = [];
        this.groups            = {};
        this.default           = "";
        this.selectableOptions = selectableOptions || {};
        this.sorted            = sorted || false;
        this.changeCallback    = changeCallback || null;
        this.nodesRef          = this.generateTree();

        this.addSelectorListeners();
    }

    generateTree() {
        let s = document.createElement("div"), // Selector container
            u = document.createElement("ul"),  // Outer ul
            c = document.createElement("li"),  // Current option
            a = document.createElement("li");  // All options

        s.id = this.id;
        s.classList.add("selection-container");
        s.appendChild(u);

        u.classList.add("select-input");
        u.appendChild(c);
        u.appendChild(a);

        c.id = "opt-cur";
        c.classList.add("opt-cur");

        a.id = "opt-all";
        a.classList.add("opt-all");

        this.containerNode = s;
        this.ulNode        = u;
        this.curOptNode    = c;
        this.optAllNode    = a;

        this.handleGrouping();

        this.handleSorting();

        // Generate all options
        this.optionsInOrder.forEach(key => {
            let item         = this.selectableOptions[key],
                preSortIndex = this.passedOrder.indexOf(key),
                index        = item.index,
                group        = item.group;

            let tmp = document.createElement("li");
            tmp.innerText                  = item.value;
            this.passedOrder[preSortIndex] = key;
            tmp.id                         = key.split(" ").join("_");
            tmp.classList.add("material-select-option");
            this.optionsNodes.push(tmp);

            this.groupNodes[group].appendChild(tmp);
        });

        for(let key in this.groupNodes) {
            a.appendChild(this.groupNodes[key]);
        }

        this.setOptionByIndex(this.selectableOptions[this.default].index);

        return s;
    }

    handleGrouping() {
        for(let key in this.selectableOptions){
            let curItem      = this.selectableOptions[key],
                curItemGroup = curItem.group,
                isDefault    = curItem.default || false;
            if(isDefault){
                if(this.default){
                    throw new Error("Only one default option may be set.");
                }
                this.default = key;
            }
            if(!curItemGroup){
                curItem.group = "no-group";
                curItemGroup = "no-group";
            }
            if(!(curItemGroup in this.groups)) {
                this.groups[curItemGroup] = {};
            }
            this.groups[curItemGroup][key] = curItem;
        }
        // Generate top-level group nodes
        for(let key in this.groups){
            let g     = document.createElement("div"); // Group container
            g.classList.add("group");
            g.id = "group-" + key;
            this.groupNodes[key] = g;
        };
    }

    handleSorting() {
        let opts = this.selectableOptions,
            k    = Object.keys;
        this.passedOrder = k(opts);
        if(this.sorted) {
            // Sort group names before sorting elements in groups
            let groupSort = k(this.groups).sort((a, b) => a.localeCompare(b)),
                indexTmp = -1;
            for(let i in groupSort){
                let itemSort = k(this.groups[groupSort[i]]).sort((a, b) => a.localeCompare(b));
                itemSort.forEach(key => {
                    indexTmp++;
                    opts[key].index = indexTmp;
                    this.optionsInOrder[indexTmp] = key;
                });
            }
        } else {
            let indexTmp = -1;
            k(opts).forEach(key => {
                indexTmp++;
                opts[key].index = indexTmp;
                this.optionsInOrder[indexTmp] = key;
            });
        }
    }

    clickOffReset(e) {
        let target = e.target;
        let resetCallback = this.clickOffReset.bind(this);
        if(!this.containerNode.contains(target)){
            this.containerNode.classList.remove("showing");
            window.removeEventListener("click", resetCallback);
        }
    }

    chooseOptions(e) {
        let target = e.target,
            isCurOpt = target === this.curOptNode,
            resetCallback = this.clickOffReset.bind(this);
        window.addEventListener("click", resetCallback);
        if(isCurOpt) {
            this.containerNode.classList.toggle("showing");
            return;
        }
        else {
            this.containerNode.classList.remove("showing");
            window.removeEventListener("click", resetCallback);
        }
        if(target.classList.contains("material-select-option")) {
            this.curIndex = target.dataset.optionIndex;
            this.setOptionByIndex(this.curIndex);
        }
        if(this.changeCallback !== null) {
            this.changeCallback();
        }
    }

    addSelectorListeners(){
        let chooseOptions = this.chooseOptions.bind(this);
        this.containerNode.addEventListener("click", chooseOptions);
    }

    setOptionByIndex(ind){
        let opts      = this.selectableOptions,
            curOption = this.optionsInOrder[ind];
        this.curOpt               = curOption;
        this.value                = opts[curOption].value;
        this.curOptNode.innerText = this.value;
    }

    nextItem(){
        if(this.curIndex < this.optionsInOrder.length - 1){
            this.curIndex++;
            this.setOptionByIndex(this.curIndex);
            if(this.changeCallback) {
                this.changeCallback();
            }
        }
        return;
    }

    previousItem(){
        if(this.curIndex > 0){
            this.curIndex--;
            this.setOptionByIndex(this.curIndex);
            if(this.changeCallback) {
                this.changeCallback();
            }
        }
        return;
    }

    get PresortIndex(){
        return this.passedOrder.indexOf(this.curOpt);
    }

}
