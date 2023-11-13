function formatMontant(m) 
{
    var intlN=new Intl.NumberFormat();
    return intlN.format(m);
}

/* Récupération des données de cours du Bitcoin */
function getCours() 
{
    /* Appel AJAX vers cryptocompare.com */
    var ajax=new XMLHttpRequest();
    console.log("readyState après new : "+ajax.readyState);
    /* Détection de l'avancement de l'appel */
    ajax.onreadystatechange=function() 
    {
        console.log("readyState a changé et vaut : "+ajax.readyState)  
    }  
    /* Détection de la fin de l'appel */
    ajax.onload = function() 
    {
        console.log("Appel AJAX terminé");
        console.log("  status : "+this.status);
        console.log("  response : "+this.response);    
        if (this.status == 200) 
        { /* Le service a bien répondu */
            try 
            {
                var json=JSON.parse(this.response); // Convertir le retour JSON
                console.log("  response parse : "+ json);
            } 
            catch(err) 
            {
            console.log("Retour JSON incorrect");  
            return false;  
            }
            /* Vérifier que le JSON de retour contient bien la propriété EUR */
            if (json.EUR) 
            {
                var eur=formatMontant(json.EUR);  
                var dt=new Date();
                document.getElementById("cours").innerHTML=eur+" &euro;";
                document.querySelector("div#horo").innerHTML="Maj "+dt.toLocaleString();
            } 
        }
        else 
        {
            console.log("Retour du cours incorrect");  
        }
    }

    /* Détection du timeout */
    ajax.ontimeout=function() 
    {
        console.log("Le service n'a pas répondu à temps : nouvel essai dans 5 sec");     
        /* Relancer l'appel 5 secondes plus tard */
        setTimeout("getCours()", 5000); 
    }
    
    /* Préparation de la requête et envoi */
    var url="https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=EUR";
    ajax.open("GET", url, true);
    ajax.timeout=1000; /* Délai d'expiration à 1 seconde */
    ajax.send();
}

/* Démarrage de l'appel */
window.onload=function() 
{
    getCours();
    setInterval("getCours()", 60000);
}