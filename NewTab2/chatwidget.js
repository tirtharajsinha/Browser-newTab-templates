function responsiveChat(element) {
  $(element).html(
    `<form class="chat"><span></span>
    <div class="messages"></div>
    <div class="chatbox">
        <textarea class="chatinput" type="text" placeholder="Write a message..."></textarea>
        <div class="chatbutton image"><i class="far fa-camera-alt"></i></div>
        <div class=" chatbutton submit"><i class="far fa-paper-plane"></i></div>
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
    var message = $('.chatinput').val();
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
      responsiveChatPush(".chat","Tirtha","me",currentDate,message);
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
function showLatestMessage(element) {
  $(".responsive-html5-chat")
    .find(".messages")
    .scrollTop($(".responsive-html5-chat .messages")[0].scrollHeight);
}

function responsiveChatPush(element, sender, origin, date, message) {
  var originClass;
  message=urlify(message);
  if (origin == "me") {
    originClass = "myMessage";
  } else {
    originClass = "fromThem";
  }
  $(element + " .messages").append(
    '<div class="message"><div class="' +
      originClass +
      '"><p>' +
      message +
      "</p><date><b>" +
      sender +
      "</b> " +
      date +
      "</date></div></div>"
  );
  showLatestMessage(".responsive-html5-chat");
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

/* Activating chatbox on element */
responsiveChat(".responsive-html5-chat");

/* Let's push some dummy data */
responsiveChatPush(
  ".chat",
  "Kate",
  "me",
  "08.03.2017 14:30:7",
  "It looks beautiful!"
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:31:22",
  "It looks like the iPhone message box."
);
responsiveChatPush(
  ".chat",
  "Kate",
  "me",
  "08.03.2016 14:33:32",
  "Yep, is this design responsive?"
);
responsiveChatPush(
  ".chat",
  "Kate",
  "me",
  "08.03.2016 14:36:4",
  "By the way when I hover on my message it shows date."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);
responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);

responsiveChatPush(
  ".chat",
  "John Doe",
  "you",
  "08.03.2016 14:37:12",
  "Yes, this is completely responsive."
);

/* DEMO */
if (parent == top) {
  $("a.article").show();
}
