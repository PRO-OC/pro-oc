function getEregRegistrDomain() {
    return "ereg.ksrzis.cz";
}

function getEregRegistrUrl() {
    return "https://" + getEregRegistrDomain();
}

function getRegistrCUDVyhledaniPacientaUrl() {
    return getEregRegistrUrl() + "/Registr/CUDZadanky/VyhledaniPacienta";
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

function getRegistrCUDZadankyMojeZadankyUrl() {
    return getEregRegistrUrl() + "/Registr/CUDZadanky/MojeZadanky";
}

function getRegistrCUDOvereniDetailCisloUrl(Cislo) {
    return getRegistrZadankyDomainUrl() + "/Registr/CUD/Overeni/DetailCislo?Cislo=" + Cislo;
}

function getRegistrCUDOvereniGetCertifikatUrl(Cislo) {
    return getRegistrZadankyDomainUrl() + "/Registr/CUD/Overeni/GetCertifikat?Cislo=" + Cislo;
}

function getRegistrZadankyDomain() {
    return "eregpublicsecure.ksrzis.cz";
}
  
function getRegistrZadankyDomainUrl() {
    return "https://" + getRegistrZadankyDomain();
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
}
if(TestovanyPrijmeniElement) {
    TestovanyPrijmeniElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
}
if(TestovanyCisloPojistenceElement) {
    TestovanyCisloPojistenceElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
}
if(TestovanyNarodnostElement) {
    TestovanyNarodnostElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
}
if(TestovanyDatumNarozeniElement) {
    TestovanyDatumNarozeniElement.addEventListener('input', loadAndSetOckoUzisPatientInformation);
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
            "text": "OckoUzisPatientInfo",
            "data": {
                "Jmeno": Jmeno,
                "Prijmeni": Prijmeni,
                "StatniPrislusnost": StatniPrislusnost,
                "CisloPojistence": CisloPojistence
            }
        }, function(PatientInfo) {
            if(PatientInfo.Cislo) {
                setOckoUzisPatientCredentials(PatientInfo.Telefon, PatientInfo.Email);
                setOckoUzisPatientDetailEditLink(PatientInfo.EditLink);
                setOckoUzisPatientDetailLink(PatientInfo.Link);
            } else {
                createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence);
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

loadAndSetOckoUzisPatientInformation();

if(editFormElement && TestovanyTelefon) {
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

    TestovanyTelefon.parentNode.parentNode.parentNode.insertBefore(OckoUzisUlozitZeZadankyColumnDivElement, TestovanyTelefon.parentNode.parentNode.nextSibling);
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
    getCertifikatLinkElement.setAttribute("href", getRegistrCUDOvereniGetCertifikatUrl(CisloElement.value));
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
            var form = createVyhledaniPacientaForm(
                data.TestovanyJmeno,
                data.TestovanyPrijmeni,
                data.TestovanyDatumNarozeniText,
                data.TestovanyNarodnostKod,
                data.TestovanyCisloPojistence,
                true
            );

            actionsDiv.appendChild(form);
            form.submit();
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

function createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence, withoutSubmitButton) {
    const detailPacientaFormId = "detail-pacienta-form";
    var form = document.getElementById(detailPacientaFormId);
    if(form) {
        return;
    }

    form = document.createElement("form");
    form.action = getRegistrCUDVyhledaniPacientaUrl();
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

    return form;
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

        var form = createVyhledaniPacientaForm(Jmeno, Prijmeni, DatumNarozeni, StatniPrislusnost, CisloPojistence);

        actionsDiv.appendChild(form);
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
    var url = getRegistrCUDZadankyMojeZadankyUrl() + "?" + urlParams.toString();

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
                                        window.location.href = getRegistrCUDZadankyMojeZadankyUrl();
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
        window.open(getRegistrCUDOvereniDetailCisloUrl(Cislo));
    }, false);
    
    formActionsElement.appendChild(detailZadankyZadankyTestuCovid19Button);
}