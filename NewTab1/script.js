let delete_index = -1;
let edit_index = -1;
load_buttons();
fetchcurweatherapi();
fetchforweatherapi();
clock();

function clock() {
    setInterval(() => {
        let a = new Date();
        var min = a.getHours();

        if (min > 12) {
            min = min - 12;
        }
        if (min == 0) {
            min = 12;
        } else if (min < 10) {
            min = "0" + min;
        }

        var dd = a.getDay() - 1;
        var weekday = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];

        var mm = a.getMonth() - 1;

        var month = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ];
        document.getElementById("hour").innerHTML = min;
        min = a.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        document.getElementById("minute").innerHTML = ":" + min;
        document.getElementById("date").innerHTML = String(a.getDate()).padStart(
            2,
            "0"
        );
        document.getElementById("day").innerHTML = weekday[dd];
        document.getElementById("month").innerHTML = month[mm];
    }, 500);
}

function fetchforweatherapi() {
    let place = read_json("weatherplace");
    let base = "http://api.openweathermap.org/data/2.5/forecast?q=";
    let weatherapi = "e26b59116fb50f13ac33e82f630f04f6";
    if (weatherapi == "") {
        return NaN;
    }
    let url = base + place[0] + "&appid=" + weatherapi + "&units=metric";
    fetch(url)
        .then((response) => response.json())
        .then((data) => process_forweather_data(data))
        .catch(function(error) {
            console.log(error);
        });
}

function process_forweather_data(data) {
    let date = new Date();
    var d = date.getDay() + 1;

    var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let forcustdata = data["list"];
    var count = 0;
    let day = "";
    let list = document.getElementsByClassName("wday");
    for (var i = 7; i < 24; i += 8) {
        day = forcustdata[i];
        let temp = day["main"]["temp"];
        let icon = day["weather"][0]["icon"];
        d = d % 7;
        let wd = weekday[d];

        list[count].getElementsByClassName("forweekday")[0].innerHTML = wd;
        list[count].getElementsByClassName("foricon")[0].src =
            "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        list[count].getElementsByClassName("fortemp")[0].innerHTML = temp;
        count++;
        d++;
    }
}

function fetchcurweatherapi() {
    let place = read_json("weatherplace", ["katwa"]);
    let base = "http://api.openweathermap.org/data/2.5/weather?q=";
    let weatherapi = "e26b59116fb50f13ac33e82f630f04f6";
    if (weatherapi == "") {
        alert("weather api not available!!");
        return NaN;
    }
    let url = base + place[0] + "&appid=" + weatherapi + "&units=metric";
    fetch(url)
        .then((response) => response.json())
        .then((data) => process_curweather_data(data))
        .catch(function(error) {
            console.log(error);
        });
}

function process_curweather_data(forcustdata) {
    day = forcustdata;
    console.log("current weather data");
    let temp = day["main"]["temp"];
    let icon = day["weather"][0]["icon"];
    console.log(temp + "" + icon);
    document.getElementById("place-entry").value = read_json("weatherplace");
    document.getElementById("curtemp").innerHTML = temp;
    document.getElementById("curweather-icon").src =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}

function addPrevClass(e) {
    var target = e.target;
    if (target.getAttribute("src")) {
        // check if it is img
        var li = target.parentNode.parentNode;
        var prevLi = li.previousElementSibling;
        if (prevLi) {
            prevLi.className = "prev";
        }

        target.addEventListener(
            "mouseout",
            function() {
                prevLi.removeAttribute("class");
            },
            false
        );
    }
}
// if (window.addEventListener) {
//     document
//         .getElementById("dock")
//         .addEventListener("mouseover", addPrevClass, false);
// }

function load_buttons() {
    // document.getElementById("dock-but").innerHTML = "";
    let data = read_json();
    let dock = '<li> <img src = "plus.png"onclick = "open_prompt()" / ></li>';
    let menu = '<div class="contexticon"><i class="fa fa-flag-o flag"></i></div>';
    for (var i = data.length - 1; i >= 0; i--) {
        let link = data[i]["link"];
        let icon = data[i]["icon"];
        dock =
            "<li oncontextmenu='stack_remove(" +
            i +
            ")'><a href='" +
            link +
            " ' class='test'><img src='" +
            icon +
            "' alt=''/></a>" +
            menu +
            "</li>" +
            dock;
    }
    document.getElementById("dock-base").style.width = "600px";
    document.getElementById("dock-but").innerHTML = dock;

    if (data.length - 4 > 0) {
        for (var i = 0; i < data.length - 4; i++) {
            change_dock_width("+");
        }
    }
}

function read_json(newtabdata = "newtabdata", itemjsonarray = "") {
    if (localStorage.getItem(newtabdata) == null) {
        if (itemjsonarray == "") {
            itemjsonarray = [{
                    icon: "https://api.faviconkit.com/github.com/356",
                    link: "https://github.com",
                },
                {
                    icon: "https://api.faviconkit.com/youtube.com/356",
                    link: "https://youtube.com",
                },
                {
                    icon: "https://api.faviconkit.com/google.com/356",
                    link: "https://google.com",
                },
            ];
        }
        localStorage.setItem(newtabdata, JSON.stringify(itemjsonarray));
        return itemjsonarray;
    } else {
        itemjsonarraystr = localStorage.getItem(newtabdata);
        itemjsonarray = JSON.parse(itemjsonarraystr);
        return itemjsonarray;
    }
}

function write_json(data, newtabdata = "newtabdata") {
    localStorage.setItem(newtabdata, JSON.stringify(data));
}

function open_prompt() {
    document.getElementById("promt").style.right = "20px";
}

function close_prompt() {
    document.getElementById("promt").style.right = "-300px";
}

function add_button() {
    newdata = packing_data();
    mydata = read_json();
    if (mydata.length >= 8) {
        mydata.pop();
    }
    mydata.push(newdata);
    write_json(mydata);

    load_buttons();
    document.getElementById("dock-base").style.width;
}

function packing_data() {
    let url = document.getElementById("entry_url").value;
    // console.log("send  " + url);
    let domain = url.split("/")[2].replace("www.", "");
    let data = {};
    data["icon"] = "https://api.faviconkit.com/" + domain + "/356";
    data["link"] = url;
    document.getElementById("entry_url").value = "";
    return data;
}

function stack_remove(i) {
    delete_index = i;
    edit_index = i;
}

function remove_button() {
    if (delete_index != -1) {
        let data = read_json();
        data.splice(delete_index, 1);
        write_json(data);

        load_buttons();
    }
}

function edit_button() {
    if (edit_index != -1) {
        console.log(edit_index);
        open_edit();
    }
}

function open_edit() {
    let data = read_json();
    document.getElementById("edit_url").value = data[edit_index].link;
    document.getElementById("edit-promt").style.right = "20px";
}

function close_edit() {
    document.getElementById("edit-promt").style.right = "-300px";
}

function packing_edit_data() {
    let url = document.getElementById("edit_url").value;
    // console.log("send  " + url);
    let domain = url.split("/")[2].replace("www.", "");
    let data = {};
    data["icon"] = "https://api.faviconkit.com/" + domain + "/356";
    data["link"] = url;
    document.getElementById("edit_url").value = "";
    return data;
}

function update_button() {
    if (edit_index != -1) {
        let data = read_json();
        // data[edit_index] = packing_data();

        data[edit_index].link = document.getElementById("edit_url").value;
        console.log(data[edit_index]);
        write_json(data);
        // console.log(document.getElementById("edit_url").value);
        load_buttons();
    }
}

function change_dock_width(indicator) {
    if (indicator == "+") {
        let w = document.getElementById("dock-base").offsetWidth + 70;
        document.getElementById("dock-base").style.width = w + "px";
    } else if (indicator == "-") {
        let w = document.getElementById("dock-base").offsetWidth - 70;
        document.getElementById("dock-base").style.width = w + "px";
    }
}

function toggle_forweather(cmd) {
    document.getElementById("forweather").style.height = cmd;
}

function updateplace(ele) {
    write_json([ele.value], "weatherplace");
    console.log("changed to" + read_json("weatherplace"));
    fetchcurweatherapi();
    fetchforweatherapi();
}