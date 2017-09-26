class MaterialText {
    constructor(toolTip, regExPattern, regExDesc, required, name, label, value) {
        this._id            = this.setId();
        this._toolTip       = toolTip || "";
        this._regExPattern  = regExPattern || "";
        this._regExDesc     = regExDesc || "";
        this._required      = required || false;
        this._name          = name || "";
        this._label         = label || "";
        this._value         = value || "";
        this._containerNode = "";
        this._labelNode     = "";
        this._inputNode     = "";
        this._nodesRef      = this.generateTree();
        this._validity      = true;

        this.addTextFieldListeners();
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
        if(this.ToolTip && this.InputNode === document.activeElement) {
            toolTip = this.Label ? "<span class='tooltip-title'>" + this.Label + "</span></br>" + this.ToolTip : this.ToolTip;
            tooltipContainer.innerHTML = toolTip;
        } else {
            tooltipContainer.innerHTML = defaultTooltip;
        }
    }

    hasClass(elem, cls) {
        return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
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

        this.showErrorMessages();

        //changeSubmitState();
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

    get Identifier(){
        return this._id;
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

    get Nodes(){
        return this._nodesRef;
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

}

class MaterialSelect {

}

var textInputNodes     = document.querySelectorAll("form span input[type ='text']"),
    selectInput        = document.querySelectorAll("form ul.select-input"),
    selectInputAll     = document.querySelectorAll("form ul.select-input li.all-opt"),
    selectInputCur     = document.querySelectorAll("form ul.select-input li.opt-cur"),
    tooltipContainer   = document.getElementById('fieldInformation');
    defaultTooltip     = tooltipContainer ? document.getElementById('fieldInformation').innerHTML : "",
    validInput         = "";

function changeSubmitState() {

    var invalidInputs = document.querySelectorAll("[data-cannot-send='true']"),
        emptyInputs = document.querySelectorAll(".label-field-empty [data-required='true']"),
        submitButton = document.querySelectorAll("form input[type='submit']");

    if(invalidInputs.length > 0 || emptyInputs.length > 0)
    {
        submitButton[0].disabled = true;
        if(nameInput.value == ""){
            validInput = "Example Name";
        } else {
            validInput = "Invalid input";
        }
    } else {
        submitButton[0].disabled = false;
        validInput = nameInput.value;
    }

}

/**
 * Dropdown functions
 */

function makeDropdownList(options){
    let out;
    for(let i in options){
        let tmp = document.createElement('li');
        tmp.innerHTML = i;
        tmp.setAttribute('data-option-val', i.toLowerCase());
        tmp.setAttribute('data-option-selected', false);
        if(options[i].toLowerCase() == "default"){
            tmp.setAttribute('data-option-selected', true);
        }
    }
    return out;
}

function selectedOption(parentNode){
    for(let i in parentNode.childNodes){
        let tmp = parentNode.childNodes[i];
        if(tmp.getAttribute('data-option-selected') == 'true'){
            return tmp.getAttribute('data-option-val');
        }
    }
}

function afterSelection(parentNode){
    let cur = parentNode.querySelectorAll(".opt-cur");
    console.log(cur);
}
