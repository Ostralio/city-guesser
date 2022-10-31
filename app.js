var parsed = []
var numCities = 0;
var numCorrect = 0;

document.getElementById("uploadBtn").addEventListener("click", () => {
    event.preventDefault();
    let uploadedFile = document.getElementById("file").files[0]
    let posOfSlash = uploadedFile.type.lastIndexOf("/");
    let fileType = uploadedFile.type.substring(posOfSlash + 1)
    if (fileType === "csv") {
        Papa.parse(uploadedFile, {
            download: true,
            header: false,
            complete: function (results, file) {
                parsed = results.data;
                console.log(parsed)
            }
        })
    } else {
        if (!file.value.length) return;
        let reader = new FileReader();
        reader.onload = logFile;
        reader.readAsText(uploadedFile);
    }
})

function logFile(event) {
    let str = event.target.result;
    parsed = JSON.parse(str);
}

var map = L.map('map').setView([37.42, -122.1], 4);
var marker = L.marker([37.42, -122.1]).addTo(map);

//Url for more leaflet maps: https://leaflet-extras.github.io/leaflet-providers/preview/

//Detailed terrain map, no labels
var stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	// attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

stamen.addTo(map);

//Default openstreetmap tile, has labels, backup in case Stamen goes down
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '© OpenStreetMap'
// }).addTo(map);

document.addEventListener('DOMContentLoaded', init, false);

function init() {

    var usedCities = [];
    var maxLength = 100;

    function getCoords() {
        var diffSelector = document.getElementById("diffSetting")
        var difficulty = diffSelector.options[diffSelector.selectedIndex].value
        var num = 0;
        while(num === 0 || usedCities.includes(num)){
            if(difficulty === "American"){
                num = Math.floor(Math.random() * 101);
                maxLength = 100;
            } else if(difficulty === "Easy"){
                num = Math.floor(Math.random() * 201);
                maxLength = 200;
            } else if(difficulty === "Medium"){
                num = Math.floor(Math.random() * 301);
                maxLength = 300;
            } else if(difficulty === "Hard"){
                num = Math.floor(Math.random() * 401);
                maxLength = 400;
            } else if(difficulty === "Insane"){
                num = Math.floor(Math.random() * 501);
                maxLength = 500;
            }
        }

        usedCities.push(num);
        if(usedCities.length === maxLength){
            alert("You done")
            usedCities = [];
            return;
        }

        var hasAccent = false;
        var alsoAccepted = "";
        var city = parsed[num]["city"];
        var accentedCharacters = "àáâãäåæèéëêìíîïòóôõöùúûüñ";
        for(let i = 0; i < city.length; i++){
            for(let j = 0; j < accentedCharacters.length; j++){
                if(city[i] === accentedCharacters[j]){
                    hasAccent = true;
                    if(j < 7){
                        alsoAccepted = city.substring(0, i) + "a" + city.substring(i+1)
                    } else if(j < 11){
                        alsoAccepted = city.substring(0, i) + "e" + city.substring(i+1)
                    } else if(j < 15){
                        alsoAccepted = city.substring(0, i) + "i" + city.substring(i+1)
                    } else if(j < 20){
                        alsoAccepted = city.substring(0, i) + "o" + city.substring(i+1)
                    } else if(j < 24){
                        alsoAccepted = city.substring(0, i) + "u" + city.substring(i+1)
                    } else if(j === 24){
                        alsoAccepted = city.substring(0, i) + "n" + city.substring(i+1)
                    }
                }
            }
        }

        var lat = parsed[num]["lat"]
        var lng = parsed[num]["lng"]
        map.setView([lat, lng], 4);
        marker.setLatLng([lat, lng])
        // marker.bindPopup(city)
        setTimeout(checkAnswer, 500);

        function checkAnswer(){
            let guess = prompt("City?")
            if(guess === city || (hasAccent && (guess === alsoAccepted))){
                alert("Correct!")
                numCorrect++;
                numCities++;
            } else{
                alert("Wrong. The correct answer is " + city)
                numCities++;
            }
            document.getElementById("score").innerHTML = numCorrect + "/" + numCities;
        }
    }
    
    document.addEventListener('keydown', getCoords, true);
};
