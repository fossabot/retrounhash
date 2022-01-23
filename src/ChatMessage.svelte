<script>
  import DOMPurify from "dompurify";
  import HtmlFilter from 'html-filter'
  export let message;
  export let sender;

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
      return text.replace(/style\=\"(.*)\"/, "")
      .replace(/height\=\"(.*)\"/, "")
      .replace(/width=\"(.*)\"/, "")
      .replace(/\!important \;/, "")
    }
  }
</script>

<div class={`message ${messageClass}`}>
  <img src={avatar} alt="avatar" />
  <div class="message-text">
    <p>
      {message.who} <br />
      {@html DOMPurify.sanitize(mark(message.what.toString()))}
    </p>
    <time>{ts.toLocaleTimeString()}</time>
  </div>
</div>
