/** menu contenant les contextes */
var ulContextes = document.getElementById("contexteList");
/** menu contenant les sous thémes */
var subulContextes = document.getElementById("subcontexteList");

/** DOV contenant les images */
var divImages = document.getElementById("photo");
parser = new DOMParser();
/** Les données sont stockées dans js pour éviter le problème des cross origin request.
 * On récupére ces informations dans des objets pour utilisation future.
 */
var xmlDoc = parser.parseFromString(conceptsString, "text/xml");
var xmlDocVideo = parser.parseFromString(videoString, "text/xml");


/* Fonction exécutée lors du click sur un théme */
function selectContext(e) {
    if (e.target.nodeName == "LI") {
        /* On cache les tous les thémes */
        var divsToHide = document.getElementsByClassName("weighted");
        for (var i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.display = "none";
        }

        /* Affichage des sous thémes de l'élément choisi */
        displaySubTheme(e.target.id);

    }
}

function displaySubTheme(subtheme){
    cDivMain = document.getElementById(subtheme);
    cDiv = cDivMain.children;
    document.getElementById("h1Context").innerText=subtheme;

    for (var i = 0; i < cDiv.length; i++) {
        cDiv[i].style.display = 'block';
    }
    /* Affichage des sous thémes sous forme d'un nuage de point */
    try {
        TagCanvas.Start('myCanvas', "id" + subtheme,

            {
                textFont: 'Montserrat, sans-serif',
                textColour: getRandomColor(),
                weight: true,
                weightFrom: 'dataweight',
                weightMode: "size"
            });
    } catch (e) {
        console.log(e);
    }
    displayImages(cDiv[0].children[0].innerText);
    return cDiv[0];
}

/* Définir taille texte
function getSize(image) {
    var weight = image.getAttribute('Weight'),
    var size = 20*weight,
    return size;
}
*/

/* créer couleur aléatoire */
function getRandomColor() {
    var tabColors = ['#2980b9', '#9b59b6', '#e74c3c', '#1abc9c'];
    var i = Math.floor((Math.random() * 3) + 1);
    var color = tabColors[i];

    return color;
}

/* fonction exécutée lorsque la page est chargée. */
function pageLoaded() {
    /* Affichage des thémes */
    displayContextes();
    /* Enregistrement d'un événement click sur la liste des thémes */
    ulContextes.addEventListener("click", function (e) { selectContext(e) });
}

/* fonction de comparaison utilisée pour trier les sous thémes suivant leur poids dans un ordre décroissant */
function compareWeightDesc(a, b) {
    if (a.weight > b.weight)
        return -1;
    if (a.weight < b.weight)
        return 1;
    // a doit être égal à b
    return 0;
}

/** Sélection puis Affichage des images suivant le contexte passé en paramétre */
function displayImages(pConceptName) {
    document.getElementById("h2Theme").innerText=pConceptName;
    var images = [];
    var concepts = xmlDocVideo.childNodes[0].getElementsByTagName("concept");
    for (var j = 0; j < concepts.length; j++) {
        var concept = concepts[j];
        var conceptName = concept.getAttribute('Name');
        if (conceptName === pConceptName) {
            var imagesNodes = concept.getElementsByTagName("video");
            for (var i = 0; i < imagesNodes.length; i++) {
                var image = imagesNodes[i];

                var objectImage = { name: "key frames/" + image.getAttribute('Name') + "/" + image.getAttribute('shotrepres') + ".jpg", weight: image.getAttribute('Weight') };
                images.push(objectImage);


            }
        }
    }

    images = images.sort(compareWeightDesc);
    displayImagesAndLoad(images);
}

/** Affiche les images passée en paramètres */
function displayImagesAndLoad(images) {
    divImages.innerHTML = '';
    for (var j = 0; j < images.length; j++) {
        //var figure = document.createElement("figure");
        var img = document.createElement("img");
        var div = document.createElement("div");
        // var figcaption = document.createElement("figcaption");
        // figcaption.appendChild(document.createTextNode(images[j].weight));
        img.src = images[j].name;
        div.className = "slide"
        img.className = "borderwhite";
        //figure.appendChild(img);
        //figure.appendChild(figcaption);
        div.innerHTML = div.innerHTML + "<label style='float: right;'>weight: "+images[j].weight +"</label>";
        divImages.appendChild(div);
        div.appendChild(img)

    }
}


/** génére le menu des thémes et sous thémes */
function displayContextes() {
    var Contextes = xmlDoc.childNodes[0].getElementsByTagName("Contexte");

    for (var i = 0; i < Contextes.length; i++) {
        var Contexte = Contextes[i].getAttribute('Name');
        var ulSubList = document.createElement("ul");

        ulSubList.id = "id" + Contexte;
        ulSubList.className = 'weighted';
        ulSubList.style.display = "none";
        var concepts = Contextes[i].getElementsByTagName("concept");

        for (var j = 0; j < concepts.length; j++) {
            var ConceptWeight = concepts[j].getAttribute('Weight');
            var conceptName = concepts[j].getAttribute('ConceptName');

            var liSubList = document.createElement("li");

            var aliSubList = document.createElement("a");
            aliSubList.href = 'javascript:void:(0);';

            var finalWeight = ConceptWeight.replace(",", ".") * 100 + "px";

            aliSubList.style.fontSize = finalWeight;
            aliSubList.setAttribute("dataweight", ConceptWeight.replace(",", ".") * 40);

            aliSubList.appendChild(document.createTextNode(conceptName));
            aliSubList.addEventListener("click", function () { displayImages(this.innerText); });

            liSubList.appendChild(aliSubList);
            ulSubList.appendChild(liSubList);

        }

        var li = document.createElement("li");
        li.id = Contexte;
        li.appendChild(document.createTextNode(Contexte));
        li.append(ulSubList);



        ulContextes.appendChild(li);


    }

    displayFirst();
}

function displayFirst(){
    displayImages(displaySubTheme("Actor").children[0].innerText);
}

/** document chargé, on appel pageLoaded */
document.addEventListener('DOMContentLoaded', pageLoaded, false);
