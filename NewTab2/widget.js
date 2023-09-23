// widget controler
var widget_state = false;
let newsList = [];
var newscurser = 0;
let loaded_news = false;
const delay = 10000; // anti-rebound for 500ms
let lastExecution = 0;
let load_permission = false;

touchleft();

if (typeof api_keys === "undefined") {
  console.log("api keys not found! You can't use features which uses api");
  let api_formation = {
    weather: {
      key: "api from openweathermap.org",
    },
    news: {
      key: "api from newsapi.org",
    },
    sports: {
      key: "",
    },
  };

  console.log(
    "instruction : create api_key.js and make a dict varible called api_key and write in below formation"
  );
  console.log(api_formation);
}

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

function enable_news(ele) {
  if (ele.checked) {
    document.getElementById("checkstate").innerHTML = "Disable News widget";

    document.getElementById("checkstate").style.color = "#cacaca";
    load_permission = true;
    fetcher();
  } else {
    document.getElementById("checkstate").innerHTML = "Enable News widget";
    document.getElementById("checkstate").style.color = "#0dda4a";
  }
}
function touchleft() {
  // document.addEventListener("mousemove", function (event) {
  //   if (event.clientX >= window.innerWidth - 1) {
  //     console.log("out from left");
  //     widget_control(1);
  //   }
  // });
  document
    .getElementById("wrap-all")
    .addEventListener("click", function (event) {
      if (widget_state) {
        widget_control(0);
      }
    });
}

function widget_control(action, ele) {
  if (action == 1) {
    widget_state = true;

    if (loaded_news == false && load_permission) {
      fetcher();
    }
    document.getElementById("widget").style.transform = "translateX(0px)";

    document.getElementById("c-open").style.display = "none";
    document.getElementById("download-image").style.display = "none";

    document.querySelector(".wallbtn").style.display = "none";
  } else {
    document.getElementById("widget").style.transform = "translateX(500px)";
    document.getElementById("c-open").style.display = "flex";
    if (isDownloadBtnEnabled) {
      document.getElementById("download-image").style.display = "flex";
    }

    document.querySelector(".wallbtn").style.display = "flex";
    widget_state = false;
  }
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function fetcher() {
  if (loaded_news == false && load_permission) {
    loaded_news = true;
    fetchheadlinesnews();
    fetchtopicwisenews();
  }
}

function fetchheadlinesnews() {
  let base =
    "https://quartziferous-wool.000webhostapp.com/newsdata/newsapi.php?type=top&query=";
  let add_ons = "country=in@apiKey=";
  let newsapi = api_keys["news"]["key"];

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
  if (load_permission == false) {
    return 0;
  }
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
                <a href="${url}" target="_blank">
                    <img src="${imageurl}" alt="">
                    <p class="news-title">${Title}</p>
                </a>
                <div class="source">
                    <a href="${domain}" target="_blank">${domain}</a>
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
