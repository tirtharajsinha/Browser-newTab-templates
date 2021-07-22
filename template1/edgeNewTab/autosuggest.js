function auto_suggest(ele) {
    let q = ele.value;
    if (ele.value.length < 1) {
        document.getElementById("searchbar").style.borderBottomLeftRadius = "30px";
        document.getElementById("searchbar").style.borderBottomRightRadius = "30px";
        document.getElementById("suggetion-box").innerHTML = "";
    } else {
        currentfocus = -1;
        console.log(q);
        fetchsuggestions(q);
    }
    if (ele.value.length < 2) {
        document.getElementById("suggetion-box").innerHTML = "";
        q = "";
    }
}

function fetchsuggestions(query) {
    if (document.getElementById("searchbar").value.length < 2) {
        return NaN;
    }
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        list: "search",
        srsearch: query,
        format: "json",
        srlimit: 5,
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + params[key];
    });

    // console.log("fetched for " + query);

    fetch(url)
        .then((response) => response.json())
        .then((data) => formatsuggetions(data))
        .catch(function(error) {
            console.log("can't fetch ! check connection");
            document.getElementById("suggetion-box").innerHTML = "";
        });
}

function formatsuggetions(data) {
    data = data.query.search;
    let str = "";
    let box = document.getElementById("suggetion-box");
    box.innerHTML = "";
    for (var i = 0; i < 5; i++) {
        str =
            '<li class="suggests" onclick="add_sugg_to_searchbar(this)"> ' +
            data[i].title +
            "</li>" +
            str;
    }
    box.innerHTML = str;

    document.getElementById("searchbar").style.borderBottomLeftRadius = "0px";
    document.getElementById("searchbar").style.borderBottomRightRadius = "0px";
}

if (document.getElementById("searchbar").value == "") {
    document.getElementById("suggetion-box").innerHTML = "";
}
document
    .getElementById("searchbar")
    .addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13 && currentfocus == -1) {
            event.preventDefault();
            replaceURL();
            // auto_suggest();
        }
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13 && currentfocus >= 0) {
            event.preventDefault();
            setsuggest();
        }
        // // Number 40 is the "down arrow" key on the keyboard
        if (event.keyCode === 40) {
            event.preventDefault();
            if (currentfocus < 4) {
                currentfocus++;
                suggests_scroll();
            }
        }
        // Number 38 is the "up arrow" key on the keyboard
        if (event.keyCode === 38) {
            event.preventDefault();
            if (currentfocus > 0) {
                currentfocus--;
                suggests_scroll();
            }
        }
    });

function replaceURL(event) {
    let ele = document.getElementById("searchbar");
    // location.replace("www.google.com/search?q=" + ele.value);
    if (ele.value != "") {
        let val = ele.value;
        ele.value = "";
        location.href = "https://www.google.com/search?q=" + val;
    }
}

function add_sugg_to_searchbar(item) {
    document.getElementById("searchbar").value = item.innerHTML;
}

document
    .getElementById("searchbar")
    .addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
    });
var currentfocus = -1;

function suggests_scroll() {
    let elements = document.getElementsByClassName("suggests");
    for (var i = 0; i < 5; i++) {
        elements[i].style.background = "white";
        elements[i].style.color = "rgb(139, 139, 139";
    }
    elements[currentfocus].style.background = "rgb(202, 202, 202)";
    elements[currentfocus].style.color = "rgb(94, 94, 94)";
}

function setsuggest() {
    let elements = document.getElementsByClassName("suggests");
    document.getElementById("searchbar").value = elements[currentfocus].innerHTML;
    currentfocus = -1;
    replaceURL();
}