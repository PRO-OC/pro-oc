// duplicated in popup.js, background.js, options.js (like inferface)
const CHROME_STORAGE_OPTIONS_NAMESPACE = "vfn-oc-extension-options";

const ODBERNE_MISTO_KOD = "OdberneMistoKod";
const ORDINACE_EMAIL = "OrdinaceEmail";
const ORDINACE_TELEFON = "OrdinaceTelefon";
const ORDINACE_ICP_AG = "OrdinaceICPAG";
const ORDINACE_ICP_PCR = "OrdinaceICPPCR";
const B2B_SERVER_URL = "B2BServerUrl";
const AG_VYROBCE_TESTU_KOD = "AGVyrobceTestuKod";
const AG_VYROBCE_TESTU_TITLE = "AGVyrobceTestuTitle";
const PCR_PROVEDEN_ODBER = "PCRProvedenOdber";
const USE_TEST_REGISTERS = "UseTestRegisters";
const IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19 = "IsDisabledRedirectToPacientiCovid19";
const IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA = "IsDisabledPopupAboutParamsFromPosledniZadanka";

const REDIRECT_ZADANKA_TO_PACIENTI_COVID_19 = "RedirectZadankaToPacientiCovid19";

const PCR_POJISTOVNA = "PCRpojistovna";
const PCR_SAMOPLATCE = "PCRsamoplatce";
const PCR_KONFIRMACNI_POJISTOVNA = "PCRkonfirmacniPojistovna";
const PCR_KONFIRMACNI_SAMOPLATCE = "PCRkonfirmacniSamoplatce";
const AG_POJISTOVNA = "AGpojistovna";
const AG_SAMOPLATCE = "AGsamoplatce";

function fixUlice(ulice) {
    if(!ulice) {
        return null;
    }
    
    var uliceTrimmed = ulice.trim();
    if(uliceTrimmed == "/") {
        return uliceTrimmed;
    }
    
    if(uliceTrimmed.endsWith("/")) {
        return uliceTrimmed.slice(0, -1);
    }

    return uliceTrimmed;
}
  
function fixTelefon(telefon) {
    if (!telefon) {
        return null;
    }
    var telefonTrimmed = telefon.trim();
    if (!telefonTrimmed.startsWith('+') && telefonTrimmed.length == 9) {
        // +420
        return '%2B%0A420' + telefonTrimmed;
    } else if (!telefonTrimmed.startsWith('+') && telefonTrimmed.length > 9) {
        // + 
        return '%2B%0A' + telefonTrimmed;
    }
    return telefonTrimmed;
}

function getOptionsFromLocalStorage(callback) {
    chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
        callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
    });
}

function getRegistrDomain(callback) {
    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
        var options = new URLSearchParams(optionsURLSearchParams);
        var useTestRegisters = options.get(USE_TEST_REGISTERS);
        callback(useTestRegisters == "true" ? "eregpublicsecure2.ksrzis.cz" : "eregpublicsecure.ksrzis.cz");
    });
}

function getEregRegistrDomain(callback) {
    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
        var options = new URLSearchParams(optionsURLSearchParams);
        var useTestRegisters = options.get(USE_TEST_REGISTERS);
        callback(useTestRegisters == "true" ? "ereg2.ksrzis.cz" : "ereg.ksrzis.cz");
    });
}

function getRegistrUrl(callback) {
    getRegistrDomain(function(registrDomain) {
        callback("https://" + registrDomain);
    });
}


function getEregRegistrUrl(callback) {
    getEregRegistrDomain(function(registrDomain) {
        callback("https://" + registrDomain);
    });
}

function getRegistrZadankaPage() {
    return "/Registr/CUD/Zadanka";
}

function getRegistrZadankaUrl(callback) {
    getRegistrUrl(function(registrUrl) {
       callback(registrUrl + getRegistrZadankaPage());
    });
}

function getRegistrZadankaOdberneMistoPage() {
    return "/Registr/CUD/Zadanka/OdberneMisto";
}

function getRegistrZadankaOdberneMistoUrl(callback) {
    getRegistrUrl(function(registrUrl) {
        callback(registrUrl + getRegistrZadankaOdberneMistoPage());
    });
}

function getEregRegistrCUDzadankyZadankaPage() {
    return "/Registr/CUDZadanky/Zadanka";
}

function getEregRegistrCUDzadankyZadankaUrl(callback) {
    getEregRegistrUrl(function(registrUrl) {
        callback(registrUrl + getEregRegistrCUDzadankyZadankaPage());
    });
}

function getEregRegistrZadankaPage() {
    return "/Registr/CUDZadanky/Zadanka";
}

function isUrlZadanka(page, origin, callback) {
    getRegistrUrl(function(registrUrl) {
        if(origin == registrUrl && (page == getRegistrZadankaOdberneMistoPage() || page == getRegistrZadankaPage())) {
            callback(true);
        } else {
            getEregRegistrUrl(function(registrUrl) {
                if(origin == registrUrl && page == getEregRegistrZadankaPage()) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }
    });
}

function redirectToPacientiCovid19() {
    getSelectedTab(function(tab) {

        if(!tab) {
            return;
        }

        var url = new URL(tab.url);

        isUrlZadanka(url.pathname, url.origin, function(result) {
            if(result) {
                getEregRegistrCUDzadankyZadankaUrl(function(pacientiCovid19ZadankaUrl) {
                    var newUrl = pacientiCovid19ZadankaUrl + url.search;
                    chrome.tabs.update({url: newUrl});
                });
            }
        });
    });
}

function getRegistrCUDZadankyMojeZadankyEditaceUrlParams(ProvedenOdber) {
    var urlParams = new URLSearchParams();
    urlParams.set("ProvedenOdber", ProvedenOdber);
    return urlParams;
}

function getRegistrCUDZadankyMojeZadankyEditaceUrl(CisloZadanky, callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/MojeZadanky/Editace/" + CisloZadanky);
    });
}

function getRegistrCUDVyhledaniPacientaUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/VyhledaniPacienta");
    });
}

function getRegistrCUDVyhledaniPacientaUrlParams(zadanka) {
    var urlParams = new URLSearchParams();
    urlParams.set("DuvodVyhledani", "VyhledatPacienta");
    urlParams.set("TypVyhledani", zadanka.StatniPrislusnost == "CZ" ? "JmenoPrijmeniRC" : "CizinecJmenoPrijmeniDatumNarozniObcanstvi");
    urlParams.set("Jmeno", zadanka.Jmeno);
    urlParams.set("Prijmeni", zadanka.Prijmeni);
    if(zadanka.StatniPrislusnost == "CZ") {
        urlParams.set("RodneCislo", zadanka.CisloPojistence);
    } else {
        urlParams.set("DatumNarozeni", zadanka.DatumNarozeni);
        urlParams.set("ZemeKod", zadanka.StatniPrislusnost);
    }
    urlParams.set("_submit", "None");
    return urlParams;
}

function getRegistrCUDZadankyMojeZadankyStornoUrl(CisloZadanky, callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/Registr/CUDZadanky/MojeZadanky/Storno/" + CisloZadanky);
    });
}

function unsetProvedenOdber(Cislo, callback) {
    getRegistrCUDZadankyMojeZadankyEditaceUrl(Cislo, function(url) {

        var urlParams = getRegistrCUDZadankyMojeZadankyEditaceUrlParams(false);

        fetch(url, {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: urlParams.toString()
        })
        .then(function (response) {
            if(response.status == 200) {
                callback(true);
            } else {
                return;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

function stornoZadanka(Cislo, callback) {
    getRegistrCUDZadankyMojeZadankyStornoUrl(Cislo, function(url) {

        fetch(url, {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: urlParams.toString()
        })
        .then(function (response) {
            if(response.status == 200) {
                callback(true);
            } else {
                return;
            }
        })
        .catch(function (error) {
              console.log(error);
        });
    });
}

function getPatientDetail(zadanka, callback) {
    getRegistrCUDVyhledaniPacientaUrl(function(url) {
        var urlParams = getRegistrCUDVyhledaniPacientaUrlParams(zadanka);

        fetch(url, {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: urlParams.toString()
        })
        .then(function(response) {
            if (response.status == 200) {
                response.text().then(function(text) {
                    callback({
                        'url': response.url,
                        'text': text
                    });
                });
            } else {
                return;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

function getRegistrLoginCookieName() {
  return "MyUniqueKey";
}

function getRegistrCUDOvereniCisloZadankyUrl(callback) {
    getRegistrUrl(function(registrUrl) {
        callback(registrUrl + "/Registr/CUD/Overeni/Json");
    });
}

function getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, zadankaData) {
    var urlParams = new URLSearchParams();

    urlParams.set("PracovnikKodOsoby", kodOsoby);
    urlParams.set("heslo", heslo);

    if(zadankaData.Cislo) {
        urlParams.set("Cislo", zadankaData.Cislo);
    } else if (zadankaData.StatniPrislusnost && zadankaData.StatniPrislusnost == "CZ") {
        urlParams.set("TestovanyCisloPojistence", zadankaData.CisloPojistence);
    } else if (zadankaData.StatniPrislusnost && zadankaData.StatniPrislusnost != "CZ") {
        urlParams.set("TestovanyJmeno", zadankaData.Jmeno);
        urlParams.set("TestovanyPrijmeni", zadankaData.Prijmeni);
        urlParams.set("TestovanyDatumNarozeni", zadankaData.DatumNarozeni);
    }

    return urlParams;
}

function getRegistrLoginCookies(callback) {
    getRegistrUrl(function(registrUrl) {
        chrome.cookies.get({
            url: registrUrl, 
            name: getRegistrLoginCookieName()
        },
        function(cookie) {
            if(!cookie) {
                callback(new URLSearchParams());
            } else {
                var cookieParams = new URLSearchParams(cookie.value);
                callback(cookieParams);
            }
        });
    });
}

function getZadankaData(zadankaData, callback) {

    getRegistrLoginCookies(function(cookieParams) {

        var kodOsoby = cookieParams.get("kodOsoby");
        var heslo = cookieParams.get("heslo");
    
        if(!kodOsoby || !heslo) {
          return;
        }

        getRegistrCUDOvereniCisloZadankyUrl(function(url) {

            var urlParams = getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, zadankaData);

            fetch(url + "?" + urlParams.toString(), {
                method: 'get',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(function (response) {
                if(response.status == 200) {
                    response.json().then(function(json) {
                        callback(json);
                    });
                } else {
                    return;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    });
}


function getRegistrCUDZadankyPacientDetailEditUrlParams(Telefon, Email) {
    var urlParams = new URLSearchParams();
    urlParams.set("Pacient.Telefon", Telefon);
    urlParams.set("Pacient.Email", Email);
    return urlParams;
}

function setOckoUzisTelefonEmail(OckoUzisEditLink, Telefon, Email, callback) {
    var url = OckoUzisEditLink;

    var urlParams = getRegistrCUDZadankyPacientDetailEditUrlParams(Telefon, Email);

    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "text/xml"
        },
        body: urlParams.toString()
    })
    .then(function (response) {
        if(response.status == 200) {
            callback();
        } else {
            return;
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'GetPatientDetail') {
        getPatientDetail(msg.data, response => {
            sendResponse(response);
        });
        return true;
    } else if(msg.text === 'ZrusitProvedenOdber' && msg.data.Cislo) {
        unsetProvedenOdber(msg.data.Cislo, function(result) {
            sendResponse(result);
        });
        return true;
    } else if(msg.text === 'StornoZadanka' && msg.data.Cislo) {
        stornoZadanka(msg.data.Cislo, function(result) {
            sendResponse(result);
        });
        return true;
    } else if(msg.text === 'GetZadankaData' && msg.data) {
        getZadankaData(msg.data, function(result) {
            sendResponse(result);
        });
        return true;
    } else if (msg.text === 'setOckoUzisTelefonEmail' && msg.data.EditLink && msg.data.Telefon && msg.data.Email) {
        setOckoUzisTelefonEmail(
          msg.data.EditLink, 
          msg.data.Telefon, 
          msg.data.Email,
          function() {
            sendResponse(true);
          }
        );
        return true;
    } else if(msg.text === 'getFromUrlPacientId') {
        getSelectedTab(function(tab) {
    
            if(!tab) {
                sendResponse(null);
            }

            var url = tab.url;

            var pacientId = undefined;
            var urlParams = new URLSearchParams(url);
                
            if(urlParams.has("id")) {
                pacientId = urlParams.get("id");
            } else {
                pacientId = url.split("/").pop();
            }
            sendResponse(pacientId);
        });
        return true;
    } else if (msg.text === 'DuplikatyPacienta' && msg.data.Jmeno && msg.data.Prijmeni && msg.data.DatumNarozeni) {

        data1 = msg.data;
        data1.DatumNarozeni = "01" + msg.data.DatumNarozeni.substring(msg.data.DatumNarozeni.indexOf("."), msg.data.DatumNarozeni.length);

        loadOckoUzisPatientInfo(msg.data, function(PacientInfo) {
          sendResponse(PacientInfo);
        });
        return true;
    } else if (msg.text == "GetAGVyrobceTestu") {
        loadVyrobcePoctTestuKodATitle(AGVyrobceTestu => {
            sendResponse(AGVyrobceTestu);
        });
        return true;
    } else if (msg.text == "GetOptionValue" && msg.name) {
        getOptionsFromLocalStorage(function(optionsURLSearchParams) {
            var options = new URLSearchParams(optionsURLSearchParams);
            var value = options.get(msg.name);
            sendResponse(value);
        });
        return true;
    } else if (msg.text == REDIRECT_ZADANKA_TO_PACIENTI_COVID_19) {
        redirectToPacientiCovid19();
    } else if (msg.text == PCR_POJISTOVNA) {
        updateZadankaPCRpojistovna();
    } else if (msg.text == PCR_SAMOPLATCE) {
        updateZadankaPCRsamoplatce();
    } else if (msg.text == PCR_KONFIRMACNI_POJISTOVNA) {
        updateZadankaPCRkonfirmacniPojistovna();
    } else if (msg.text == PCR_KONFIRMACNI_SAMOPLATCE) {
        updateZadankaPCRkonfirmacniSamoplatce();
    } else if (msg.text == AG_POJISTOVNA) {
        updateZadankaAGpojistovna();
    } else if (msg.text == AG_SAMOPLATCE) {
        updateZadankaAGsamoplatce();
    }
});

function getSelectedTab(callback) {
    if(typeof browser === 'undefined') {
        chrome.tabs.query({active: true}, function(tabs) {
            callback(tabs[0]);
        });
    } else {
        browser.tabs.query({active: true}).then(function (tabs) {
            callback(tabs[0]);
        });
    }
}

function getOptionsFromLocalStorage(callback) {
    chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
        callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
    });
}

function getOptionsFromLocalStorage(callback) {
    chrome.storage.local.get([CHROME_STORAGE_OPTIONS_NAMESPACE], function(data) {
        callback(data[CHROME_STORAGE_OPTIONS_NAMESPACE]);
    });
}

function loadVyrobcePoctTestuKodATitle(callback) {

    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
  
        var options = new URLSearchParams(optionsURLSearchParams);
  
        var AGVyrobceTestuKod = options.get(AG_VYROBCE_TESTU_KOD);
        var AGVyrobceTestuTitle = options.get(AG_VYROBCE_TESTU_TITLE);

        callback({"kod": AGVyrobceTestuKod, "title": AGVyrobceTestuTitle});
    });
}

function updateZadankaPCRpojistovna() {

    getSelectedTab(function(tab) {

        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }

            var urlParams = new URLSearchParams(url.search);

            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", urlParams.get("ZdravotniPojistovnaKod"));
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "3");
            newUrlParams.set("TypyTestu", "PCR");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));

            updateZadanka(tab, newUrlParams);
        });
    });
}

function updateZadankaPCRsamoplatce() {

    getSelectedTab(function(tab) {
  
        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }
  
            var urlParams = new URLSearchParams(url.search);
  
            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", "300");
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "3");
            newUrlParams.set("TypyTestu", "PCR");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));
  
            updateZadanka(tab, newUrlParams);
        });
    });
}

function updateZadankaPCRkonfirmacniPojistovna() {

    getSelectedTab(function(tab) {
  
        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }
  
            var urlParams = new URLSearchParams(url.search);
  
            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", urlParams.get("ZdravotniPojistovnaKod"));
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "5");
            newUrlParams.set("TypyTestu", "PCR");
            newUrlParams.set("ProvedenOdber", "False");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));
  
            updateZadanka(tab, newUrlParams);
        });
    });
}

function updateZadankaPCRkonfirmacniSamoplatce() {

    getSelectedTab(function(tab) {
  
        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }
  
            var urlParams = new URLSearchParams(url.search);
  
            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", "300");
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "5");
            newUrlParams.set("TypyTestu", "PCR");
            newUrlParams.set("ProvedenOdber", "False");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));
  
            updateZadanka(tab, newUrlParams);
        });
    });
}
  
function updateZadankaAGpojistovna() {

    getSelectedTab(function(tab) {
  
        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }
  
            var urlParams = new URLSearchParams(url.search);
  
            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", urlParams.get("ZdravotniPojistovnaKod"));
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "3");
            newUrlParams.set("TypyTestu", "Antigen");
            newUrlParams.set("ProvedenOdber", "False");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));

            updateZadanka(tab, newUrlParams);
        });
    });
}
  
function updateZadankaAGsamoplatce() {

    getSelectedTab(function(tab) {
      
        var url = new URL(tab.url);

        isUrlRegistrZadanka(url, function(isUrlRegistrZadanka) {

            if(!isUrlRegistrZadanka) {
                return;
            }

            var urlParams = new URLSearchParams(url.search);
      
            var newUrlParams = new URLSearchParams;
            newUrlParams.set("TestovanyJmeno", urlParams.get("TestovanyJmeno"));
            newUrlParams.set("TestovanyPrijmeni", urlParams.get("TestovanyPrijmeni"));
            newUrlParams.set("TestovanyCisloPojistence", urlParams.get("TestovanyCisloPojistence"));
            newUrlParams.set("TestovanyNarodnost", urlParams.get("TestovanyNarodnost"));
            newUrlParams.set("ZdravotniPojistovnaKod", "300");
            newUrlParams.set("TestovanyDatumNarozeni", urlParams.get("TestovanyDatumNarozeni"));
            newUrlParams.set("TestovanyUlice", fixUlice(urlParams.get("TestovanyUlice")));
            newUrlParams.set("TestovanyMesto", urlParams.get("TestovanyMesto"));
            newUrlParams.set("TestovanyPSC", urlParams.get("TestovanyPSC"));
            newUrlParams.set("TestovanyTelefon", fixTelefon(urlParams.get("TestovanyTelefon")));
            newUrlParams.set("TestovanyEmail", urlParams.get("TestovanyEmail"));
            newUrlParams.set("RizikovePovolaniKod", urlParams.get("RizikovePovolaniKod") ? urlParams.get("RizikovePovolaniKod") : "Jine");
            newUrlParams.set("TypPoctTestu", "1");
            newUrlParams.set("SymptomZadne", "True");
            newUrlParams.set("KlinickyZavaznyStav", "False");
            newUrlParams.set("Indikace", "3");
            newUrlParams.set("TypyTestu", "Antigen");
            newUrlParams.set("ProvedenOdber", "False");
            newUrlParams.set("OrdinaceVystavil", urlParams.get("OrdinaceVystavil"));
  
            updateZadanka(tab, newUrlParams);
        });
    });
}

function cleanUrlParams(urlParams) {
    var paramKeysToDelete = [];
    for (let [key, value] of urlParams.entries()) {
        if (
            value === "null" ||
            value === undefined ||
            value === null
        ) {
            paramKeysToDelete.push(key);
        }
    }
    paramKeysToDelete.forEach(k => {
        urlParams.delete(k);
    });

    return urlParams;
}

function getEregRegistrDefaultPageUrl(callback) {
    getEregRegistrUrl(function(eregRegistrUrl) {
        callback(eregRegistrUrl + "/JTP/cms/Stranky/default.aspx");
    });
}

function isEregKsrzisSignedIn(callback) {
    getEregRegistrDefaultPageUrl(function(url) {
        fetch(url, {
            method: 'get'
        })
        .then(function (response) {
            if(response.status == 200) {
                callback(true);
            } else {
				callback(false);
			}
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

function getRegistrLoginCookieName() {
    return "MyUniqueKey";
}

function getRegistrLoginCookies(callback) {
    getRegistrUrl(function(registrUrl) {
        chrome.cookies.get({
            url: registrUrl, 
            name: getRegistrLoginCookieName()
        },
        function(cookie) {
            if(!cookie) {
                callback(new URLSearchParams());
            } else {
                var cookieParams = new URLSearchParams(cookie.value);
                callback(cookieParams);
            }
        });
    });
}

function getRegistrCUDOvereniCisloPojistenceUrlParams(kodOsoby, heslo, cisloPojistence) {
    var urlParams = new URLSearchParams();
    urlParams.set("PracovnikKodOsoby", kodOsoby);
    urlParams.set("heslo", heslo);
    urlParams.set("TestovanyCisloPojistence", cisloPojistence);
    return urlParams;
}

function setUrlParamsPosledniZadankyToUrlParams(urlParams, data) {

    if(!urlParams.has("RizikovePovolaniText") && data.RizikovePovolaniNazev && data.RizikovePovolaniNazev != 'Jiné') {
        urlParams.set("RizikovePovolaniText", data.RizikovePovolaniNazev);
    }
  
    if(!urlParams.has("TestovanyUlice") && data.TestovanyUlice) {
        urlParams.set("TestovanyUlice", fixUlice(data.TestovanyUlice));
    }
  
    if(!urlParams.has("TestovanyMesto") && data.TestovanyMesto) {
        urlParams.set("TestovanyMesto", data.TestovanyMesto);
    }
  
    if(!urlParams.has("TestovanyPSC") && data.TestovanyPsc) {
        urlParams.set("TestovanyPSC", data.TestovanyPsc);
    }
  
    return urlParams;
}

function getUrlParamsPosledniZadanky(cisloPojistence, callback) {
    var resultUrlParams = new URLSearchParams();

    if(!cisloPojistence) {
        callback(resultUrlParams);
        return;
    }

    getRegistrLoginCookies(function(cookieParams) {

        var kodOsoby = cookieParams.get("kodOsoby");
        var heslo = cookieParams.get("heslo");

        if(!kodOsoby || !heslo) {
            callback(resultUrlParams);
        } else {

            getRegistrCUDOvereniCisloZadankyUrl(function(url) {

                var urlParams = getRegistrCUDOvereniCisloPojistenceUrlParams(kodOsoby, heslo, cisloPojistence);

                fetch(url + "?" + urlParams.toString(), {
                    method: 'get',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                .then(function (response) {
                    if(response.status == 200) {
                        response.json().then(function(json) {

                            resultUrlParams = setUrlParamsPosledniZadankyToUrlParams(resultUrlParams, json);

                            if(
                                resultUrlParams.has("RizikovePovolaniKod") &&
                                resultUrlParams.has("TestovanyUlice") &&
                                resultUrlParams.has("TestovanyMesto") &&
                                resultUrlParams.has("TestovanyPSC")
                            ) {
                                callback(resultUrlParams);
                            } else if (json.Vysledek == "ExistujeViceZadanekProDaneRC") {

                                var posledniZadanka = data.ExistujiciZadanky[data.ExistujiciZadanky.length - 1];

                                getRegistrCUDOvereniCisloZadankyUrl(function(url) {
  
                                    var urlParams = getRegistrCUDOvereniCisloZadankyUrlParams(kodOsoby, heslo, posledniZadanka.Cislo);

                                    fetch(url + "?" + urlParams.toString(), {
                                        method: 'get',
                                        headers: {
                                            "Content-type": "application/json; charset=UTF-8"
                                        }
                                    })
                                    .then(function (response) {
                                        if(response.status == 200) {
                                            response.json().then(function(json) {
                                                resultUrlParams = setUrlParamsPosledniZadankyToUrlParams(resultUrlParams, json);
                                                callback(resultUrlParams);
                                            });
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                                });
                            } else {
                                callback(resultUrlParams);
                            }
                        });
                    } else {
                        return;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
        }
    });
}

function updateZadanka(tab, params) {

    params = cleanUrlParams(params);

    getRegistrLoginCookies(cookieParams => {
        if(cookieParams.get("jmeno") || cookieParams.get("prijmeni")) {
            params.set("OrdinaceVystavil", cookieParams.get("jmeno") + " " + cookieParams.get("prijmeni"));
        }

        getOptionsFromLocalStorage(function(optionsURLSearchParams) {

            var TypyTestu = params.get("TypyTestu");

            var options = new URLSearchParams(optionsURLSearchParams);
  
            var AGVyrobceTestuKod = options.get(AG_VYROBCE_TESTU_KOD);
            if(AGVyrobceTestuKod && TypyTestu == "Antigen") {
                params.set("VyrobceTestuKod", AGVyrobceTestuKod);
            }
  
            var OrdinaceICPAG = options.get(ORDINACE_ICP_AG);
            if(OrdinaceICPAG && TypyTestu == "Antigen") {
                params.set("OrdinaceICP", OrdinaceICPAG);
            }
  
            var OrdinaceICPPCR = options.get(ORDINACE_ICP_PCR);
            if(OrdinaceICPPCR && TypyTestu == "PCR") {
                params.set("OrdinaceICP", OrdinaceICPPCR);
            }

            var PCRProvedenOdber = options.get(PCR_PROVEDEN_ODBER);
            if(PCRProvedenOdber == "true" && TypyTestu == "PCR") {
                params.set("ProvedenOdber", PCRProvedenOdber);
            }
  
            var OdberneMistoKod = options.get(ODBERNE_MISTO_KOD);
            if(OdberneMistoKod) {
                params.set("OdberneMistoKod", OdberneMistoKod);
            }
  
            var OrdinaceEmail = options.get(ORDINACE_EMAIL);
            if(OrdinaceEmail) {
                params.set("OrdinaceEmail", OrdinaceEmail);
            }
  
            var OrdinaceTelefon = options.get(ORDINACE_TELEFON);
            if(OdberneMistoKod) {
                params.set("OrdinaceTelefon", OrdinaceTelefon);
            }

            var IsDisabledPopupAboutParamsFromPosledniZadanka = options.get(IS_DISABLED_POPUP_ABOUT_PARAMS_FROM_POSLEDNI_ZADANKA);

            if (IsDisabledPopupAboutParamsFromPosledniZadanka == "false") {

                getUrlParamsPosledniZadanky(params.get("TestovanyCisloPojistence"), (urlParamsPosledniZadanky) => {

                    urlParamsPosledniZadanky = cleanUrlParams(urlParamsPosledniZadanky);

                    urlParamsPosledniZadankyText = urlParamsPosledniZadanky.get("RizikovePovolaniText");

                    if(
                        params.get("RizikovePovolaniKod") == "Jine" &&
                        urlParamsPosledniZadankyText &&
                        urlParamsPosledniZadankyText != "Jine" &&
                        urlParamsPosledniZadankyText != "null" && 
                        urlParamsPosledniZadankyText != null
                    ) {
                        chrome.tabs.sendMessage(tab.id, {text: 'RizikovePovolaniText', value: urlParamsPosledniZadankyText}, function(rizikovePovolaniKod) {

                            if(rizikovePovolaniKod != params.get("RizikovePovolaniKod")) {

                                var confirmRizikovePovolani = window.confirm("Použít Rizikové povolání - kolektiv: " + urlParamsPosledniZadankyText + "? (poslední žádanka)");
                                if (confirmRizikovePovolani == true) {
                                    params.set("RizikovePovolaniKod", rizikovePovolaniKod);
                                }
                            }
                        });
                    }

                    isEregKsrzisSignedIn(function(isSignedIn) {

                        var oldUrl = new URL(tab.url);
                        var newUrl = oldUrl.origin + oldUrl.pathname;

                        var IsDisabledRedirectToPacientiCovid19 = options.get(IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19);

                        if(isSignedIn && IsDisabledRedirectToPacientiCovid19 == "false") {
                            getEregRegistrCUDzadankyZadankaUrl(function(newUrl) {
                                var newUrlParams = getUrlFromUrlSearchParamsWithoutEncoding(params);
                                chrome.tabs.update(
                                    tab.id,
                                    {
                                        url: newUrl + "?" + newUrlParams
                                    }
                                );
                            });
                        } else {
                        // adresa z poslední žádanky
                        if(
                            urlParamsPosledniZadanky.has("TestovanyUlice") &&
                            urlParamsPosledniZadanky.has("TestovanyMesto") &&
                            urlParamsPosledniZadanky.has("TestovanyPSC") &&
                            (decodeURI(params.get("TestovanyUlice")) != urlParamsPosledniZadanky.get("TestovanyUlice") ||
                            decodeURI(params.get("TestovanyMesto")) != urlParamsPosledniZadanky.get("TestovanyMesto") ||
                            params.get("TestovanyPSC") != urlParamsPosledniZadanky.get("TestovanyPSC"))
                        ) {
                            var confirmUdajeOPobytu = window.confirm("Použít Údaje o pobytu: " + urlParamsPosledniZadanky.get("TestovanyUlice") + ", " + urlParamsPosledniZadanky.get("TestovanyMesto") + ", " + urlParamsPosledniZadanky.get("TestovanyPSC") + "? (poslední žádanka)");
      
                            if (confirmUdajeOPobytu == true) {
                                params.set("TestovanyUlice", urlParamsPosledniZadanky.get("TestovanyUlice"));
                                params.set("TestovanyMesto", urlParamsPosledniZadanky.get("TestovanyMesto"));
                                params.set("TestovanyPSC", urlParamsPosledniZadanky.get("TestovanyPSC"));
                            }
                        }
                            var newUrlParams = getUrlFromUrlSearchParamsWithoutEncoding(params);
                            chrome.tabs.update(
                                tab.id,
                                {
                                    url: newUrl + "?" + newUrlParams
                                }
                            );
                        }
                    });
                })
            } else {
                isEregKsrzisSignedIn(function(isSignedIn) {

                    var oldUrl = new URL(tab.url);
                    var newUrl = oldUrl.origin + oldUrl.pathname;

                    var IsDisabledRedirectToPacientiCovid19 = options.get(IS_DISABLED_REDIRECT_TO_PACIENTI_COVID_19);

                    if(isSignedIn && IsDisabledRedirectToPacientiCovid19 == "false") {
                        getEregRegistrCUDzadankyZadankaUrl(function(newUrl) {
                            var newUrlParams = getUrlFromUrlSearchParamsWithoutEncoding(params);
                            chrome.tabs.update(
                                tab.id,
                                {
                                    url: newUrl + "?" + newUrlParams
                                }
                            );
                        });
                    } else {
                        var newUrlParams = getUrlFromUrlSearchParamsWithoutEncoding(params);
                        chrome.tabs.update(
                            tab.id,
                            {
                                url: newUrl + "?" + newUrlParams
                            }
                        );
                    }
                });
            }
        });
    });
}

function isUrlRegistrZadanka(url, callback) {
    const domain = url.hostname;
    const page = url.pathname;
  
    getRegistrDomain(function(registrDomain) {
        if(domain == registrDomain && (page == getRegistrZadankaOdberneMistoPage() || page == getRegistrZadankaPage())) {
            callback(true);
        } else {
            getEregRegistrDomain(function(eregRegistrDomain) {
                if(domain == eregRegistrDomain && page == getEregRegistrZadankaPage()) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }
    });
}

function getUrlFromUrlSearchParamsWithoutEncoding(urlParams) {
    var url = "";
    for(var pair of urlParams.entries()) {
        if(url != "") {
            url += "&";
        }
        url += pair[0] + "=" + pair[1];
    }
    
    return url;
}

chrome.commands.onCommand.addListener(function(command) {
    switch(command) {
        case PCR_POJISTOVNA:
            updateZadankaPCRpojistovna();
            break;
        case PCR_SAMOPLATCE:
            updateZadankaPCRsamoplatce();
            break;
        case PCR_KONFIRMACNI_POJISTOVNA:
            updateZadankaPCRkonfirmacniPojistovna();
            break;
        case PCR_KONFIRMACNI_SAMOPLATCE:
            updateZadankaPCRkonfirmacniSamoplatce();
            break;
        case AG_POJISTOVNA:
            updateZadankaAGpojistovna();
            break;
        case AG_SAMOPLATCE:
            updateZadankaAGsamoplatce();
            break;
        default:
    }
});