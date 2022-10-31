function firstFunc(callback){
    console.log("first function working")
    callback();
}

function secondFunc(){
    firstFunc(function(){
        console.log("second function done")
    })
}

secondFunc();


function firstFunc(callback){
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
    var city = parsed[num]["city"];
    var lat = parsed[num]["lat"]
    var lng = parsed[num]["lng"]
    map.setView([lat, lng], 4);
    marker.setLatLng([lat, lng])
    callback();
}

function secondFunc(){
    firstFunc(function(){
        alert("test")
    })
}