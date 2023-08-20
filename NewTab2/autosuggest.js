let userval = "";
const options = {
  protocols: [
    'http',
    'https',
    'ftp'
  ],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  disallow_auth: false
}

function auto_suggest(ele) {
  let q = ele.value;
  if (ele.value.length < 1) {
    document.getElementById("inputbar").style.borderBottomLeftRadius = "20px";
    document.getElementById("inputbar").style.borderBottomRightRadius = "20px";
    document.getElementById("suggetion-box").innerHTML = "";
  } else {
    currentfocus = -1;
    console.log(q);
    userval = q;
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
  Object.keys(params).forEach(function (key) {
    url += "&" + key + "=" + params[key];
  });

  // console.log("fetched for " + query);

  fetch(url)
    .then((response) => response.json())
    .then((data) => formatsuggetions(data, query))
    .catch(function (error) {
      console.log("can't fetch ! check connection");
      console.log(error);
      document.getElementById("suggetion-box").innerHTML = "";
    });
}

function fetchsuggestions_ddg(query) {
  // var suggestURL = `https://www.google.com/complete/search?client=firefox&q=${query}`;
  var suggestURL = `https://api.duckduckgo.com/?q=${query}&format=json`;
  let headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  fetch(suggestURL, {
    mode: "no-cors",
  })
    .then((response) => console.log(response))
    .then((response) => response.json())
    .then((data) => {
      // formatsuggetions(data)
      console.log(data);
    })
    .catch(function (error) {
      console.log("can't fetch ! check connection");
      console.log(error);
      document.getElementById("suggetion-box").innerHTML = "";
    });
}

function formatsuggetions(data, query) {
  data = data.query.search;
  let str = "";
  let suggLimit = 5;
  let box = document.getElementById("suggetion-box");



  if (document.getElementById("searchbar").value == "") {
    return;
  }
  box.innerHTML = "";

  if (validator.isURL(query, options) || isValidURL(query)) {
    let searchUrlReq = `
    <li class="suggests" onclick="add_sugg_to_searchbar(this)">
      <i class="fa fa-globe"></i>
      <p class="sugg-val" style="color:#0095ff;" data-isurl=1>${query}</p>
      <i class='fa fa-arrow-right open-link'></i>
    </li>`;
    console.log(query + " : valid url");
    str += searchUrlReq;
    suggLimit--;

  }

  let strongmatchedSites = populerSites.filter((site) => {
    return site["rootDomain"].startsWith(query);
  })


  let strongmatch = strongmatchedSites.length;
  if (strongmatchedSites.length > suggLimit) {
    strongmatch = suggLimit;
  }
  for (let i = 0; i < strongmatch; i++) {
    let searchUrlReq = `
    <li class="suggests" onclick="add_sugg_to_searchbar(this)">
      <i class="fa fa-globe"></i>
      <p class="sugg-val" style="color:#0095ff;" data-isurl=1>https://${strongmatchedSites[i]["rootDomain"]}</p>
      <i class='fa fa-arrow-right open-link'></i>
    </li>`;
    console.log(query + " : valid url");
    str += searchUrlReq;
    suggLimit--;
  }

  let weakmatchedSites = populerSites.filter((site) => {
    return site["rootDomain"].includes(query) && !site["rootDomain"].startsWith(query);
  })

  console.log(strongmatch);
  console.log(weakmatchedSites);

  let weakmatch = weakmatchedSites.length;
  if (weakmatchedSites.length > suggLimit) {
    weakmatch = suggLimit;
  }
  for (let i = 0; i < weakmatch; i++) {
    let searchUrlReq = `
    <li class="suggests" onclick="add_sugg_to_searchbar(this)">
      <i class="fa fa-globe"></i>
      <p class="sugg-val" style="color:#0095ff;" data-isurl=1>https://${weakmatchedSites[i]["rootDomain"]}</p>
      <i class='fa fa-arrow-right open-link'></i>
    </li>`;
    console.log(query + " : valid url");
    str += searchUrlReq;
    suggLimit--;
  }


  for (var i = 0; i < suggLimit; i++) {
    str =
      str +
      '<li class="suggests" onclick="add_sugg_to_searchbar(this)"><i class="fa fa-search"></i><p class="sugg-val">' +
      data[i].title +
      "</p><i class='fa fa-arrow-right open-link'></i></li>";
  }
  box.innerHTML = str;

  document.getElementById("inputbar").style.borderBottomLeftRadius = "0px";
  document.getElementById("inputbar").style.borderBottomRightRadius = "0px";
}

if (document.getElementById("searchbar").value == "") {
  document.getElementById("suggetion-box").innerHTML = "";
}
document
  .getElementById("searchbar")
  .addEventListener("keyup", function (event) {
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
      } else if (currentfocus == 4) {
        currentfocus = 0;
        suggests_scroll();
      }
    }
    // Number 38 is the "up arrow" key on the keyboard
    if (event.keyCode === 38) {
      event.preventDefault();
      if (currentfocus > 0) {
        currentfocus--;
        suggests_scroll();
      } else if (currentfocus == 0) {
        currentfocus = -1;
        suggests_scroll();
      }
    }
  });

function replaceURL(event, searchEngine = "google") {
  let ele = document.getElementById("searchbar");
  // console.log(ele.value);

  // location.replace("www.google.com/search?q=" + ele.value);
  if (validator.isURL(ele.value, options) || isValidURL(ele.value)) {
    let url = ele.value;
    if (!url.includes("http") && !url.includes("localhost:") && !url.includes("mailto")) {
      url = "https://" + ele.value;
    }

    // console.log(url);
    location.href = url
    return;
  }
  if (ele.value != "") {
    let val = ele.value;
    ele.value = "";

    location.href = generateSearchUrl(searchEngine, val)
  }
}

function add_sugg_to_searchbar(item) {
  document.getElementById("searchbar").value =
    item.getElementsByClassName("sugg-val")[0].innerHTML;
  replaceURL();
}

document
  .getElementById("searchbar")
  .addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
  });
var currentfocus = -1;

function suggests_scroll() {
  let elements = document.getElementsByClassName("suggests");
  for (var i = 0; i < 5; i++) {
    elements[i].style.background = "white";
    elements[i].style.color = "rgb(139, 139, 139";
  }
  if (currentfocus != -1) {
    elements[currentfocus].style.color = "rgb(94, 94, 94)";
    elements[currentfocus].style.background = "rgb(202, 202, 202)";
    let elem = document.getElementsByClassName("suggests");
    document.getElementById("searchbar").value =
      elem[currentfocus].getElementsByClassName("sugg-val")[0].innerHTML;
  }
  if (currentfocus == -1) {
    document.getElementById("searchbar").value = userval;
  }
}

function setsuggest() {
  let searchEngine = "google" // google/bing/ddg
  let elements = document.getElementsByClassName("suggests");
  document.getElementById("searchbar").value =
    elements[currentfocus].getElementsByClassName("sugg-val")[0].innerHTML;
  currentfocus = -1;
  replaceURL(searchEngine);
}



function isValidURL(u) {
  //A precaution/solution for the problem written in the ***note***
  var elm;
  if (u !== "") {
    if (!elm) {
      elm = document.createElement('input');
      elm.setAttribute('type', 'url');
    }
    elm.value = u;
    return elm.validity.valid;
  }
  else {
    return false
  }
}

function generateSearchUrl(searchEngine, query) {
  let knownSearchEngine = {
    "google": `https://www.google.com/search?q=${query}`,
    "bing": `https://www.bing.com/search?q=${query}`,
    "ddg": `https://duckduckgo.com/?q=${query}`
  }

  return knownSearchEngine[searchEngine];
}