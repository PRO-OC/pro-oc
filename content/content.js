// duplicated in popup.js, background.js, options.js (like inferface)
const ODBERNE_MISTO_KOD = "OdberneMistoKod";
const ORDINACE_EMAIL = "OrdinaceEmail";
const ORDINACE_TELEFON = "OrdinaceTelefon";
const ORDINACE_ICP_AG = "OrdinaceICPAG";
const ORDINACE_ICP_PCR = "OrdinaceICPPCR";
const AG_VYROBCE_TESTU_KOD = "AGVyrobceTestuKod";
const AG_VYROBCE_TESTU_TITLE = "AGVyrobceTestuTitle";
const PCR_PROVEDEN_ODBER = "PCRProvedenOdber";
const USE_TEST_REGISTERS = "UseTestRegisters";
const IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19 = "IsDisabledRedirectToPacientiCovid19";
const IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA = "IsDisabledPopupAboutParamsFromPosledniZadanka";
const AG_VYROBCE_LIST_URL = "AGVyrobceListUrl";

const CONFIRM_POSLEDNI_ZADANKA_RIZIKOVE_POVOLANI = "ConfirmPosledniZadankaRizikovePovolani";
const CONFIRM_POSLEDNI_ZADANKA_UDAJE_O_POBYTU = "ConfirmPosledniZadankaUdajeOPobytu";
const IS_ACTIVE_EREG_ROLE = "IsActiveEregRole";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === CONFIRM_POSLEDNI_ZADANKA_RIZIKOVE_POVOLANI) {
        var rizikovePovolaniTextSelectBox = document.getElementById("RizikovePovolaniKod");
        if (rizikovePovolaniTextSelectBox) {
            var i;
            for(i = 0; i < rizikovePovolaniTextSelectBox.options.length; i++) {

                var rizikovePovolaniText = rizikovePovolaniTextSelectBox.options[i].text;
                var rizikovePovolaniKod = rizikovePovolaniTextSelectBox.options[i].value;

                if(
                    rizikovePovolaniText === msg.data.RizikovePovolaniTextPosledniZadanka &&
                    rizikovePovolaniKod != msg.data.RizikovePovolaniKod) {

                    var confirmRizikovePovolani = window.confirm("Použít Rizikové povolání - kolektiv: " + rizikovePovolaniText + "? (poslední žádanka)");
                    if (confirmRizikovePovolani == true) {
                        sendResponse(rizikovePovolaniKod);
                        return;
                    }
                }
            }
        }
        sendResponse(null);
    } else if (msg.text === CONFIRM_POSLEDNI_ZADANKA_UDAJE_O_POBYTU && msg.data.TestovanyUlicePosledniZadanka && msg.data.TestovanyMestoPosledniZadanka && msg.data.TestovanyPSCPosledniZadanka) {
        var confirmUdajeOPobytu = window.confirm("Použít Údaje o pobytu: " + msg.data.TestovanyUlicePosledniZadanka + ", " + msg.data.TestovanyMestoPosledniZadanka + ", " + msg.data.TestovanyPSCPosledniZadanka + "? (poslední žádanka)");
        sendResponse(confirmUdajeOPobytu);
    } else if (msg.text === IS_ACTIVE_EREG_ROLE && msg.data.text && msg.data.roleName) {
        var parser = new DOMParser();
        var responseDocument = parser.parseFromString(msg.data.text,"text/html");
        var jenPOCTElement = responseDocument.getElementById("JenPOCT"); 

        if(jenPOCTElement && jenPOCTElement.value.toLowerCase() == "false") {
            sendResponse(true);
        } else {
            sendResponse(false);
        }
    }
    return true;
});

function getEregRegistrUrl(callback) {
    getEregRegistrDomain(function(eregRegistrDomain) {
        callback("https://" + eregRegistrDomain);
    });
}

function getRegistrUrl(callback) {
    getRegistrDomain(function(registrDomain) {
        callback("https://" + registrDomain);
    });
}

function getRegistrDomain(callback) {
    chrome.runtime.sendMessage({
        "text": "GetOptionValue",
        "name": USE_TEST_REGISTERS
        },
        function(useTestRegisters) {
            callback("https://" + useTestRegisters == "true" ? "eregpublicsecure2.ksrzis.cz" : "eregpublicsecure.ksrzis.cz");
    });
}

function getEregRegistrDomain(callback) {
    chrome.runtime.sendMessage({
        "text": "GetOptionValue",
        "name": USE_TEST_REGISTERS
        },
        function(useTestRegisters) {
            callback("https://" + useTestRegisters == "true" ? "ereg2.ksrzis.cz" : "ereg.ksrzis.cz");
    });
}

function getRegistrCUDVyhledaniPacientaUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/VyhledaniPacienta");
    });
}

function getRegistrCUDZadankyMojeZadankyUrlParams(Jmeno, Prijmeni, CisloPojistence) {
    var urlParams = new URLSearchParams();
    urlParams.set("Jmeno", Jmeno);
    urlParams.set("Prijmeni", Prijmeni);
    urlParams.set("CisloPojistence", CisloPojistence);
    urlParams.set("StavZadanky", "VseBezStorno");
    urlParams.set("_submit", "None");
    return urlParams;
}

function getRegistrCUDZadankyMojeZadankyPage() {
    return "/Registr/CUDZadanky/MojeZadanky";
}

function getRegistrCUDZadankyMojeZadankyUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/MojeZadanky");
    });
}

function getRegistrCUDOvereniPage() {
    return "/Registr/CUD/Overeni";
}

function getRegistrCUDOvereniUrl(callback) {
    getRegistrUrl(function(registrUrl) {
        callback(registrUrl + getRegistrCUDOvereniPage());
    });
}

function getRegistrCUDOvereniDetailCisloUrl(Cislo, callback) {
    getRegistrZadankyDomainUrl(function(registrZadankyDomainUrl) {
        callback(registrZadankyDomainUrl + "/DetailCislo?Cislo=" + Cislo);
    });
}

function getRegistrCUDOvereniGetCertifikatPage(Cislo) {
    return "/GetCertifikat?Cislo=" + Cislo;
}

function getRegistrCUDOvereniGetCertifikatUrl(Cislo) {
    getRegistrZadankyDomainUrl(function(registrZadankyDomainUrl) {
        callback(registrZadankyDomainUrl + getRegistrCUDOvereniGetCertifikatPage(Cislo));
    });
}

function getRegistrCUDZadankyPacientDetailSloucitPacientyUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/PacientDetail/SloucitPacienty");
    });
}

function getRegistrZadankyDomain(callback) {
    chrome.runtime.sendMessage({
        "text": "GetOptionValue",
        "name": USE_TEST_REGISTERS
        },
        function(useTestRegisters) {
            callback("https://" + useTestRegisters == "true" ? "eregpublicsecure2.ksrzis.cz" : "eregpublicsecure.ksrzis.cz");
    });
}
  
function getRegistrZadankyDomainUrl(callback) {
    getRegistrZadankyDomain(function(registrZadankyDomain) {
        callback("https://" + registrZadankyDomain);
    });
}

function getRegistrCUDZadankyVyhledaniPacientaPrehledVsechUrlParams(Jmeno, Prijmeni, DatumNarozeni) {
    var urlParams = new URLSearchParams();
    urlParams.set("Filter.Jmeno", Jmeno);
    urlParams.set("Filter.Prijmeni", Prijmeni);
    urlParams.set("Filter.DatumNarozeni", DatumNarozeni);
    urlParams.set("_submit", "None");
    urlParams.set("Filter.PageSize", 50);
    return urlParams;
}

function getRegistrCUDZadankyVyhledaniPacientaPrehledVsechPage() {
    return "/Registr/CUDZadanky/VyhledaniPacienta/PrehledVsech";
}

function getRegistrCUDZadankyVyhledaniPacientaPrehledVsechUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/VyhledaniPacienta/PrehledVsech");
    });
}

const TestovanyJmenoElement = document.getElementById("TestovanyJmeno");
const TestovanyPrijmeniElement = document.getElementById("TestovanyPrijmeni");
const TestovanyNarodnostElement = document.getElementById("TestovanyNarodnost");
const TestovanyDatumNarozeniElement = document.getElementById("TestovanyDatumNarozeni");
const TestovanyTelefonElement = document.getElementById("TestovanyTelefon");
const TestovanyEmailElement = document.getElementById("TestovanyDatumNarozeni");
const RizikovePovolaniKodElement = document.getElementById("RizikovePovolaniKod");
const OckoUzisUlozitElement = document.getElementById("OckoUzisUlozit");

const TestovanyCisloPojistenceElement = document.getElementById("TestovanyCisloPojistence");
const editFormElement = document.getElementById("editForm");
const formActionsElement = document.querySelector(".actions");

if(TestovanyJmenoElement) {
    TestovanyJmenoElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
    TestovanyJmenoElement.addEventListener('input', loadAndShowOckoUzisLastPatientActiveRequestIfExists);
}
if(TestovanyPrijmeniElement) {
    TestovanyPrijmeniElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
    TestovanyPrijmeniElement.addEventListener('input', loadAndShowOckoUzisLastPatientActiveRequestIfExists);
}
if(TestovanyCisloPojistenceElement) {
    TestovanyCisloPojistenceElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
    TestovanyCisloPojistenceElement.addEventListener('input', loadAndShowOckoUzisLastPatientActiveRequestIfExists);
}
if(TestovanyNarodnostElement) {
    TestovanyNarodnostElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
    TestovanyNarodnostElement.addEventListener('input', loadAndShowOckoUzisLastPatientActiveRequestIfExists);
}
if(TestovanyDatumNarozeniElement) {
    TestovanyDatumNarozeniElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
    TestovanyDatumNarozeniElement.addEventListener('input', loadAndShowOckoUzisLastPatientActiveRequestIfExists);
}

function removeReadOnlyOckoUzisPatientCredentials() {
    var OckoUzisTelefonElement = document.getElementById("OckoUzisTelefon");
    if(OckoUzisTelefonElement) {
        OckoUzisTelefonElement.removeAttribute("readonly");
    }
    var OckoUzisEmailElement = document.getElementById("OckoUzisEmail");
    if(OckoUzisEmailElement) {
        OckoUzisEmailElement.removeAttribute("readonly");
    }
}

function setReadOnlyOckoUzisPatientCredentials() {
    var OckoUzisTelefonElement = document.getElementById("OckoUzisTelefon");
    if(OckoUzisTelefonElement) {
        OckoUzisTelefonElement.setAttribute("readonly", true);
    }
    var OckoUzisEmailElement = document.getElementById("OckoUzisEmail");
    if(OckoUzisEmailElement) {
        OckoUzisEmailElement.setAttribute("readonly", true);
    }
}

function hideOckoUzisPatientCredentials() {
    var VFNfieldsetOckoUzisWrapDivElement = document.getElementById("VFNfieldsetOckoUzisWrapDiv");
    if(VFNfieldsetOckoUzisWrapDivElement) {
        VFNfieldsetOckoUzisWrapDivElement.setAttribute("style", "display:none;");
    }
}

function setOckoUzisPatientDetailEditLink(editLink) {
    var OckoUzisEditLinkElement = document.getElementById("OckoUzisEditLink");
    if(OckoUzisEditLinkElement) {
        OckoUzisEditLink.value = editLink;
    }
}

function setOckoUzisPatientCredentials(Telefon, Email) {

    var OckoUzisTelefonElement = document.getElementById("OckoUzisTelefon");
    var OckoUzisEmailElement = document.getElementById("OckoUzisEmail");
    var VFNfieldsetOckoUzisWrapDivElement = document.getElementById("VFNfieldsetOckoUzisWrapDiv");

    if((!OckoUzisTelefonElement || !OckoUzisEmailElement) && editFormElement) {
    
        var VFNfieldsetElement = document.createElement("fieldset");
        VFNfieldsetElement.setAttribute("id", "PacientiCovid19Profil");
    
        VFNfieldsetLegendElement = document.createElement("legend");
        VFNfieldsetLegendElement.innerHTML = "Profil na Pacienti Covid-19";
    
        VFNfieldsetElement.appendChild(VFNfieldsetLegendElement);
    
        VFNfieldsetOckoUzisWrapDivElement = document.createElement("div");
        VFNfieldsetOckoUzisWrapDivElement.setAttribute("id", "VFNfieldsetOckoUzisWrapDiv");

        VFNfieldsetElement.appendChild(VFNfieldsetOckoUzisWrapDivElement);


        // checkbox
        var OckoUzisFieldset1ColumnDivElement = document.createElement("div");
        OckoUzisFieldset1ColumnDivElement.setAttribute("class", "oneColumn");

        var OckoUzisEditCheckboxFieldGraphicDivElement = document.createElement("div");
        OckoUzisEditCheckboxFieldGraphicDivElement.setAttribute("class", "fieldGraphic");
    
        var OckoUzisUlozitElement = document.createElement("input");
        OckoUzisUlozitElement.setAttribute("type", "checkbox");
        OckoUzisUlozitElement.setAttribute("id", "OckoUzisUlozit");
        OckoUzisUlozitElement.setAttribute("name", "OckoUzisUlozit");
        OckoUzisUlozitElement.addEventListener("change", (event) => {
            if(event.target.checked) {
                removeReadOnlyOckoUzisPatientCredentials();
            } else {
                setReadOnlyOckoUzisPatientCredentials();
            }
        });

        var OckoUzisEditLinkElement = document.createElement("input");
        OckoUzisEditLinkElement.setAttribute("type", "hidden");
        OckoUzisEditLinkElement.setAttribute("id", "OckoUzisEditLink");

        OckoUzisEditCheckboxFieldGraphicDivElement.appendChild(OckoUzisEditLinkElement);

        OckoUzisEditCheckboxFieldGraphicDivElement.appendChild(OckoUzisUlozitElement);
    
        var OckoUzisEditCheckboxLabelElement = document.createElement("label");
        OckoUzisEditCheckboxLabelElement.setAttribute("for", "OckoUzisUlozit");
        OckoUzisEditCheckboxLabelElement.innerHTML = " Email a telefon v profilu budou nahrazeny těmito";

        OckoUzisEditCheckboxFieldGraphicDivElement.appendChild(OckoUzisEditCheckboxLabelElement);

        OckoUzisFieldset1ColumnDivElement.appendChild(OckoUzisEditCheckboxFieldGraphicDivElement);
        VFNfieldsetOckoUzisWrapDivElement.appendChild(OckoUzisFieldset1ColumnDivElement);
        //


        // telephone & email twoColumn
        var OckoUzisFieldset2ColumnDivElement = document.createElement("div");
        OckoUzisFieldset2ColumnDivElement.setAttribute("class", "twoColumn");

        // telefon
        var OckoUzisFieldsetFieldGraphic1DivElement = document.createElement("div");
        OckoUzisFieldsetFieldGraphic1DivElement.setAttribute("class", "fieldGraphic");

        var OckoUzisFieldsetTelefonLabelElement = document.createElement("label");
        OckoUzisFieldsetTelefonLabelElement.setAttribute("for", "OckoUzisTelefon");
        OckoUzisFieldsetTelefonLabelElement.innerHTML = "Kontaktní telefon";
    
        OckoUzisFieldsetFieldGraphic1DivElement.appendChild(OckoUzisFieldsetTelefonLabelElement);
    
        OckoUzisTelefonElement = document.createElement("input");
        OckoUzisTelefonElement.setAttribute("type", "text");
        OckoUzisTelefonElement.setAttribute("id", "OckoUzisTelefon");
        OckoUzisTelefonElement.setAttribute("name", "OckoUzisTelefon");
        OckoUzisTelefonElement.setAttribute("readonly", true);
    
        OckoUzisFieldsetFieldGraphic1DivElement.appendChild(OckoUzisTelefonElement);

        OckoUzisFieldset2ColumnDivElement.appendChild(OckoUzisFieldsetFieldGraphic1DivElement);
        //

        // email    
        var OckoUzisFieldsetFieldGraphicDiv2Element = document.createElement("div");
        OckoUzisFieldsetFieldGraphicDiv2Element.setAttribute("class", "fieldGraphic");

        var OckoUzisFieldsetEmailLabelElement = document.createElement("label");
        OckoUzisFieldsetEmailLabelElement.setAttribute("for", "OckoUzisEmail");
        OckoUzisFieldsetEmailLabelElement.innerHTML = "Kontaktní e-mail";

        OckoUzisFieldsetFieldGraphicDiv2Element.appendChild(OckoUzisFieldsetEmailLabelElement);

        OckoUzisEmailElement = document.createElement("input");
        OckoUzisEmailElement.setAttribute("type", "text");
        OckoUzisEmailElement.setAttribute("id", "OckoUzisEmail");
        OckoUzisEmailElement.setAttribute("name", "OckoUzisEmail");
        OckoUzisEmailElement.setAttribute("readonly", true);

        OckoUzisFieldsetFieldGraphicDiv2Element.appendChild(OckoUzisEmailElement);

        OckoUzisFieldset2ColumnDivElement.appendChild(OckoUzisFieldsetFieldGraphicDiv2Element);
        //
        VFNfieldsetOckoUzisWrapDivElement.appendChild(OckoUzisFieldset2ColumnDivElement);


        editFormElement.insertBefore(VFNfieldsetElement, RizikovePovolaniKodElement.parentElement.parentElement.parentElement);
    }
    VFNfieldsetOckoUzisWrapDivElement.setAttribute("style", "display:block;");

    OckoUzisTelefonElement.value = Telefon;
    OckoUzisEmailElement.value = Email;
}

function loadAndShowOckoUzisLastPatientActiveRequestIfExists() {
    if(
        editFormElement &&
        TestovanyJmenoElement && TestovanyJmenoElement.value && 
        TestovanyPrijmeniElement && TestovanyPrijmeniElement.value &&
        TestovanyNarodnostElement && TestovanyNarodnostElement.value &&
            (
                (TestovanyNarodnostElement.value == "CZ" && TestovanyCisloPojistenceElement && TestovanyCisloPojistenceElement.value) || 
                (TestovanyNarodnostElement.value != "CZ" && TestovanyDatumNarozeniElement && TestovanyDatumNarozeniElement.value)
            )
        ) {

            var Jmeno = TestovanyJmenoElement.value;
            var Prijmeni = TestovanyPrijmeniElement.value;
            var StatniPrislusnost = TestovanyNarodnostElement.value;
            var CisloPojistence = TestovanyCisloPojistenceElement.value;
            var DatumNarozeni = TestovanyDatumNarozeniElement.value;

            chrome.runtime.sendMessage({
                "text": "GetZadankaData",
                "data": {
                    "Jmeno": Jmeno,
                    "Prijmeni": Prijmeni,
                    "StatniPrislusnost": StatniPrislusnost,
                    "CisloPojistence": CisloPojistence,
                    "DatumNarozeni": DatumNarozeni
                }
            }, function (zadankaData) {
                var fieldsetId = "aktivni-zadanka-fieldset";
                var fieldset = document.getElementById(fieldsetId);

                if(zadankaData && zadankaData.Vysledek == "ZadankaExistuje") {

                    alert("Aktivní žádanka již existuje.");

                    var zkontrolovatZadankuFormId = "zkontrolovat-zadanku-form-id";
                    var zkontrolovatZadankuForm = document.getElementById(zkontrolovatZadankuFormId);
 
                    if(!zkontrolovatZadankuForm) {

                        createZkontrolovatZadankuForm("Zkontrolovat žádanku", zkontrolovatZadankuFormId, zadankaData, function(zkontrolovatZadankuForm) {

                            fieldset = document.createElement("fieldset");
                            fieldset.setAttribute("id", fieldsetId);
                            fieldset.setAttribute("style", "display: block;");
                            var legend = document.createElement("legend");
                            legend.innerText = "Aktivní žádanka";
                            fieldset.appendChild(legend);

                            var div = document.createElement("div");
                            div.setAttribute("class", "oneColumn");
                            div.setAttribute("class", "actions");
                        
                            div.appendChild(zkontrolovatZadankuForm);

                            var div2 = document.createElement("div");
                            div2.setAttribute("class", "oneColumn");

                            fieldset.appendChild(div);

                            editFormElement.insertBefore(fieldset, editFormElement.firstChild);
                        });
                    } else {
                        fieldset.setAttribute("style", "display: block;");
                    }
                } else if (fieldset) {
                    fieldset.setAttribute("style", "display: none;");
                }
            });
        }
}

function getPatientInfoFromPatientDetail(url, text) {
    var parser = new DOMParser();
    var responseDocument = parser.parseFromString(text,"text/html");

    var results = {};

    var results = {
        Telefon: undefined,
        Email: undefined,
        Cislo: undefined
    };

    var labels = responseDocument.getElementsByTagName('label');
    for (var i = 0; i < labels.length; i++) {
    switch(labels[i].htmlFor) {
        case 'Pacient_Telefon':
            results.Telefon = labels[i].nextElementSibling.innerText.trim();
            break;
        case 'Pacient_Email':
            results.Email = labels[i].nextElementSibling.innerText.trim();
            break;
        case 'Pacient_CisloPacienta':
            results.Cislo = labels[i].nextElementSibling.innerText.trim();
            break;
        }
    }

    results.Link = url;
    results.EditLink = url.replace("Index", "Edit");

    return results;
}

function loadAndSetOckoUzisPatientInformation() {
    if(
        TestovanyJmenoElement && TestovanyJmenoElement.value && 
        TestovanyPrijmeniElement && TestovanyPrijmeniElement.value &&
        TestovanyNarodnostElement && TestovanyNarodnostElement.value &&
            (
                (TestovanyNarodnostElement.value == "CZ" && TestovanyCisloPojistenceElement && TestovanyCisloPojistenceElement.value) || 
                (TestovanyNarodnostElement.value != "CZ" && TestovanyDatumNarozeniElement && TestovanyDatumNarozeniElement.value)
            )
        ) {
        var Jmeno = TestovanyJmenoElement.value;
        var Prijmeni = TestovanyPrijmeniElement.value;
        var StatniPrislusnost = TestovanyNarodnostElement.value;
        var CisloPojistence = TestovanyCisloPojistenceElement.value;
        var DatumNarozeni = TestovanyDatumNarozeniElement.value;
 
        chrome.runtime.sendMessage({
            "text": "GetPatientDetail",
            "data": {
                "Jmeno": Jmeno,
                "Prijmeni": Prijmeni,
                "StatniPrislusnost": StatniPrislusnost,
                "CisloPojistence": CisloPojistence
            }
        }, function(response) {
            var PatientInfo = getPatientInfoFromPatientDetail(response.url, response.text);

            const detailPacientaFormId = "detail-pacienta-form";

            if(PatientInfo.Cislo) {
                setOckoUzisPatientCredentials(PatientInfo.Telefon, PatientInfo.Email);
                setOckoUzisPatientDetailEditLink(PatientInfo.EditLink);
                setOckoUzisPatientDetailLink(PatientInfo.Link);

                var form = document.getElementById(detailPacientaFormId);
                if(form) {
                    form.parentNode.removeChild(form);
                }
            } else {
                createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence, false, function(form) {
                    actionsDiv.appendChild(form);
                }, detailPacientaFormId);
            }
        });
    } else {
        hideOckoUzisPatientCredentials();
    }
}

function setOckoUzisPatientDetailLink(link) {

    var linkElement = document.getElementById("OckoUzisLink");

    if(!linkElement) {
        linkElement = document.createElement("a");

        linkElement.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid");
        linkElement.setAttribute("href", link);
        linkElement.setAttribute("id", "OckoUzisLink");
        linkElement.text = "Detail pacienta";
        linkElement.setAttribute("role", "button");
        linkElement.setAttribute("target", "_blank");

        var OckoUzisActionsDivElement = document.createElement("div");
            OckoUzisActionsDivElement.setAttribute("class", "actions");
            OckoUzisActionsDivElement.appendChild(linkElement);

        var OckoUzisColumnDivElement = document.createElement("div");
            OckoUzisColumnDivElement.setAttribute("class", "oneColumn");
            OckoUzisColumnDivElement.appendChild(OckoUzisActionsDivElement);

        var PacientiCovid19Profil = document.getElementById("PacientiCovid19Profil");
            PacientiCovid19Profil.appendChild(OckoUzisColumnDivElement);
    }

    linkElement.setAttribute("href", link);
}

loadAndShowOckoUzisLastPatientActiveRequestIfExists();
loadAndSetOckoUzisPatientInformation();

if(editFormElement && TestovanyTelefonElement) {
    var OckoUzisUlozitZeZadankyColumnDivElement = document.createElement("div");
    OckoUzisUlozitZeZadankyColumnDivElement.setAttribute("class", "oneColumn");

    var OckoUzisUlozitFieldGraphicElement = document.createElement("div");
    OckoUzisUlozitFieldGraphicElement.setAttribute("class", "fieldGraphic");



    var OckoUzisUlozitZeZadankyElement = document.createElement("input");
    OckoUzisUlozitZeZadankyElement.setAttribute("type", "checkbox");
    OckoUzisUlozitZeZadankyElement.setAttribute("id", "OckoUzisUlozitZeZadanky");
    OckoUzisUlozitZeZadankyElement.setAttribute("name", "OckoUzisUlozitZeZadanky");
    OckoUzisUlozitZeZadankyElement.addEventListener("change", (event) => {
        var PacientiCovid19ProfilFieldsetElement = document.getElementById("PacientiCovid19Profil");
        if(PacientiCovid19ProfilFieldsetElement) {
            if(event.target.checked) {
                PacientiCovid19ProfilFieldsetElement.setAttribute("style", "display:none;");
            } else {
                PacientiCovid19ProfilFieldsetElement.setAttribute("style", "display:block;");
            }
        }
    });

    OckoUzisUlozitFieldGraphicElement.appendChild(OckoUzisUlozitZeZadankyElement);

    var OckoUzisUlozitZeZadankyLabelElement = document.createElement("label");
    OckoUzisUlozitZeZadankyLabelElement.setAttribute("for", "OckoUzisUlozitZeZadanky");
    OckoUzisUlozitZeZadankyLabelElement.innerHTML = " Email a telefon v profilu budou nahrazeny těmito";


    OckoUzisUlozitFieldGraphicElement.appendChild(OckoUzisUlozitZeZadankyLabelElement);
    OckoUzisUlozitZeZadankyColumnDivElement.appendChild(OckoUzisUlozitFieldGraphicElement);

    TestovanyTelefonElement.parentNode.parentNode.parentNode.insertBefore(OckoUzisUlozitZeZadankyColumnDivElement, TestovanyTelefonElement.parentNode.parentNode.nextSibling);
}


const CisloElement = document.getElementById("Cislo");
const getCertifikatElementId = "link_registr_cud_overeni_getcertifikat_cislo_" + CisloElement;
var getCertifikatLinkElement = document.getElementById(getCertifikatElementId);

if(
    !getCertifikatLinkElement && 
    CisloElement && 
    CisloElement.value
    ) {

    getCertifikatLinkElement = document.createElement("a");
 
    getCertifikatLinkElement.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid");
    getCertifikatLinkElement.setAttribute("id", getCertifikatElementId);
    getCertifikatLinkElement.setAttribute("href", getRegistrCUDOvereniGetCertifikatPage(CisloElement.value));
    getCertifikatLinkElement.text = "Stáhnout certifikát";
    getCertifikatLinkElement.setAttribute("role", "button"); 

    document.querySelector("div.actions").appendChild(getCertifikatLinkElement);
}

function vyhledaniPacienta(cisloZadanky) {

    chrome.runtime.sendMessage({
        "text": "GetZadankaData",
        "data": {
            "Cislo": cisloZadanky
        }
    }, function (data) {
        if(data) {
            createVyhledaniPacientaForm(
                data.TestovanyJmeno,
                data.TestovanyPrijmeni,
                data.TestovanyDatumNarozeniText,
                data.TestovanyNarodnostKod,
                data.TestovanyCisloPojistence,
                true,
                function(form) {
                    actionsDiv.appendChild(form);
                    form.submit();
            });
        }
    });
}

const detailPacientaButtonElementId = "detail-pacienta-button";
var detailPacientaButtonElement = document.getElementById(detailPacientaButtonElementId);

if(
    !detailPacientaButtonElement &&
    CisloElement &&
    CisloElement.value
) {
    var detailPacientaButtonElement = document.createElement("button");
    detailPacientaButtonElement.type = "button";
    detailPacientaButtonElement.id = detailPacientaButtonElementId;
    detailPacientaButtonElement.innerText = "Detail pacienta";
    detailPacientaButtonElement.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid")
      
    detailPacientaButtonElement.addEventListener('click', function() {

        vyhledaniPacienta(CisloElement.value);

    }, false);

    document.querySelector("div.actions").appendChild(detailPacientaButtonElement);
}


var actionsDiv = document.querySelector(".actions");

var CisloLabel = document.querySelector('label[for="Zadanka_Cislo"]');
var JmenoLabel = document.querySelector('label[for="Zadanka_TestovanyJmeno"]');
var PrijmeniLabel = document.querySelector('label[for="Zadanka_TestovanyPrijmeni"]');
var CisloPojistenceLabel = document.querySelector('label[for="Zadanka_TestovanyCisloPojistence"]');
var DatumNarozeniLabel = document.querySelector('label[for="Zadanka_TestovanyDatumNarozeni"]');
var Narodnost = document.getElementById("TestovanyNarodnost");

function createZkontrolovatZadankuForm(text, id, ZadankaData, onCreateForm) {

    getRegistrCUDOvereniUrl(function(url) {

        var form = document.createElement("form");
        form.action = url;
        form.id = id;
        form.method = "POST";
        form.target = "_blank";
  
        var inputTypVyhledavani = document.createElement("input");
        inputTypVyhledavani.type = "hidden";
        inputTypVyhledavani.name = "TypVyhledavani";
        form.appendChild(inputTypVyhledavani);

        if (ZadankaData.Cislo) {
            inputTypVyhledavani.value = "Cislo";

            var inputCislo = document.createElement("input");
            inputCislo.type = "hidden";
            inputCislo.value = ZadankaData.Cislo;
            inputCislo.name = "Cislo";
            form.appendChild(inputCislo);
        } else if (ZadankaData.StatniPrislusnost == "CZ") {
            inputTypVyhledavani.value = "RC";

            var inputCisloPojistence = document.createElement("input");
            inputCisloPojistence.type = "hidden";
            inputCisloPojistence.value = ZadankaData.CisloPojistence;
            inputCisloPojistence.name = "TestovanyCisloPojistence";
            form.appendChild(inputCisloPojistence);
        } else {
            inputTypVyhledavani.value = "JmenoPrijmeniDatumNarozeni";

            var inputJmeno = document.createElement("input");
            inputJmeno.type = "hidden";
            inputJmeno.value = ZadankaData.Jmeno;
            inputJmeno.name = "TestovanyJmeno";
            form.appendChild(inputJmeno);

            var inputPrijmeni = document.createElement("input");
            inputPrijmeni.type = "hidden";
            inputPrijmeni.value = ZadankaData.Jmeno;
            inputPrijmeni.name = "TestovanyPrijmeni";
            form.appendChild(inputPrijmeni);

            var inputDatumNarozeni = document.createElement("input");
            inputDatumNarozeni.type = "hidden";
            inputDatumNarozeni.value = ZadankaData.DatumNarozeni;
            inputDatumNarozeni.name = "TestovanyDatumNarozeni";
            form.appendChild(inputDatumNarozeni);
        }

        var inputSubmit = document.createElement("button");
        inputSubmit.type = "submit";
        inputSubmit.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
        inputSubmit.innerText = text;
        form.appendChild(inputSubmit);

        onCreateForm(form);
    });
}

function createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence, withoutSubmitButton, onCreateForm, detailPacientaFormId = 'detailPacientaFormId') {

    getRegistrCUDVyhledaniPacientaUrl(function(url) {

        var form = document.getElementById(detailPacientaFormId);
        if(form) {
            form.parentNode.removeChild(form);
        }

        form = document.createElement("form");
        form.action = url;
        form.method = "POST";
        form.id = detailPacientaFormId;
        form.target = "_blank";
  
  
        var inputJmeno = document.createElement("input");
        inputJmeno.type = "hidden";
        inputJmeno.value = Jmeno;
        inputJmeno.name = "Jmeno";
        form.appendChild(inputJmeno);

        var inputPrijmeni = document.createElement("input");
        inputPrijmeni.type = "hidden";
        inputPrijmeni.value = Prijmeni;
        inputPrijmeni.name = "Prijmeni";
        form.appendChild(inputPrijmeni);

        var inputTypVyhledavani = document.createElement("input");
        inputTypVyhledavani.type = "hidden";
        inputTypVyhledavani.value = "VyhledatPacienta";
        inputTypVyhledavani.name = "DuvodVyhledani";
        form.appendChild(inputTypVyhledavani);

        var inputTypVyhledavani = document.createElement("input");
        inputTypVyhledavani.type = "hidden";
        inputTypVyhledavani.value = StatniPrislusnost == "CZ" ? "JmenoPrijmeniRC" : "CizinecJmenoPrijmeniDatumNarozniObcanstvi";
        inputTypVyhledavani.name = "TypVyhledani";
        form.appendChild(inputTypVyhledavani);

        if(StatniPrislusnost == "CZ") {
            var inputTestovanyCisloPojistence = document.createElement("input");
            inputTestovanyCisloPojistence.type = "hidden";
            inputTestovanyCisloPojistence.value = CisloPojistence;
            inputTestovanyCisloPojistence.name = "RodneCislo";
            form.appendChild(inputTestovanyCisloPojistence);
        } else {
            var inputZemeKod = document.createElement("input");
            inputZemeKod.type = "hidden";
            inputZemeKod.value = StatniPrislusnost;
            inputZemeKod.name = "ZemeKod";
            form.appendChild(inputZemeKod);

            var inputDatumNarozeni= document.createElement("input");
            inputDatumNarozeni.type = "hidden";
            inputDatumNarozeni.value = DatumNarozeni;
            inputDatumNarozeni.name = "DatumNarozeni";
            form.appendChild(inputDatumNarozeni);
        }

        if(!withoutSubmitButton) {
            var submit = document.createElement("button");
            submit.name = "_submit";
            submit.type = "submit";
            submit.setAttribute("class", "button-action ui-button ui-corner-all ui-widget")
            submit.value = "None";
            submit.innerHTML  = "Detail pacienta";
            form.appendChild(submit);
        }

        onCreateForm(form);
    });
}

if(
    JmenoLabel && JmenoLabel.nextElementSibling.innerText &&
    PrijmeniLabel && PrijmeniLabel.nextElementSibling.innerText &&
    CisloPojistenceLabel && CisloPojistenceLabel.nextElementSibling.innerText &&
    Narodnost && Narodnost.value &&
    ((Narodnost.value == "CZ" && CisloPojistenceLabel && CisloPojistenceLabel.nextElementSibling.innerText) ||
    (Narodnost.value != "CZ" && DatumNarozeniLabel && DatumNarozeniLabel.nextElementSibling.innerText)) &&
    actionsDiv
    ) {
        var Jmeno = JmenoLabel.nextElementSibling.innerText;
        var Prijmeni = PrijmeniLabel.nextElementSibling.innerText;
        var CisloPojistence = CisloPojistenceLabel.nextElementSibling.innerText;
        var DatumNarozeni = DatumNarozeniLabel.nextElementSibling.innerText;
        var StatniPrislusnost = Narodnost.value;

        createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence, false, function(form) {
            actionsDiv.appendChild(form);
        });
}

var JmenoLabelDetailProfilu = document.querySelector('label[for="Pacient_Jmeno"]');
var PrijmeniLabelDetailProfilu = document.querySelector('label[for="Pacient_Prijmeni"]');
var CisloPojistenceDetailProfilu = document.querySelector('label[for="Pacient_CisloPojistence"]');

var accordionZadankyActions = document.querySelector('#accordionZadanky > div > .actions');

const vyhledatMojeZadankyLinkElementId = "vyhledat-moje-zadanky";
var vyhledatMojeZadankyLinkElement = document.getElementById(vyhledatMojeZadankyLinkElementId);

if(
    !vyhledatMojeZadankyLinkElement &&
    JmenoLabelDetailProfilu && JmenoLabelDetailProfilu.nextElementSibling.innerText &&
    PrijmeniLabelDetailProfilu && PrijmeniLabelDetailProfilu.nextElementSibling.innerText &&
    CisloPojistenceDetailProfilu && CisloPojistenceDetailProfilu.nextElementSibling.innerText &&
    accordionZadankyActions
) {
    var Jmeno = JmenoLabelDetailProfilu.nextElementSibling.innerText;
    var Prijmeni = PrijmeniLabelDetailProfilu.nextElementSibling.innerText;
    var CisloPojistence = CisloPojistenceDetailProfilu.nextElementSibling.innerText;

    var urlParams = getRegistrCUDZadankyMojeZadankyUrlParams(Jmeno, Prijmeni, CisloPojistence);  
    var url = getRegistrCUDZadankyMojeZadankyPage() + "?" + urlParams.toString();

    vyhledatMojeZadankyLinkElement = document.createElement("a");
    vyhledatMojeZadankyLinkElement.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid");
    vyhledatMojeZadankyLinkElement.setAttribute("id", vyhledatMojeZadankyLinkElementId);
    vyhledatMojeZadankyLinkElement.setAttribute("href", url);
    vyhledatMojeZadankyLinkElement.text = "Vyhledat moje žádanky";
    vyhledatMojeZadankyLinkElement.setAttribute("role", "button");

    accordionZadankyActions.appendChild(vyhledatMojeZadankyLinkElement);
}

var ZadankaCisloElement = document.querySelector('label[for="Zadanka_Cislo"]');
var ZadankaProvedenOdber = document.getElementById('Zadanka_ProvedenOdber');
var IsZadankaDetail = window.location.href.includes("/Detail/");

if(
    IsZadankaDetail &&
    ZadankaCisloElement && ZadankaCisloElement.nextElementSibling.innerText && 
    ZadankaProvedenOdber && ZadankaProvedenOdber.checked
    ) {

        const IdZadanky = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        const StornoButtonElementId = "link_registr_cudzadanky_mojezadanky_storno_" + IdZadanky;
        var StornoButtonElement = document.getElementById(StornoButtonElementId);

        if(!StornoButtonElement) {
            StornoButtonElement = document.createElement("button");
            StornoButtonElement.innerHTML = "Zrušení žádanky";
            StornoButtonElement.setAttribute("id", StornoButtonElementId);
            StornoButtonElement.setAttribute("class", "dialog-action button-other ui-button ui-corner-all ui-widget");

            var actions = document.querySelector('.actions');
            actions.appendChild(StornoButtonElement);

            StornoButtonElement.addEventListener('click', function() {

                if(
                    (ZadankaProvedenOdber && ZadankaProvedenOdber.checked) ||
                    (ProvedenOdberElement && ProvedenOdberElement.checked)
                ) {
                    chrome.runtime.sendMessage({
                        "text": "ZrusitProvedenOdber",
                        "data": {
                            "Cislo": IdZadanky
                        }
                    }, function (resultEdit) {

                        if(resultEdit) {

                            var confirmZrušit = window.confirm("Opravdu chcete zrušit žádanku?");
                            if (confirmZrušit == true) {

                                chrome.runtime.sendMessage({
                                    "text": "StornoZadanka",
                                    "data": {
                                        "Cislo": IdZadanky
                                    }
                                }, function (stornoZadanka) {
                                    if(stornoZadanka) {
                                        window.location.href = getRegistrCUDZadankyMojeZadankyPage();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        );
    }
}

const detailZadankyZadankyTestuCovid19ButtonId = "detail-zadanky-zadanky-testu-covid-19";
var detailZadankyZadankyTestuCovid19Button = document.getElementById(detailZadankyZadankyTestuCovid19ButtonId);

if(
    !detailZadankyZadankyTestuCovid19Button &&
    CisloLabel && CisloLabel.nextElementSibling.innerText &&
    formActionsElement
  ) {

    var Cislo = CisloLabel.nextElementSibling.innerText;

    detailZadankyZadankyTestuCovid19Button = document.createElement("button");
    detailZadankyZadankyTestuCovid19Button.setAttribute("id", "detail-zadanky-zadanky-testu-covid-19");
    detailZadankyZadankyTestuCovid19Button.innerText = "Detail žádanky na Žádanky testů COVID-19";
    detailZadankyZadankyTestuCovid19Button.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")

    detailZadankyZadankyTestuCovid19Button.addEventListener('click', function() {
        getRegistrCUDOvereniDetailCisloUrl(Cislo, function(url) {
            window.open(url);
        });
    }, false);
    
    formActionsElement.appendChild(detailZadankyZadankyTestuCovid19Button);
}




const KontaktniUdajeElement = Array.from(document.querySelectorAll('th')).find(el => el.textContent.includes('Kontaktní údaje'));
const printDiv = document.getElementById("printDiv");

if(
    printDiv &&
    KontaktniUdajeElement &&
    CisloElement && CisloElement.value
) {

    chrome.runtime.sendMessage({
        "text": "GetZadankaData",
        "data": {
            "Cislo": CisloElement.value,
        }
    }, function(ZadankaData) {

        if(!ZadankaData) {
            return;
        }

        const Jmeno = ZadankaData.TestovanyJmeno;
        const Prijmeni = ZadankaData.TestovanyPrijmeni;
        const StatniPrislusnost = ZadankaData.TestovanyNarodnostKod;
        const CisloPojistence = ZadankaData.TestovanyCisloPojistence;
        const Telefon = ZadankaData.TestovanyTelefon;
        const Email = ZadankaData.TestovanyEmail;

        chrome.runtime.sendMessage({
            "text": "GetPatientDetail",
            "data": {
                "Jmeno": Jmeno,
                "Prijmeni": Prijmeni,
                "StatniPrislusnost": StatniPrislusnost,
                "CisloPojistence": CisloPojistence
            }
        }, function(response) {
            var PatientInfo = getPatientInfoFromPatientDetail(response.url, response.text);

            if(PatientInfo && PatientInfo.Cislo) {
                var tableElement = document.createElement("table");
                tableElement.setAttribute("class", "zadanka");
                tableElement.setAttribute("style", "width: 100%;");

                var tbodyElement = document.createElement("tbody");
                tableElement.appendChild(tbodyElement);

                var trHeaderElement = document.createElement("tr");
                var thHeaderElement = document.createElement("th");
                thHeaderElement.setAttribute("colspan", 2);
                thHeaderElement.innerText = "Údaje na profilu / Profile information";
                trHeaderElement.appendChild(thHeaderElement);
                tableElement.appendChild(trHeaderElement);

                var trTelefonElement = document.createElement("tr");
                var tdTelefonElement =  document.createElement("td");
                tdTelefonElement.setAttribute("style", "width: 30%;");
                tdTelefonElement.innerText = "Telefon / Telephone";
                trTelefonElement.appendChild(tdTelefonElement);
                var tdTelefon2Element =  document.createElement("td");
                tdTelefon2Element.innerText = PatientInfo.Telefon;
                trTelefonElement.appendChild(tdTelefon2Element);
                tableElement.appendChild(trTelefonElement);

                var trEmailElement = document.createElement("tr");
                var tdEmailElement =  document.createElement("td");
                tdEmailElement.setAttribute("style", "width: 30%;");
                tdEmailElement.innerText = "E-mail / E-mail address";
                trEmailElement.appendChild(tdEmailElement);
                var tdEmail2Element =  document.createElement("td");
                tdEmail2Element.innerText = PatientInfo.Email;
                trEmailElement.appendChild(tdEmail2Element);
                tableElement.appendChild(trEmailElement);

                printDiv.insertBefore(tableElement, KontaktniUdajeElement.parentNode.parentNode.parentNode.nextSibling);
                printDiv.insertBefore(document.createElement("br"), tableElement);

                var trUlozitNaProfil = document.createElement("tr");

                var buttonTd = document.createElement("td");

                var button = document.createElement("button");
                button.setAttribute("id", "UlozitPrihlasovaciUdajeNaProfil");
                button.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid");
                button.setAttribute("type", "button");
                button.innerHTML = "Uložit na profil";

                var setOckoUzisTelefonEmailDivElement = document.createElement("div");
                setOckoUzisTelefonEmailDivElement.setAttribute("style", "padding: 0.65em; display: table-row; border: 0;");
                setOckoUzisTelefonEmailDivElement.appendChild(button);

                button.addEventListener('click', function() {
                    chrome.runtime.sendMessage({
                        "text": "setOckoUzisTelefonEmail",
                        "data": {
                            "EditLink": PatientInfo.EditLink,
                            "Telefon": Telefon,
                            "Email": Email
                        }
                    }, function() {
                        var resultElementId = "UlozitPrihlasovaciUdajeNaProfilResult";
                        var resultElement = document.getElementById(resultElementId);
                        if(!resultElement) {
                            resultElement = document.createElement("span");
                            resultElement.setAttribute("style", "font-weight: bold; display: table-cell; vertical-align: middle; padding-left: 5px;");
                            resultElement.setAttribute("id", resultElementId);
                            resultElement.innerHTML = "Uloženo";
                            setOckoUzisTelefonEmailDivElement.appendChild(resultElement);
                        }
                    });
                }, false);

                buttonTd.appendChild(setOckoUzisTelefonEmailDivElement);

                trUlozitNaProfil.appendChild(document.createElement("td"));
                trUlozitNaProfil.appendChild(buttonTd);

                KontaktniUdajeElement.parentNode.parentNode.appendChild(trUlozitNaProfil);
            }
        });
    });
}

var JmenoLabelDetailProfilu = document.querySelector('label[for="Pacient_Jmeno"]');
var PrijmeniLabelDetailProfilu = document.querySelector('label[for="Pacient_Prijmeni"]');
var CisloPojistenceDetailProfilu = document.querySelector('label[for="Pacient_CisloPojistence"]');
var DatumNarozeniDetailProfilu = document.querySelector('label[for="PacientDatumNarozeniText"]');
var CisloPacientaDetailprofilu = document.querySelector('label[for="Pacient_CisloPacienta"]');
var StatniPrislusnostDetailProfilu = document.querySelector('label[for="Pacient_RobObcanstviZemeKod"');
var StatniPrislusnostKodDetailProfilu = document.querySelector('label[for="Pacient_NarodnostKod"');
var EditLinkDetailProfilu = document.querySelector('a[id^="link_registr_cudzadanky_pacientdetail_cizinec_"]');

const vyhledatPacientaVPacientiLinkElementId = "vyhledat-v-pacienti";
var vyhledatPacientaVPacientiLinkElement = document.getElementById(vyhledatPacientaVPacientiLinkElementId);

var detailPacientaActions = document.querySelector('.actions');

if(
    !vyhledatPacientaVPacientiLinkElement &&
    JmenoLabelDetailProfilu && JmenoLabelDetailProfilu.nextElementSibling.innerText &&
    PrijmeniLabelDetailProfilu && PrijmeniLabelDetailProfilu.nextElementSibling.innerText &&
    DatumNarozeniDetailProfilu && DatumNarozeniDetailProfilu.nextElementSibling.innerText &&
    detailPacientaActions
) {
    var Jmeno = JmenoLabelDetailProfilu.nextElementSibling.innerText;
    var Prijmeni = PrijmeniLabelDetailProfilu.nextElementSibling.innerText;
    var DatumNarozeni = DatumNarozeniDetailProfilu.nextElementSibling.innerText;

    var url = getRegistrCUDZadankyVyhledaniPacientaPrehledVsechPage();
    var urlParams = getRegistrCUDZadankyVyhledaniPacientaPrehledVsechUrlParams(Jmeno, Prijmeni, DatumNarozeni);  
    var vyhledatPacientaVPacientiLink = url + "?" + urlParams.toString();

    vyhledatPacientaVPacientiLinkElement = document.createElement("a");
    vyhledatPacientaVPacientiLinkElement.setAttribute("class", "button-action ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only valid");
    vyhledatPacientaVPacientiLinkElement.setAttribute("id", vyhledatPacientaVPacientiLinkElementId);
    vyhledatPacientaVPacientiLinkElement.setAttribute("href", vyhledatPacientaVPacientiLink);
    vyhledatPacientaVPacientiLinkElement.text = "Vyhledat pacienta";
    vyhledatPacientaVPacientiLinkElement.setAttribute("role", "button");

    detailPacientaActions.appendChild(vyhledatPacientaVPacientiLinkElement);
}

const VyrobcePoctTestuKodElement = document.getElementById("VyrobcePoctTestuKod");
const VyrobcePoctTestuKodTitleElement = document.getElementById("VyrobcePoctTestuKod_Title");

if(VyrobcePoctTestuKodElement && VyrobcePoctTestuKodTitleElement) {
    chrome.runtime.sendMessage({
        "text": "GetAGVyrobceTestu"
    }, function (PoctTestVyrobce) {
        if(
            PoctTestVyrobce && 
            PoctTestVyrobce.kod &&
            PoctTestVyrobce.title
        ) {
            VyrobcePoctTestuKodElement.value = PoctTestVyrobce.kod;
            VyrobcePoctTestuKodTitleElement.value = PoctTestVyrobce.title; 
        }
    });
}

const VysledkyPoctAntigenElement = document.getElementById("VysledkyPoct_Antigen");

if(VysledkyPoctAntigenElement) {
    VysledkyPoctAntigenElement.value = "N";
}

const robAdresaHtmlElement = document.getElementById("robAdresaHtml");

if(robAdresaHtmlElement) {
    const config = { attributes: false, childList: true, subtree: false };
    const callback = function() {
        var robAdresaHtmlButton = document.querySelector("#robAdresaHtml button");
        if(robAdresaHtmlButton) {
            robAdresaHtmlButton.click();
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(robAdresaHtmlElement, config);
}