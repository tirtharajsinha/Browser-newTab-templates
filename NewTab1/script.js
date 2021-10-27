let delete_index = -1;
let edit_index = -1;
let walltime = 0;
let newsList = [];
var newscurser = 0;
let loaded_news = false;
const delay = 10000; // anti-rebound for 500ms
let lastExecution = 0;

load_buttons();
fetchcurweatherapi();
fetchforweatherapi();
touchleft();

document.getElementById("widget").addEventListener("scroll", function (e) {
  var element = e.target;
  if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
    console.log(
      "scrolled to end",
      element.scrollHeight - element.scrollTop,
      element.clientHeight
    );
    // preventing to call load_news() to call more than one in 5s
    if (lastExecution + delay < Date.now()) {
      // execute my lines
      load_news();
      lastExecution = Date.now();
    } else {
      console.log(
        "calling too often....time remaining for next call : ",
        (lastExecution + delay - Date.now()) / 1000,
        " s"
      );
    }
  }
  // console.log("scrolling...");
  // console.log(element.scrollHeight - element.scrollTop, element.clientHeight);
});

clock();

function clock() {
  setInterval(() => {
    if (walltime == 4500) {
      change_wallpaper();
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
  let weatherapi = "e26b59116fb50f13ac33e82f630f04f6";
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
  let weatherapi = "e26b59116fb50f13ac33e82f630f04f6";
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
      "' alt='[]'/></a>" +
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
      itemjsonarray = [
        {
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
  close_prompt();
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

// widget controler
var widget_state = false;
function touchleft() {
  document.addEventListener("mousemove", function (event) {
    if (event.clientX >= window.innerWidth - 1) {
      console.log("out from left");
      widget_control(1);
    }
  });
  document
    .getElementById("wrap-all")
    .addEventListener("click", function (event) {
      if (widget_state) {
        widget_control(0);
      }
    });
}

function widget_control(action) {
  if (action == 1) {
    widget_state = true;
    if (loaded_news == false) {
      loaded_news = true;
      fetchheadlinesnews();
      fetchtopicwisenews();
    }
    document.getElementById("widget").style.transform = "translateX(0px)";

    document.getElementById("c-close").style.display = "flex";
  } else {
    document.getElementById("widget").style.transform = "translateX(500px)";
    document.getElementById("c-close").style.display = "none";
    widget_state = false;
  }
}

function fetchheadlinesnews() {
  let base =
    "https://quartziferous-wool.000webhostapp.com/newsdata/newsapi.php?type=top&query=";
  let add_ons = "country=in@apiKey=";
  let newsapi = "2fbfbc294434437e8818f71739b32d00";
  if (newsapi == "") {
    alert("weather api not available!!");
    return NaN;
  }
  let url = base + add_ons + newsapi;
  fetch(url)
    .then((response) => response.json())
    .then((data) => process_news_data(data))
    .catch(function (error) {
      console.log(error);
    });
}
function fetchtopicwisenews() {
  let topics = [
    "programming",
    "technology",
    "football",
    "cricket",
    "sports",
    "celebrity",
    "psg",
    "messi",
  ];
  // topics.join("%20OR%20")
  let base =
    "https://quartziferous-wool.000webhostapp.com/newsdata/newsapi.php?type=every&query=";

  let add_ons = "q=" + topics.join("%20OR%20") + "@pageSize=50@apiKey=";
  let newsapi = "2fbfbc294434437e8818f71739b32d00";
  if (newsapi == "") {
    alert("weather api not available!!");
    return NaN;
  }
  let url = base + add_ons + newsapi;
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => process_news_data(data, true))
    .catch(function (error) {
      console.log(error);
    });
}

function process_news_data(data, ready = false) {
  newsList = newsList.concat(data["articles"]);
  newsList = shuffleArray(newsList);
  console.log(newsList.length);
  if (ready && newscurser == 0) {
    console.log("loding for first time");
    setTimeout(function () {
      load_news();
    }, 100);
  }
}

function load_news() {
  console.log(newsList.length);
  var element = document.getElementById("news").innerHTML;
  if (newscurser >= newsList.length) {
    return 0;
  }
  for (var i = newscurser; i < newscurser + 10; i++) {
    // console.log(newsList[i]["title"]);
    if (i < newsList.length && newsList[i]["urlToImage"] != null) {
      let title = newsList[i]["title"];
      let url = newsList[i]["url"];
      let imageurl = newsList[i]["urlToImage"];
      element += newsBlock(title, url, imageurl);
    }

    // console.log(i);
  }
  document.getElementById("news").innerHTML = element;
  console.log("load range : " + newscurser, " -> " + (newscurser + 10));
  newscurser = newscurser + 10;
}

function newsBlock(Title, url, imageurl) {
  let domain = url.split("/")[2].replace("www.", "");
  let block = `
  <div class="news-block">
                <a href="${url}">
                    <img src="${imageurl}" alt="">
                    <p class="news-title">${Title}</p>
                </a>
                <div class="source">
                    <a href="${domain}">${domain}</a>
                    <div class="react">
                        <i class="fa fa-heart-o"></i>
                        <i class="fa fa-share-alt"></i>
                        <i class="fa fa-bookmark-o"></i>
                    </div>
                </div>
                <hr>

            </div>
  `;
  return block;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
