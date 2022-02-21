// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_OPTIONS_NAMESPACE = "pro-oc-options";

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
const SUBMIT_RESULT = "SubmitResult";

function setOptionsToLocalStorage(options) {
  chrome.storage.local.set({[CHROME_STORAGE_OPTIONS_NAMESPACE] : options});
}

function getOptionsFromLocalStorage(callback) {
  chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
    callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
  });
}

function getAGVyrobceTestuListFetch(url, callback) {
  fetch(url, {
    method: 'get'
  })
  .then(function (response) {
    if(response.status == 200) {
        response.text().then(function(text) {
          try {
            var json = JSON.parse(text);
            callback(json.deviceList ? json.deviceList : []);
          } catch(err) {
            callback([]);
          }
        });
    } else {
      callback([]);
    }
  })
  .catch(function (error) {
    console.log(error);
    callback([]);
  });
}

function getAGVyrobceTestuList(callback) {

  getOptionsFromLocalStorage(function(optionsURLSearchParams) {

    var options = new URLSearchParams(optionsURLSearchParams);
    var AGVyrobceListUrl = options.get(AG_VYROBCE_LIST_URL);

    if(AGVyrobceListUrl) {
      getAGVyrobceTestuListFetch(AGVyrobceListUrl, function(AGVyrobceList) {
        if(AGVyrobceList.length) {
          callback(true, AGVyrobceList);
        } else {
          getAGVyrobceTestuListFetch(chrome.runtime.getURL("assets/export.json"), function(AGVyrobceList) {
            callback(false, AGVyrobceList);
          });
        }
      });
    } else {
      getAGVyrobceTestuListFetch(chrome.runtime.getURL("assets/export.json"), function(AGVyrobceList) {
        callback(false, AGVyrobceList);
      });
    }
  });
}

function setOptionChekboxInputValueToElement(elementValue, elementName) {
  var Element = document.getElementById(elementName);
  if(Element) {
    Element.checked = elementValue;
  } else {
    console.error("Element: `" + elementName + " does not exists.");
  }
}

function setOptionTextInputValueToElement(elementValue, elementName) {
  var Element = document.getElementById(elementName);
  if(Element) {
    Element.value = elementValue;
  } else {
    console.error("Element: `" + elementName + " does not exists.");
  }
}

function setAGVyrobceTestuList(AGVyrobceTestuList, AGVyrobceTestuKodValue) {
  var AGVyrobceTestuKod = document.getElementById("AGVyrobceTestuKod");

  AGVyrobceTestuList ? AGVyrobceTestuList.forEach((AGvyrobce) => {
    AGVyrobceTestuKod.add(new Option(AGvyrobce.commercial_name + " - " + AGvyrobce.manufacturer.name, AGvyrobce.id_device), undefined);
  }) : undefined;

  if(AGVyrobceTestuKodValue) {
    AGVyrobceTestuKod.value = AGVyrobceTestuKodValue;
  } else {
    AGVyrobceTestuKod.value = "";
  }
}

function saveOptions(
  OdberneMistoKod,
  OrdinaceEmail,
  OrdinaceTelefon,
  OrdinaceICPAG,
  OrdinaceICPPCR,
  AGVyrobceTestuKod,
  AGVyrobceListUrl,
  UseTestRegisters,
  IsDisabledRedirectToPacientiCovid19,
  IsDisabledPopupAboutParamsFromPosledniZadanka,
  PCRProvedenOdber) {

  var options = new URLSearchParams();

  options.set(ODBERNE_MISTO_KOD, OdberneMistoKod);
  options.set(ORDINACE_EMAIL, OrdinaceEmail);
  options.set(ORDINACE_TELEFON, OrdinaceTelefon);
  options.set(ORDINACE_ICP_AG, OrdinaceICPAG);
  options.set(ORDINACE_ICP_PCR, OrdinaceICPPCR);
  options.set(PCR_PROVEDEN_ODBER, PCRProvedenOdber);
  options.set(USE_TEST_REGISTERS, UseTestRegisters);
  options.set(IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19, IsDisabledRedirectToPacientiCovid19);
  options.set(IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA, IsDisabledPopupAboutParamsFromPosledniZadanka);
  options.set(AG_VYROBCE_LIST_URL, AGVyrobceListUrl);

  if(AGVyrobceTestuKod) {

    // předem uložený i AG vyrobce title, aby se nemusely procházet všichni výrobci při vytahování ze storage
    getAGVyrobceTestuList(function(givenUrlWorks, AGVyrobceTestuList) {

      if(AGVyrobceTestuList && AGVyrobceTestuList.length) {

        var AGVyrobceTestu = AGVyrobceTestuList.filter(AGVyrobce => AGVyrobce.id_device == AGVyrobceTestuKod)[0];
        if(AGVyrobceTestu && AGVyrobceTestu.commercial_name && AGVyrobceTestu.manufacturer && AGVyrobceTestu.manufacturer.name) {
          var AGVyrobceTestuTitle = AGVyrobceTestu.commercial_name + " - " + AGVyrobceTestu.manufacturer.name;
          options.set(AG_VYROBCE_TESTU_TITLE, AGVyrobceTestuTitle);
        }
        options.set(AG_VYROBCE_TESTU_KOD, AGVyrobceTestuKod);
      }

      setOptionsToLocalStorage(options.toString());

      if(givenUrlWorks) {
        setSubmitResult("Uloženo v " + new Date().toString() + ". List výrobců se ze zadané URL načíst podařilo.");
      } else {
        setSubmitResult("Uloženo v " + new Date().toString() + ". List výrobců se ze zadané URL načíst nepodařilo.");
      }
    });
  } else {
    setOptionsToLocalStorage(options.toString());

    setSubmitResult("Uloženo v " + new Date().toString());
  }
}

function clearSubmitResult() {
  setSubmitResult("");
}

function setSubmitResult(text) {
  var result = document.getElementById(SUBMIT_RESULT);
  result.innerHTML = text;
}

function getOptions(callback) {
  getOptionsFromLocalStorage(function(optionsURLSearchParams) {
    var options = new URLSearchParams(optionsURLSearchParams);
    callback(options);
  });
}

const zadankaForm = document.getElementById("zadanka");
if(zadankaForm) {
  zadankaForm.addEventListener("submit", function(event) {

    event.preventDefault();

    clearSubmitResult();

    var zadankaFormData = new FormData(zadankaForm);

    var UseTestRegisters = document.getElementById(USE_TEST_REGISTERS);
    var IsDisabledRedirectToPacientiCovid19 = document.getElementById(IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19);
    var IsDisabledPopupAboutParamsFromPosledniZadanka = document.getElementById(IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA);
    var PCRProvedenOdber = document.getElementById(PCR_PROVEDEN_ODBER);

    saveOptions(
      zadankaFormData.get(ODBERNE_MISTO_KOD),
      zadankaFormData.get(ORDINACE_EMAIL),
      zadankaFormData.get(ORDINACE_TELEFON),
      zadankaFormData.get(ORDINACE_ICP_AG),
      zadankaFormData.get(ORDINACE_ICP_PCR),
      zadankaFormData.get(AG_VYROBCE_TESTU_KOD) ? zadankaFormData.get(AG_VYROBCE_TESTU_KOD) : "",
      zadankaFormData.get(AG_VYROBCE_LIST_URL),
      UseTestRegisters ? UseTestRegisters.checked : false,
      IsDisabledRedirectToPacientiCovid19 ? IsDisabledRedirectToPacientiCovid19.checked : false,
      IsDisabledPopupAboutParamsFromPosledniZadanka ? IsDisabledPopupAboutParamsFromPosledniZadanka.checked : false,
      PCRProvedenOdber ? PCRProvedenOdber.checked : false
    )
  });
}

window.onload = function() {
  getOptions(function(options) {
    setOptionTextInputValueToElement(options.get(ODBERNE_MISTO_KOD), ODBERNE_MISTO_KOD);
    setOptionTextInputValueToElement(options.get(ORDINACE_EMAIL), ORDINACE_EMAIL);
    setOptionTextInputValueToElement(options.get(ORDINACE_TELEFON), ORDINACE_TELEFON);
    setOptionTextInputValueToElement(options.get(ORDINACE_ICP_AG), ORDINACE_ICP_AG);
    setOptionTextInputValueToElement(options.get(ORDINACE_ICP_PCR), ORDINACE_ICP_PCR);
    setOptionChekboxInputValueToElement(options.get(PCR_PROVEDEN_ODBER) == "true" ? true : false, PCR_PROVEDEN_ODBER);
    setOptionChekboxInputValueToElement(options.get(USE_TEST_REGISTERS) == "true" ? true : false, USE_TEST_REGISTERS);
    setOptionChekboxInputValueToElement(options.get(IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19) == "true" ? true : false, IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19);
    setOptionChekboxInputValueToElement(options.get(IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA) == "true" ? true : false, IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA);
    getAGVyrobceTestuList(function (givenUrlWorks, AGVyrobceTestuList) {
      setAGVyrobceTestuList(AGVyrobceTestuList, options.get(AG_VYROBCE_TESTU_KOD));
    });
    setOptionTextInputValueToElement(options.get(AG_VYROBCE_LIST_URL), AG_VYROBCE_LIST_URL);
  });
};