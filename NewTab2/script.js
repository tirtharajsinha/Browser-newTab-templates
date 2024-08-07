
let delete_index = -1;
let edit_index = -1;
let walltime = 0;
let current_fevi = "";
const dock_icon_limit = 100;
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
  let base = "http://api.openweathermap.org/data/2.5/forecast/?q=";
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
  let dateday = date.getDate();

  var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let forcustdata = data["list"];
  var count = 0;
  let day = "";
  let list = document.getElementsByClassName("wday");
  for (var i = 0; i < forcustdata.length; i++) {
    day = forcustdata[i];
    let fordate = new Date(day.dt * 1000);
    // console.log(fordate);
    if (fordate.getDate() == dateday) {
      continue;
    }
    if (count == 3) {
      break;
    }
    let temp = Number((day["main"]["temp"]).toFixed(0));
    let icon = day["weather"][0]["icon"];

    let wd = weekday[fordate.getDay()];

    list[count].getElementsByClassName("forweekday")[0].innerHTML = wd;
    list[count].getElementsByClassName("foricon")[0].src =
      "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    list[count].getElementsByClassName("fortemp")[0].innerHTML = temp;
    count++;
    dateday = fordate.getDate();
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
    .then((data) => process_curweather_data(data, place[0]))
    .catch(function (error) {
      console.log(error);
    });
}

function process_curweather_data(forcustdata, curcity) {
  day = forcustdata;
  console.log("current weather data");
  let temp = Number((day["main"]["temp"]).toFixed(0));
  let icon = day["weather"][0]["icon"];
  console.log(temp + "" + icon);
  // var curcity = read_json("weatherplace");
  document.getElementById("place-entry").value = curcity;
  document.getElementById("curcity").innerHTML = "in " + curcity;
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
  // let dock =
  //   '<li style="animation-delay: ' +
  //   data.length * 0.1 +
  //   's;"> <img src = "plus.png"onclick = "open_prompt()"  /></li>';
  dock = "";

  for (var i = data.length - 1; i >= 0; i--) {
    let link = data[i]["link"];
    let icon = data[i]["icon"];
    let name = data[i]["name"]
    if (name == undefined) {
      name = "title";
    }
    let menu = `<div class="contexticon" 
    style="
      background:url('${icon}');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;">
        <div>${name}</div>
    </div>`;


    dock =
      "<li class='dock-elements' oncontextmenu='stack_remove(" +
      i +
      ")' style='animation-delay: " +
      0.1 * 0 +
      `s;' data-id=${i}><a onclick='iconclick("${link}","${icon}")' class='test'><img src='` +
      icon +
      "' alt='[]'/></a>" +
      menu +
      "</li>" +
      dock;
  }
  document.getElementById("dock").classList.add(get_dock_style());
  document.getElementById("dock-base").style.width = "600px";
  document.getElementById("dock-items").innerHTML = dock;

  if (data.length - 4 > 0) {
    for (var i = 0; i < data.length - 4; i++) {
      change_dock_width("+");
    }
  }
}

function iconclick(url, icon) {
  window.location = url;
}
function read_json(newtabdata = "newtabdata", itemjsonarray = "", rawdata = false) {
  if (localStorage.getItem(newtabdata) == null) {

    if (itemjsonarray == "") {
      itemjsonarray = tabdockdata;
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
  let name = document.getElementById("icon_name").value;
  let base;

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
  data["name"] = name;
  // data["base"]=base;
  // toDataUrl(icon, function(myBase64) {
  //   base=myBase64;
  // });
  // console.log(base);
  document.getElementById("entry_url").value = "";
  document.getElementById("icon_url").value = "";
  document.getElementById("icon_name").value = "";
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
function copy_path() {
  if (delete_index != -1) {
    let data = read_json();
    let url = data[edit_index]["link"];
    navigator.clipboard.writeText(url);

  }

}

function save_shortcuts() {
  let itemjsonarraystr = localStorage.getItem("newtabdata");
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(itemjsonarraystr));
  element.setAttribute('download', "_backup_newtab_shortcut_data.json");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
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
  if (data[edit_index].name != undefined) {
    document.getElementById("edit_icon_name").value = data[edit_index].name;
  }

  document.getElementById("edit-promt").style.right = "20px";
}

function close_edit() {
  document.getElementById("edit-promt").style.right = "-300px";
}

function packing_edit_data(data) {
  let url = document.getElementById("edit_url").value;
  let icon = document.getElementById("edit_icon_url").value;
  let name = document.getElementById("edit_icon_name").value;
  console.log("send  " + name);
  let domain = url.split("/")[2].replace("www.", "");
  let base;


  data["link"] = url;
  data["name"] = name;
  if (icon == "") {
    data["icon"] =
      "https://besticon.herokuapp.com/icon?size=80..120..200&url=" + domain;
  } else {
    data["icon"] = icon;
  }
  // base = getBase64FromUrl(icon);
  // console.log(base);

  // data["base"]=base;
  document.getElementById("edit_url").value = "";
  document.getElementById("edit_icon_url").value = "";
  document.getElementById("edit_icon_name").value = "";
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

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    }
  });
}