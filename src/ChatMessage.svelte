<script>
  import DOMPurify from "dompurify";
  import { db } from "./user";

  export let message;
  export let sender;
  let userstatus;
  let pub = message.pub;

  const messageClass = message.who === sender ? "sent" : "received";

  const avatar = `https://avatars.dicebear.com/api/identicon/${message.who}.svg?backgroundColor=white`;

  const ts = new Date(message.when);

  function mark(text) {
    if (text.match(/IMAGE\=(.*)/)) {
      var textMarked = text.replace(
        /IMAGE\=(.*)/,
        "<img class='img-fluid' src='$1' alt='invalid image' />"
      );
      return textMarked;
    } else if (text.match(/AUDIO\=(.*)/)) {
      var textMarked = text.replace(
        /AUDIO\=(.*)/,
        '<audio controls><source src="$1" type="audio/mp3">Your browser does not support the audio element.</audio>'
      );
      return textMarked;
    } else {
      if (text.length >= 100) {
        return "<i style='color: grey;'>this message is  bigger than standard length</i>";
      }
      return text
        .replace(/style\=\"(.*)\"/, "")
        .replace(/height\=\"(.*)\"/, "")
        .replace(/width=\"(.*)\"/, "")
        .replace(/\!important \;/, "");
    }
  }

  db.user(pub)
    .get("online")
    .on((stat) => {
      if (stat) {
        userstatus = "online";
      } else {
        userstatus = "offline";
      }
    });
</script>

<div class={`message shadow-m ${messageClass}`}>
  <div class={`avatar m-1 ${userstatus}`}>
    <div class="w-9 mask mask-squircle">
      <a href={`/User/${pub}`}>
        <img src={avatar} alt="avatar" />
      </a>
    </div>
  </div>
  <div class="message-text">
    <p>
      {message.who} <br />
      {@html DOMPurify.sanitize(mark(message.what.toString()))}
    </p>
    <time>{ts.toLocaleTimeString()}</time>
  </div>
</div>

<style>
  p {
    max-width: 500px;
    margin-bottom: 0;
    line-height: 24px;
    padding: 7px 17px;
    border-radius: 14px;
    position: relative;
    text-align: center;
    margin: 0px !important;
  }

  .message {
    display: flex;
    align-items: center;
    margin: 0;
    word-wrap: break-word;
  }

  .sent {
    flex-direction: row-reverse;
  }

  .sent p {
    align-self: flex-end;
    text-align: right;
    border-bottom-right-radius: 0px;
    background: rgba(13, 110, 253, 0.25);
  }
  .received p {
    background: #e5e5ea;
    text-align: left;
    border-bottom-left-radius: 0px;
    background: rgba(229, 229, 234, 0.25);
  }

  .message-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .received .message-text {
    align-items: flex-start;
  }

  time {
    font-size: 0.7rem;
    color: #9a9a9a;
    margin: 0 1rem;
  }
  .msg-img {
    width: 30px;
    margin: 10px;
    border-radius: 5px;
  }

  .img-fluid {
    height: 300px;
    border-radius: 5px;
  }

  .message:last-child {
    margin-bottom: 20px;
  }
</style>
