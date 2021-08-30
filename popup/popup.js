const ZadankaToPacientiCovid19Button = document.getElementById("ZadankaToPacientiCovid19");

function getRegistrDomain() {
    return "eregpublicsecure.ksrzis.cz";
}
  
function getRegistrUrl() {
    return "https://" + getRegistrDomain();
}

function getEregRegistrDomain() {
    return "ereg.ksrzis.cz";
}

function getEregRegistrUrl() {
    return "https://" + getEregRegistrDomain();
} 

function getRegistrZadankaUrl() {
    return getRegistrUrl() + "/Registr/CUD/Zadanka";
}

function getRegistrZadankaOdberneMistoPage() {
    return "/Registr/CUD/Zadanka/OdberneMisto";
}

function getRegistrZadankaOdberneMistoUrl() {
    return getRegistrUrl() + getRegistrZadankaOdberneMistoPage();
}

function getEregRegistrCUDzadankyZadankaPage() {
    return "/Registr/CUDZadanky/Zadanka";
}

function getEregRegistrCUDzadankyZadankaUrl() {
    return getEregRegistrUrl() + getEregRegistrCUDzadankyZadankaPage();
}

if (ZadankaToPacientiCovid19Button) {
    ZadankaToPacientiCovid19Button.onclick = function() {

        chrome.tabs.getSelected(null, function(tab) {

            var url = new URL(tab.url);

            if(
                url.origin == getRegistrUrl() &&
                (
                    url.pathname == getRegistrZadankaOdberneMistoPage() ||
                    url.pathname == getEregRegistrCUDzadankyZadankaPage()
                )
                ) {
                    var pacientiCovid19ZadankaUrl = getEregRegistrCUDzadankyZadankaUrl();

                    var newUrl = pacientiCovid19ZadankaUrl + url.search;

                    chrome.tabs.update({url: newUrl});
            }
        });
    }
  }