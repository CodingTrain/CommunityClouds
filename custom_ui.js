class FormFields {

        constructor(){
            // Just in case
        }

        setId() {
            let id = '',
                length = 32,
                charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (var i = length; i > 0; --i) {
                id += charSet[Math.floor(Math.random() * charSet.length)]
            }
            return id;
        }

        hasClass(elem, cls) {
            return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
        }

        get Identifier(){
            return this._id;
        }

        get Nodes(){
            return this._nodesRef;
        }

}

class MaterialText extends FormFields{
    constructor(toolTip, regExPattern, regExDesc, required, name, label, value) {
        super();
        this._id            = this.setId();
        this._toolTip       = toolTip || "";
        this._regExPattern  = regExPattern || "";
        this._regExDesc     = regExDesc || "";
        this._required      = required || false;
        this._name          = name || "";
        this._label         = label || "";
        this._value         = value || "";
        this._validInput    = "";
        this._containerNode = "";
        this._labelNode     = "";
        this._inputNode     = "";
        this._nodesRef      = this.generateTree();
        this._validity      = true;

        this.addTextFieldListeners();

        document.getElementById("cloudsFormOptions").onkeypress = (e) => {
            var key = e.charCode || e.keyCode || 0;
            if (key == 13) e.preventDefault();
        }
    }

    generateTree(){
        let c = document.createElement('span'),
            l = document.createElement('label'),
            i = document.createElement('input');

            l.setAttribute('for', this.Identifier);
            l.setAttribute('class', 'label-field-empty');
            l.innerHTML = this.Label;

            i.setAttribute('type', 'text');
            i.setAttribute('name', this.Name);
            i.setAttribute('id', this.Identifier);
            i.setAttribute('value', this.Value);

            c.appendChild(l);
            c.appendChild(i);

            this._containerNode = c;
            this._labelNode     = l;
            this._inputNode     = i;

            return c;
    }

    modifyTextFieldLabel(e) {
        if(this.LabelNode) {
            if(this.InputNode === document.activeElement) {
                this.LabelNode.className = "label-field-focus";
            } else {
                if(!this.Value) {
                    this.LabelNode.className = "label-field-empty";
                } else {
                    this.LabelNode.className = "label-field-filled-nofocus";
                }
            }
        }
        return;
    }

    modifyTooltip(e) {
        let toolTip;
        /**if(this.ToolTip && this.InputNode === document.activeElement) {
            toolTip = this.Label ? "<span class='tooltip-title'>" + this.Label + "</span></br>" + this.ToolTip : this.ToolTip;
            tooltipContainer.innerHTML = toolTip;
        } else {
            return;
        }**/
    }

    showErrorMessages() {
        if(this.hasClass(this.InputNode, "invalid")) {
            if(!this.ContainerNode.querySelectorAll(".error-info")[0]) {
                let errorInfo = document.createElement("span");
                if(this.Required) {
                    errorInfo.innerHTML = 'Required; ' + this.PatternDesc;
                } else {
                    errorInfo.innerHTML = this.PatternDesc;
                }
                errorInfo.setAttribute("class", "error-info");
                this.ContainerNode.appendChild(errorInfo);
            }
        } else {
            if(this.ContainerNode.querySelectorAll(".error-info")[0])
            {
                this.ContainerNode.removeChild(this.ContainerNode.querySelectorAll(".error-info")[0]);
            }
        }
    }

    validateInputEvent(e) {
        let regEx = new RegExp(this.Pattern),
            validity = regEx.test(this.Value);

        if(this.Pattern && this.Pattern.length > 0) {
            if(validity) {
                this.InputNode.removeAttribute('class');
                this.Validity = true;
            } else if(!this.Value.length > 0) {
                this.InputNode.removeAttribute('class');
                this.Validity = false;
                if(!this.Required) {
                    this.Validity = true;
                }
            } else {
                this.InputNode.setAttribute('class','invalid');
                this.Validity = false;
            }
        }
        if(this.Validity || this.Value == ""){
            this.ValidInput = this.Value;
        }

        this.showErrorMessages();

        return true;
    }

    addTextFieldListeners() {
            this.InputNode.addEventListener("focus", this.modifyTextFieldLabel.bind(this));
            this.InputNode.addEventListener("blur", this.modifyTextFieldLabel.bind(this));
            this.InputNode.focus();
            this.InputNode.blur();

            this.InputNode.addEventListener("focus", this.modifyTooltip.bind(this));
            this.InputNode.addEventListener("blur", this.modifyTooltip.bind(this));
            this.InputNode.addEventListener("input", this.validateInputEvent.bind(this));

            this.InputNode.addEventListener("onchange", this.validateInputEvent.bind(this));

            this.validateInputEvent();
    }

    set Value(input){
        this._value = input;
    }

    get Value(){
        this.Value = this.InputNode.value ? this.InputNode.value : "";
        return this._value;
    }

    get Label(){
        return this._label;
    }

    get Name(){
        return this._name;
    }

    get InputNode(){
        return this._inputNode;
    }

    get LabelNode(){
        return this._labelNode;
    }

    get ContainerNode(){
        return this._containerNode;
    }

    get Pattern(){
        return this._regExPattern;
    }

    get PatternDesc(){
        return this._regExDesc;
    }

    get Required(){
        return this._required;
    }

    get ToolTip(){
        return this._toolTip;
    }

    get Valid(){
        return this._validity;
    }

    set Validity(bool){
        this._validity = bool;
    }

    get Validity(){
        return this._validity;
    }

    get ValidInput(){
        return this._validInput;
    }

    set ValidInput(input){
        this._validInput = input;
    }

}

class MaterialSelect extends FormFields{
    constructor(selectableOptions, toolTip, callback) {
        super();
        this._id                = this.setId();
        this._toolTip           = toolTip || "";
        this._value             = "";
        this._containerNode     = "";
        this._ulNode            = "";
        this._curOpt            = "";
        this._curIndex          = "";
        this._curOptNode        = "";
        this._allOptNode        = "";
        this._optionsNodes      = [];
        this._selectableOptions = selectableOptions;
        this._changeCallback    = callback || "";
        this._nodesRef          = this.generateTree();

        this.addSelectorListeners();
    }

    generateTree(){
        let s = document.createElement('div'), // Selector container
            u = document.createElement('ul'),  // Outer ul
            c = document.createElement('li'),  // Current option
            a = document.createElement('li');  // All options

            s.setAttribute('id', this.Identifier);
            s.setAttribute('class', "selection-container");

            u.setAttribute('class', 'select-input');

            c.setAttribute('class', "opt-cur");
            c.setAttribute('id', "optCur");

            a.setAttribute('class', "all-opt");
            a.setAttribute('id', "allOpt");
            a.style.display = "none";

            s.appendChild(u);
            u.appendChild(c);
            u.appendChild(a);

            for(let i in this._selectableOptions){
                let tmp = document.createElement('li');
                if(i == 'default'){
                    this.CurOpt = this._selectableOptions[i];
                    this.CurIndex = Object.keys(this._selectableOptions).indexOf(this.CurOpt);
                    this.Value = this._selectableOptions[this.CurOpt];
                    continue;
                }
                tmp.innerHTML = this._selectableOptions[i];
                tmp.setAttribute('data-option-val', i);
                tmp.setAttribute('data-option-index', Object.keys(this._selectableOptions).indexOf(i));
                tmp.setAttribute('class', 'material-select-option');
                tmp.setAttribute('id', i.split(' ').join('_'));
                this.Options.push(tmp);
                this.CurOptNode = tmp;
                a.appendChild(tmp);
            }

            c.innerHTML = this.Value;

            this._containerNode = s;
            this._ulNode        = u;
            this._curOptNode    = c;
            this._allOptNode    = a;

            return s;
    }

    chooseOptions(e){
        if(e.target == this.CurOptNode){
            this.AllOptNode.style.display = "block";
            return;
        } else if(this.hasClass(e.target, "material-select-option")){
            this.CurOpt = e.target.getAttribute("data-option-val");
            this.CurIndex = e.target.getAttribute("data-option-index");
            this.Value = e.target.innerHTML;
            this.CurOptNode.innerHTML = this.Value;
        }
        this.AllOptNode.style.display = "none";

        if(this.Callback != ""){
            this.Callback();
        }

    }

    addSelectorListeners(){
            window.addEventListener("click", this.chooseOptions.bind(this));
    }

    set Value(input){
        this._value = input;
    }

    get Value(){
        return this._value;
    }

    get Options(){
        return this._optionsNodes;
    }

    set CurOptNode(input){
        this._curOptNode = input;
    }

    get CurOptNode(){
        return this._curOptNode;
    }

    get AllOptNode(){
        return this._allOptNode;
    }

    set CurOpt(input){
        this._curOpt = input;
    }

    get CurOpt(){
        return this._curOpt;
    }

    set CurIndex(input){
        this._curIndex = input;
    }

    get CurIndex(){
        return this._curIndex;
    }

    get Callback(){
        return this._changeCallback;
    }
}
