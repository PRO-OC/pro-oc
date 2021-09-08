var ZadankaToPacientiCovid19Button = document.getElementById("ZadankaToPacientiCovid19");

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

        if(typeof browser === 'undefined') {
            chrome.tabs.query({active: true}, function(tabs) {

                if(!tabs[0]) {
                    return;
                }
    
                var url = new URL(tabs[0].url);
    
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
        } else {
            browser.tabs.query({active: true}).then(function (tabs) {

                if(!tabs[0]) {
                    return;
                }
    
                var url = new URL(tabs[0].url);
    
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
}