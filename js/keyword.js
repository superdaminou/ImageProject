
var ulContextes = document.getElementById("contexteList");
var subulContextes = document.getElementById("subcontexteList");

var divImages = document.getElementById("photo");
parser=new DOMParser();
var xmlDoc=parser.parseFromString(conceptsString,"text/xml");
var xmlDocVideo=parser.parseFromString(videoString,"text/xml");


function selectContext(e) {

    if (e.target.nodeName == "LI") {
        var divsToHide = document.getElementsByClassName("weighted");

        for (var i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.display = "none";
        }   


        var cDiv = e.target.children;
        for (var i = 0; i < cDiv.length; i++) {
            cDiv[i].style.display = 'block';
        }
     
        console.log(e.target.id);
        try {
            TagCanvas.Start('myCanvas',"id" + e.target.id,
        
        {
            textFont: 'Impact,"Arial Black",sans-serif',
 textColour: '#00f',
 textHeight: 25
        });
       } catch (e) {
           console.log(e);
       }
    }
}


function pageLoaded() {
    displayContextes();
    ulContextes.addEventListener("click", function (e) { selectContext(e) });
}


function compareWeightDesc(a, b) {
    if (a.weight > b.weight)
        return -1;
    if (a.weight < b.weight)
        return 1;
    // a doit être égal à b
    return 0;
}

function displayImages(pConceptName) {

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

function displayImagesAndLoad(images){
    divImages.innerHTML = '';
    for (var j = 0; j < images.length; j++) {
       //var figure = document.createElement("figure");
        var img = document.createElement("img");
       // var figcaption = document.createElement("figcaption");
       // figcaption.appendChild(document.createTextNode(images[j].weight));
        img.src = images[j].name;
        img.className = "borderwhite";
        //figure.appendChild(img);
        //figure.appendChild(figcaption);
        divImages.appendChild(img);
    }
}



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
            aliSubList.href='javascript:void:(0);';

            var finalWeight = ConceptWeight.replace(",", ".") * 20 + "px";

            aliSubList.style.fontSize = finalWeight;

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
}



document.addEventListener('DOMContentLoaded', pageLoaded, false);
