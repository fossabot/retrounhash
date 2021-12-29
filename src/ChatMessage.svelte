<script>
  import DOMPurify from 'dompurify';
  export let message;
  export let sender;

  const messageClass = message.who === sender ? 'sent' : 'received';

  const avatar = `https://avatars.dicebear.com/api/identicon/${message.who}.svg?backgroundColor=white`;

  const ts = new Date(message.when);

  function mark(text){
    if(text.match(/IMAGE\=(.*)/)){
     var textMarked = text.replace(/IMAGE\=(.*)/, "<img class='img-fluid' src='$1' alt='invalid image' />");
     return textMarked;
    }
    return text;
  }
</script>

<div class={`message ${messageClass}`}>
  <img src={avatar} alt="avatar" />
  <div class="message-text">
    <p>{message.who} <br> {@html DOMPurify.sanitize(mark(message.what.toString()))}</p>
    <time>{ts.toLocaleTimeString()}</time>
  </div>
</div>
