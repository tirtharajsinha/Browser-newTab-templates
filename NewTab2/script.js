let delete_index = -1;
let edit_index = -1;
let walltime = 0;
let current_fevi = "";
const dock_icon_limit=11;
load_buttons();
fetchcurweatherapi();
fetchforweatherapi();
clock();

function clock() {
  setInterval(() => {
    if (walltime == 4500) {
      // change_wallpaper();
    }
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

    var dd = a.getDay();
    // console.log("date=" + dd);
    var weekday = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    var mm = a.getMonth();

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
    walltime += 500;
  }, 500);
}

function change_wallpaper() {
  document.getElementById("wrapped-bg").src = "wallpapers/win11-static.jpg";
}
function fetchforweatherapi() {
  let place = read_json("weatherplace");
  let base = "http://api.openweathermap.org/data/2.5/forecast?q=";
  let weatherapi = api_keys["weather"]["key"];
  if (weatherapi == "") {
    return NaN;
  }
  let url = base + place[0] + "&appid=" + weatherapi + "&units=metric";
  fetch(url)
    .then((response) => response.json())
    .then((data) => process_forweather_data(data))
    .catch(function (error) {
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
  let weatherapi = api_keys["weather"]["key"];
  if (weatherapi == "") {
    alert("weather api not available!!");
    return NaN;
  }
  let url = base + place[0] + "&appid=" + weatherapi + "&units=metric";
  fetch(url)
    .then((response) => response.json())
    .then((data) => process_curweather_data(data))
    .catch(function (error) {
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
      function () {
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

function get_dock_style() {
  if (localStorage.getItem("dockstyle") == null) {
    localStorage.setItem("dockstyle", "bottom-dock-alt");
    return "bottom-dock-alt";
  } else {
    return localStorage.getItem("dockstyle");
  }
}
function set_dock_style() {
  if (localStorage.getItem("dockstyle") == "bottom-dock-alt") {
    localStorage.setItem("dockstyle", "bottom-dock");
  } else {
    localStorage.setItem("dockstyle", "bottom-dock-alt");
  }
}

function load_buttons() {
  // document.getElementById("dock-but").innerHTML = "";
  let data = read_json();
  let dock =
    '<li style="animation-delay: ' +
    data.length * 0.1 +
    's;"> <img src = "plus.png"onclick = "open_prompt()"  /></li>';
  let menu = '<div class="contexticon"><i class="fa fa-flag-o flag"></i></div>';
  for (var i = data.length - 1; i >= 0; i--) {
    let link = data[i]["link"];
    let icon = data[i]["icon"];

    dock =
      "<li oncontextmenu='stack_remove(" +
      i +
      ")' style='animation-delay: " +
      0.1 * i +
      "s;'><a href='" +
      link +
      " ' class='test'><img src='" +
      icon +
      "' alt='[]'/></a>" +
      menu +
      "</li>" +
      dock;
  }
  document.getElementById("dock").classList.add(get_dock_style());
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
      itemjsonarray = [
        {
          icon: "https://github.com/favicon.ico",
          link: "https://github.com/tirtharajsinha",
        },
        {
          icon: "https://api.faviconkit.com/youtube.com/356",
          link: "https://youtube.com",
        },
        {
          icon: "https://besticon.herokuapp.com/icon?size=80..120..200&url=drive.google.com",
          link: "https://google.com",
        },
        {
          icon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
          link: "https://mail.google.com/mail/u/0/#inbox",
        },
        {
          icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png",
          link: "https://drive.google.com/drive/my-drive",
        },
        {
          icon: "https://besticon.herokuapp.com/icon?size=80..120..200&url=instagram.com",
          link: "https://instagram.com",
        },
        {
          icon: "https://tirtharajsinha.github.io/favicon.png",
          link: "https://tirtharajsinha.github.io/",
        },
        {
          icon: "https://www.herokucdn.com/favicons/favicon.ico",
          link: "https://www.heroku.com/",
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
  if (mydata.length >= dock_icon_limit) {
    mydata.pop();
  }
  mydata.push(newdata);
  write_json(mydata);
  close_prompt();
  load_buttons();
  document.getElementById("dock-base").style.width;
}

function packing_data() {
  let url = document.getElementById("entry_url").value;
  let icon = document.getElementById("icon_url").value;
  // console.log("send  " + url);
  let domain = url.split("/")[2].replace("www.", "");
  let data = {};
  if (icon == "") {
    data["icon"] =
      "https://besticon.herokuapp.com/icon?size=80..120..200&url=" + domain;
  } else {
    data["icon"] = icon;
  }

  data["link"] = url;
  document.getElementById("entry_url").value = "";
  document.getElementById("icon_url").value = "";
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
function Open_in_newtab() {
  if (delete_index != -1) {
    let data = read_json();
    let url = data[edit_index]["link"];
    window.open(url, "_blank");
  }
}
function toggle_dock() {
  set_dock_style();
  document.getElementById("dock").classList.toggle("bottom-dock-alt");
  document.getElementById("dock").classList.toggle("bottom-dock");
  load_buttons();
}

function open_edit() {
  let data = read_json();
  document.getElementById("edit_url").value = data[edit_index].link;
  document.getElementById("edit_icon_url").value = data[edit_index].icon;
  document.getElementById("edit-promt").style.right = "20px";
}

function close_edit() {
  document.getElementById("edit-promt").style.right = "-300px";
}

function packing_edit_data(data) {
  let url = document.getElementById("edit_url").value;
  let icon = document.getElementById("edit_icon_url").value;
  // console.log("send  " + url);
  let domain = url.split("/")[2].replace("www.", "");

  data["link"] = url;
  if (icon == "") {
    data["icon"] =
      "https://besticon.herokuapp.com/icon?size=80..120..200&url=" + domain;
  } else {
    data["icon"] = icon;
  }
  document.getElementById("edit_url").value = "";
  document.getElementById("edit_icon_url").value = "";
  return data;
}

function update_button() {
  if (edit_index != -1) {
    let data = read_json();
    // data[edit_index] = packing_data();

    data[edit_index] = packing_edit_data(data[edit_index]);
    write_json(data);
    // console.log(document.getElementById("edit_url").value);
    close_edit();
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
