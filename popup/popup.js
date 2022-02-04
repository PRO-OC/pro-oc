// duplicated in popup.js, background.js, options.js (like inferface)
const PCR_POJISTOVNA = "PCRpojistovna";
const PCR_SAMOPLATCE = "PCRsamoplatce";
const PCR_KONFIRMACNI_POJISTOVNA = "PCRkonfirmacniPojistovna";
const PCR_KONFIRMACNI_SAMOPLATCE = "PCRkonfirmacniSamoplatce";
const AG_POJISTOVNA = "AGpojistovna";
const AG_SAMOPLATCE = "AGsamoplatce";

const REDIRECT_ZADANKA_TO_PACIENTI_COVID_19 = "RedirectZadankaToPacientiCovid19";

const PCR_POJISTOVNA_BUTTON_TEXT = "PCR na pojišťovnu";
const PCR_SAMOPLATCE_BUTTON_TEXT = "PCR samoplátce";
const PCR_KONFIRMACNI_POJISTOVNA_BUTTON_TEXT = "PCR konfirmační na pojišťovnu";
const PCR_KONFIRMACNI_SAMOPLATCE_BUTTON_TEXT = "PCR konfirmační samoplátce";
const AG_POJISTOVNA_BUTTON_TEXT = "AG na pojišťovnu";
const AG_SAMOPLATCE_BUTTON_TEXT = "AG samopláce";

var PCRpojistovnaButton = document.getElementById(PCR_POJISTOVNA);
var PCRsamoplatceButton = document.getElementById(PCR_SAMOPLATCE);
var PCRkonfirmacniPojistovnaButton = document.getElementById(PCR_KONFIRMACNI_POJISTOVNA);
var PCRkonfirmacniSamoplatceButton = document.getElementById(PCR_KONFIRMACNI_SAMOPLATCE);
var AGpojistovnaButton = document.getElementById(AG_POJISTOVNA);
var AGsamoplatceButton = document.getElementById(AG_SAMOPLATCE);
var ZadankaToPacientiCovid19Button = document.getElementById("ZadankaToPacientiCovid19");
var OptionsPageButton = document.getElementById("OptionsPage");

if (ZadankaToPacientiCovid19Button) {
    ZadankaToPacientiCovid19Button.onclick = function() {
        chrome.runtime.sendMessage({
            "text": REDIRECT_ZADANKA_TO_PACIENTI_COVID_19
        });
    }
}

if (OptionsPageButton) {
    OptionsPageButton.onclick = function() {
        chrome.runtime.openOptionsPage();
    }
}

if (PCRpojistovnaButton) {
    PCRpojistovnaButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": PCR_POJISTOVNA
        });
    };
}

if (PCRsamoplatceButton) {
    PCRsamoplatceButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": PCR_SAMOPLATCE
        });
    };
}

if (PCRkonfirmacniPojistovnaButton) {
    PCRkonfirmacniPojistovnaButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": PCR_KONFIRMACNI_POJISTOVNA
        });
    };
}

if (PCRkonfirmacniSamoplatceButton) {
    PCRkonfirmacniSamoplatceButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": PCR_KONFIRMACNI_SAMOPLATCE
        });
    };
}

if (AGpojistovnaButton) {
    AGpojistovnaButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": AG_POJISTOVNA
        });
    };
}

if (AGsamoplatceButton) {
    AGsamoplatceButton.onclick = function() {
        chrome.runtime.sendMessage({
            "text": AG_SAMOPLATCE
        });
    };
}

function displayActualShortcutsForCommands() {
    chrome.commands.getAll(function (commands) {
      commands.forEach((command) => {
        switch(command.name) {
            case PCR_POJISTOVNA:
                if(PCRpojistovnaButton) {
                    PCRpojistovnaButton.textContent = PCR_POJISTOVNA_BUTTON_TEXT + " (" + command.shortcut + ")";
                }
                break;
            case PCR_SAMOPLATCE:
                if(PCRsamoplatceButton) {
                    PCRsamoplatceButton.textContent = PCR_SAMOPLATCE_BUTTON_TEXT + " (" + command.shortcut + ")";
                }
                break;
            case AG_SAMOPLATCE:
                if(AGsamoplatceButton) {
                    AGsamoplatceButton.textContent = AG_SAMOPLATCE_BUTTON_TEXT + " (" + command.shortcut + ")";
                }
                break;
            case AG_POJISTOVNA:
                if(AGpojistovnaButton) {
                    AGpojistovnaButton.textContent = AG_POJISTOVNA_BUTTON_TEXT + " (" + command.shortcut + ")";
                }
                break;
            default:
                break;
            }
        });
    });
}

window.onload = function() {
    displayActualShortcutsForCommands();
};