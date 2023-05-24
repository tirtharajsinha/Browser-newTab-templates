function responsiveChat(element) {
  $(element).html(
    `<form class="chat"><span></span>
    <div class="messages"></div>
    <div class="chatbox">
        <textarea class="chatinput" type="text" placeholder="Write a message..."></textarea>
        <div class="chatbutton image"><i class="far fa-camera-alt"></i></div>
        <div class="chatbutton submit"><i class="far fa-paper-plane"></i></div>
    </div>
</form>`
  );

  function showLatestMessage(element) {
    $(".responsive-html5-chat")
      .find(".messages")
      .scrollTop($(".responsive-html5-chat .messages")[0].scrollHeight);
  }
  showLatestMessage(element);

  $(".chatinput").keypress(function (event) {
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      event.preventDefault();
      $(".submit").click();
    }
  });
  $(".submit").click(function (event) {
    event.preventDefault();
    var message = $(".chatinput").val();
    if ($(".chatinput").val()) {
      var d = new Date();
      var clock = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var currentDate =
        (("" + day).length < 2 ? "0" : "") +
        day +
        "." +
        (("" + month).length < 2 ? "0" : "") +
        month +
        "." +
        d.getFullYear() +
        "&nbsp;&nbsp;" +
        clock;
      //   $(element + " div.messages").append(
      //     '<div class="message"><div class="myMessage"><p>' +
      //       message +
      //       "</p><date>" +
      //       currentDate +
      //       "</date></div></div>"
      //   );
      data = {
        sender: "Tirtha",
        origin: "me",
        date: currentDate,
        message: message,
      };
      let index = addLocal(data);

      if (index != false) {
        let index = document.getElementsByClassName("myMessage").length;
        // responsiveChatPush(".chat", index, data);
        restoreChats();
      }
      else {
        console.log(index);
        console.log("error in add");
      }

      setTimeout(function () {
        $(element + " > span").addClass("spinner");
      }, 100);
      setTimeout(function () {
        $(element + " > span").removeClass("spinner");
      }, 2000);
    }
    $(".chatinput").val("");
    showLatestMessage(element);
  });
}
function showLatestMessage() {
  $(".responsive-html5-chat")
    .find(".messages")
    .scrollTop($(".responsive-html5-chat .messages")[0].scrollHeight);
}

function restoreChatLocation(chatLocation) {
  if (chatLocation > $(".responsive-html5-chat .messages")[0].scrollHeight) {
    chatLocation = $(".responsive-html5-chat .messages")[0].scrollHeight;
    console.log("chatlocation is greater");
  }
  $(".responsive-html5-chat")
    .find(".messages")
    .scrollTop(chatLocation);
}

function responsiveChatPush(element, index, chatdata) {
  let id = chatdata["id"];
  let sender = chatdata["sender"];
  let origin = chatdata["origin"];
  let date = chatdata["date"];
  let message = chatdata["message"];

  if (message.startsWith("/topics ")) {
    var topics = message.replace("/topics ", "")
    console.log(topics);
    localStorage.setItem("walltopics", topics);
  }


  var originClass;
  message = urlify(message);
  if (origin == "me") {
    originClass = "myMessage";
  } else {
    originClass = "fromThem";
  }
  if (origin == "me") {
    $(element + " .messages").append(
      `<div class="message">
        <div oncontextmenu="chatcontext(${index},event)" class="${originClass} chatbubble">
          <p>${message}</p>
          <date><b>${sender}</b> ${date}</date>
          <div class="removechat" onclick="removeLocal(${index},${id})" data-chatid=${index}><i class="far fa-trash"></i></div>
        </div>
      </div>`
    );
  } else {
    $(element + " .messages").append(
      `<div class="message">
        <div class="${originClass} chatbubble">
          <p>${message}</p>
          <date><b>${sender}</b> ${date}</date>
        </div>
        
      </div>`
    );
  }


}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

/* Activating chatbox on element */
responsiveChat(".responsive-html5-chat");

const localStorageVariable = "tabchatdata";

function loadLocal() {
  if (localStorage.getItem(localStorageVariable) == null) {
    localStorage.setItem(localStorageVariable, JSON.stringify([]));
    return [];
  } else {
    return JSON.parse(localStorage.getItem(localStorageVariable));
  }
}

function clearLocal() {
  localStorage.setItem(localStorageVariable, JSON.stringify([]));
}
function addLocal(data) {
  console.log(data);

  try {
    let chatList = [];
    let index = 0;
    let primaryKey = 0;
    if (localStorage.getItem(localStorageVariable) == null) {
      data["id"] = primaryKey;
      chatList.push(data);
    } else {
      chatList = JSON.parse(localStorage.getItem(localStorageVariable));
      index = chatList.length;
      if (index == 0) {
        primaryKey = 0;
      } else {
        for (var i = 0; i < index; i++) {
          if (chatList[i]["id"] > primaryKey) {
            primaryKey = chatList[i]["id"];
          }
        }
      }

      data["id"] = primaryKey + 1;
      chatList.push(data);
    }
    localStorage.setItem(localStorageVariable, JSON.stringify(chatList));
    return index + 1;
  } catch {
    console.log("error");
    return false;
  }
}
function removeLocal(idx, id) {
  let chatList = JSON.parse(localStorage.getItem(localStorageVariable));
  console.log(id, idx);
  console.log(chatList[idx]);
  let popped = chatList.splice(idx, 1);
  localStorage.setItem(localStorageVariable, JSON.stringify(chatList));
  console.log(popped["message"]);
  var chatLocation = $(".responsive-html5-chat .messages")[0].scrollTop;
  restoreChats(letestchat = false, chatLocation = chatLocation);
  return;
  try {

    let index = chatList.length;
    for (var i = 0; i < index; i++) {
      if (chatList[i]["id"] == id) {

      }
    }

    localStorage.setItem(localStorageVariable, JSON.stringify(chatList));
    // document.getElementsByClassName("message")[idx + 1].style.display = "none";

    return true;
  } catch {
    return false;
  }
}

/* Let's push some dummy data */
// responsiveChatPush(
//   ".chat",
//   "Kate",
//   "me",
//   "08.03.2017 14:30:7",
//   "It looks beautiful!"
// );
welcome_data = {
  id: -1,
  sender: "QuickChat",
  origin: "you",
  date: "08.03.2022 14:30:7",
  message: "Welcome to QuickNote<br>Add anything you want to save for later.",
};


welcome1_data = {
  id: -2,
  sender: "QuickChat",
  origin: "you",
  date: "08.03.2022 14:30:7",
  message: "To set wallpaper topics use /topics {YOUR-TOPIC,YOUR_TOPIC,...}",
};

function adminChatLoad() {
  responsiveChatPush(".chat", -2, welcome_data);
  responsiveChatPush(".chat", -1, welcome1_data);
}



function chatcontext(id, e) {
  e.preventDefault();
  console.log(id);
  let chat = document.getElementsByClassName("myMessage")[id];
  chat.style.borderBottomLeftRadius = "0px";
  chat.style.borderTopLeftRadius = "0px";
  console.log(chat.innerHTML);
  // chat.classList.toggle("moveleft");
  chat.querySelector(".removechat").classList.toggle("moveright");
}

function restoreChats(letestchat = true, chatLocation = 0) {
  let chatlist = loadLocal();
  document.querySelector(".responsive-html5-chat .messages").innerHTML = "";
  adminChatLoad();
  for (var i = 0; i < chatlist.length; i++) {
    responsiveChatPush(".chat", i, chatlist[i]);
  }
  if (letestchat) {
    showLatestMessage();
  }
  else {
    restoreChatLocation(chatLocation);
  }
}
restoreChats();

/* DEMO */
if (parent == top) {
  $("a.article").show();
}
