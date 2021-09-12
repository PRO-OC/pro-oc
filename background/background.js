function getEregRegistrDomain() {
    return "ereg.ksrzis.cz";
}

function getEregRegistrUrl() {
    return "https://" + getEregRegistrDomain();
}

function getRegistrCUDZadankyMojeZadankyEditaceUrlParams(ProvedenOdber) {
    var urlParams = new URLSearchParams();
    urlParams.set("ProvedenOdber", ProvedenOdber);
    return urlParams;
}

function getRegistrCUDZadankyMojeZadankyEditaceUrl(CisloZadanky) {
    return getEregRegistrUrl() + "/Registr/CUDZadanky/MojeZadanky/Editace/" + CisloZadanky;
}

function getRegistrCUDVyhledaniPacientaUrl() {
    return getEregRegistrUrl() + "/Registr/CUDZadanky/VyhledaniPacienta";
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

function getRegistrCUDZadankyMojeZadankyStornoUrl(CisloZadanky) {
    return getEregRegistrUrl() + "/Registr/CUDZadanky/MojeZadanky/Storno/" + CisloZadanky;
}

function unsetProvedenOdber(Cislo, callback) {

    var urlParams = getRegistrCUDZadankyMojeZadankyEditaceUrlParams(false);
    var url = getRegistrCUDZadankyMojeZadankyEditaceUrl(Cislo);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
            callback(true);
        }
    }
    xhr.send(urlParams.toString());
}
  
function stornoZadanka(Cislo, callback) {
  
    var url = getRegistrCUDZadankyMojeZadankyStornoUrl(Cislo);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
        callback(true);
      }
    }
    xhr.send();
}
  
  
function loadOckoUzisPatientInfo(zadanka, callback) {

    var url = getRegistrCUDVyhledaniPacientaUrl();
    var urlParams = getRegistrCUDVyhledaniPacientaUrlParams(zadanka);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
  
            var parser = new DOMParser();
            var responseDocument = parser.parseFromString(xhr.responseText,"text/html");
  

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

            results.Link = xhr.responseURL;
            results.EditLink = xhr.responseURL.replace("Index", "Edit");
  
            callback(results);
        }
    }
    xhr.send(urlParams.toString());
}

function getRegistrLoginCookieName() {
  return "MyUniqueKey";
}

function getRegistrDomain() {
  return "eregpublicsecure.ksrzis.cz";
}

function getRegistrUrl() {
  return "https://" + getRegistrDomain();
}

function getRegistrCUDOvereniCisloZadankyUrl(kodOsoby, heslo, cisloZadanky) {
  var urlParams = new URLSearchParams();

  urlParams.set("PracovnikKodOsoby", kodOsoby);
  urlParams.set("heslo", heslo);
  urlParams.set("Cislo", cisloZadanky);

  return getRegistrUrl() + "/Registr/CUD/Overeni/Json" + "?" + urlParams.toString();
}

function getZadankaData(cisloZadanky, callback) {
    chrome.cookies.get({
        url: getRegistrUrl(), 
        name: getRegistrLoginCookieName()
      },
      function(cookie) {

        if(!cookie) {
          return;
        }

        var cookieParams = new URLSearchParams(cookie.value);

        var kodOsoby = cookieParams.get("kodOsoby");
        var heslo = cookieParams.get("heslo");

        var url = getRegistrCUDOvereniCisloZadankyUrl(kodOsoby, heslo, cisloZadanky);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
        xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {

            var data = JSON.parse(xhr.responseText);

            callback(data);
          }
        };
        xhr.send();
    });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'OckoUzisPatientInfo') {
        loadOckoUzisPatientInfo(msg.data, Credentials => {
            sendResponse(Credentials);
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
    } else if(msg.text === 'GetZadankaData' && msg.data.Cislo) {
        getZadankaData(msg.data.Cislo, function(result) {
            sendResponse(result);
        });
        return true;
    }
});