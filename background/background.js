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
  
  
function loadOckoUzisPatientCredentials(zadanka, callback) {

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
            var labels = responseDocument.getElementsByTagName('label');
            for (var i = 0; i < labels.length; i++) {
            switch(labels[i].htmlFor) {
                case 'Pacient_Telefon':
                    results.Telefon = labels[i].nextElementSibling.innerText.trim();
                    break;
                case 'Pacient_Email':
                    results.Email = labels[i].nextElementSibling.innerText.trim();
                }
            }
            results.EditLink = xhr.responseURL.replace("Index", "Edit");
  
            callback(results);
        }
    }
    xhr.send(urlParams.toString());
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'OckoUzisPatientCredentials') {
        loadOckoUzisPatientCredentials(msg.data, Credentials => {
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
    }
});