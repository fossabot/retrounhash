<script>
  import Login from './Login.svelte';
  import ChatMessage from './ChatMessage.svelte';
  import { onMount } from 'svelte';
  import { username, user } from './user';
  import debounce from 'lodash.debounce';
  import 'emoji-picker-element';
  import GUN from 'gun';
  const db = GUN();
  
  const urlParams = new URLSearchParams(window.location.search);

  let newMessage;
  let messages = [];

  let scrollBottom;
  let lastScrollTop;
  let canAutoScroll = true;
  let unreadMessages = false;

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: 'auto' }), 50);
    unreadMessages = false;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  $: debouncedWatchScroll = debounce(watchScroll, 1000);

  onMount(() => {
    var match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      '.': {
        // property selector
        '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
      },
      '-': 1, // filter in reverse
    };
    

    if(urlParams.has('c')){
      var channel = urlParams.get('c') || "chat";
      localStorage.setItem("channel", channel);
    }else{
      var channel = localStorage.getItem("channel") || "chat";
    }


    // Get Messages
    db.get('densewaire/'+channel)
      .map(match)
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const key = localStorage.getItem("_secret") || '#foo';

          var message = {
            // transform the data
            who: await db.user(data).get('alias'),
            what: (await SEA.decrypt(data.what, key)) || `<span class='text-warning'>protected with custom secret</span>`,
            when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
          };

          if (message.what) {
            messages = [...messages.slice(-100), message].sort((a, b) => a.when - b.when);
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      });
  });

  async function sendMessage() {
    var channel = localStorage.getItem("channel") || "chat";

    const secret = await SEA.encrypt(newMessage, localStorage.getItem("_secret") || '#foo');
    const message = user.get('all').set({ what: secret });
    const index = new Date().toISOString();
    db.get('densewaire/'+channel).get(index).put(message);
    newMessage = '';
    canAutoScroll = true;
    autoScroll();
  }
  function emoji(){
    if(document.querySelector('.emoji__').innerHTML == ""){
     document.querySelector('.emoji__').innerHTML = "<emoji-picker class='light'></emoji-picker>";
    }else{
     document.querySelector('.emoji__').innerHTML = "";
    }
     document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event => document.querySelector("#submit__area__main__").value += event.detail.unicode+" ");
  }
</script>

<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      {#each messages as message (message.when)}
        <ChatMessage {message} sender={$username} />
      {/each}

      <div class="dummy" style="height: 150px;" bind:this={scrollBottom} />
    </main>
    <form autocomplete="off" style="backdrop-filter: blur(10px);background: transparent;" on:submit|preventDefault={sendMessage} class="fixed-bottom navbar">
    <span class="emoji__"></span>
     <div class="input-group mb-2">
      <div class="input-group-prepend">
        <span class="input-group-text" style="height: 38px;" id="basic-addon1" on:click={emoji}>😎</span>
      </div>
      <input style="background: white;height: 38px;" id="submit__area__main__" class="form-control" type="text" placeholder="Type a message..." bind:value={newMessage} maxlength="100" />
      <div class="input-group-append">
        {#if localStorage.getItem("autoscroll") == "yes"}
         <button type="button" style="height: 38px;" class="btn input-group-text" on:click={autoScroll}>
           <i class="fas fa-angle-down fa-lg"></i>
         </button>
        {/if}
        <button type="submit" style="height: 38px;" class="btn input-group-text" disabled={!newMessage}>
          <i class="fas fa-angle-double-right fa-2x"></i>
        </button>
       </div>
      </div>
    </form>
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>
