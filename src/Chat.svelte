<script>
  import ChatMessage from "./ChatMessage.svelte";
  import { onMount } from "svelte";
  import Login from "./Login.svelte";
  import { username, user } from "./user";
  import debounce from "lodash.debounce";
  import "emoji-picker-element";
  import { db2 } from "./gunInstance.js";
  import Icon from "mdi-svelte";
  import Swal from "sweetalert2";

  import "gun/lib/radisk";
  import "gun/lib/radix";
  import "gun/lib/rindexed";

  import {
    mdiArrowDownCircleOutline,
    mdiEmoticonWinkOutline,
    mdiImageOutline,
    mdiMessageVideo,
    mdiMicrophoneOutline,
    mdiSendOutline,
  } from "@mdi/js";

  import GUN from "gun";
  import Gun from "gun";
  const peers = [
    "http://localhost:8765/gun",
    "https://gun--server.herokuapp.com/gun",
  ];
  const db = new Gun({
    peers: peers,
    radisk: false,
    axe: true,
    rindexed: true,
    localStorage: false,
  });
  const db1 = new Gun({
    peers: peers,
    radisk: false,
    axe: true,
    rindexed: true,
    localStorage: false,
  });

  const urlParams = new URLSearchParams(window.location.search);

  let newMessage;
  let messages = [];

  let scrollBottom;
  let lastScrollTop;
  let theme;
  let canAutoScroll = true;
  let unreadMessages = false;

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: "auto" }), 50);
    unreadMessages = false;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  $: debouncedWatchScroll = debounce(watchScroll, 1000);

  onMount(() => {
    /*var match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      ".": {
        // property selector
        ">": new Date(+new Date() - 2 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
    
      "-": 1, // filter in reverse
    };*/

    if (urlParams.has("c")) {
      var channel = urlParams.get("c") || "chat";
      localStorage.setItem("channel", channel);
    } else {
      var channel = localStorage.getItem("channel") || "chat";
    }

    // Get Messages
    const key = localStorage.getItem("channel");

    db2
      .get(`~${key}`)
      .get("chat")
      .map() //match)
      .once(async (data, id) => {
        if (data) {
          // Key for end-to-end encryption
          const ENCkey = localStorage.getItem("_secret") || "#foo";

          var message = {
            // transform the data
            who: await db.user(data).get("alias"),
            what:
              (await SEA.decrypt(data.what, ENCkey)) ||
              (await SEA.decrypt(data.what, "#foo")) ||
              `<i class="fas fa-lock fa-xl"></i> PROTECTED WITH CUSTOM SECRET`,
            pub: data.pub,
            when: GUN.state.is(data, "what"), // get the internal timestamp for the what property.
          };

          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when
            );
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      });
  });

  async function getCert(message, index) {
    async function putInChat(message, index) {
      const userKeys = JSON.parse(sessionStorage.getItem("pair"));

      const key = localStorage.getItem("channel");
      const certificate = await db2
        .get(`~${key}`)
        .get("certs")
        .get("chat")
        .get("certificate")
        .then();

      db2
        .get(`~${key}`)
        .get("chat")
        .get(index) //${userKeys.pub}`)
        .put(message || "lol", null, {
          opt: { cert: certificate },
        });
    }

    const userKeys = JSON.parse(sessionStorage.getItem("pair"));

    db2.user().auth(userKeys, async () => {
      putInChat(message, index);
    });
    //}
  }

  async function sendMessage() {
    const secret = await SEA.encrypt(
      newMessage.toString(),
      localStorage.getItem("_secret") || "#foo"
    );
    const message = user.get("all").set({
      what: secret,
      pub: JSON.parse(sessionStorage.getItem("pair")).pub,
    });
    const index = new Date().toISOString();
    getCert(message, index);

    newMessage = "";
    canAutoScroll = true;
    autoScroll();
  }

  let base64String = "";

  async function imageUploaded() {
    var file = document.querySelector("#image-send-picker")["files"][0];

    var reader = new FileReader();
    reader.onload = async function () {
      base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

      const _secret = await SEA.encrypt(
        "IMAGE=" + reader.result.toString(),
        localStorage.getItem("_secret") || "#foo"
      );
      const _message = user.get("all").set({ what: _secret });
      const _index = new Date().toISOString();
      getCert(_message, _index);
      newMessage = "";
      canAutoScroll = true;
      autoScroll();
    };
    reader.readAsDataURL(file);
  }

  async function record() {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      Toast.fire({
        title: "started recording!",
        timer: 3000,
      });
      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async function () {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        var reader = new window.FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async function () {
          var base64 = reader.result;

          const __secret = await SEA.encrypt(
            "AUDIO=" + base64.toString(),
            localStorage.getItem("_secret") || "#foo"
          );
          const __message = user.get("all").set({ what: __secret });
          const __index = new Date().toISOString();
          getCert(__message, __index);
          newMessage = "";
          base64 = "";
          canAutoScroll = true;
          autoScroll();
        };
        //const audioUrl = URL.createObjectURL(audioBlob);
      });

      setTimeout(() => {
        mediaRecorder.stop();
        Toast.fire({
          title: "stopped recording!",
          timer: 3000,
        });
      }, 5000);
    });
  }

  function parseEmoji(e) {
    if (newMessage == undefined || newMessage == "") {
      newMessage = " ";
    }
    newMessage += e.detail.unicode;
  }

  function selectEmoji() {
    var elm = document.querySelector("#emoji");
    if (elm.style.display == "none") {
      elm.style.display = "block";
    } else {
      elm.style.display = "none";
    }
  }

  if (localStorage.getItem("theme") == "true") {
    theme = "dark";
  } else {
    theme = "light";
  }

  import { MobileKeyboard, Gif } from "svelte--gif";
  let gif;
  let gifOpen;
</script>

{#if $username}
  <div class="text-center w-full">
    <div
      style="width: 80vw;margin-left: 10vw;"
      class=" alert alert-success shadow-lg mb-2"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>
          Use a different encryption key only your friends know, for the best
          security. You can have that in the settings under `custom encryption`
        </span>
      </div>
    </div>
  </div>
{/if}
<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      {#each messages as message (message.when)}
        <ChatMessage {message} sender={$username} />
      {/each}
      <div class="dummy" style="height: 150px;" bind:this={scrollBottom} />
    </main>
    <form
      autocomplete="off"
      on:submit|preventDefault={sendMessage}
      class="navbar flex"
    >
      <span class="emoji__">
        <emoji-picker
          class={theme || "light"}
          id="emoji"
          style="display:none;"
          on:emoji-click={parseEmoji}
        />
      </span>

      <span class="m-1" id="emoji_add" on:click={selectEmoji}>
        <Icon path={mdiEmoticonWinkOutline} />
      </span>
      <span class="m-1" id="record" on:click={record}>
        <Icon path={mdiMicrophoneOutline} />
      </span>
      <span
        class="m-1"
        id="gif"
        on:click={() => {
          if (gifOpen == true) {
            gifOpen = false;
          } else {
            gifOpen = true;
          }
        }}
      >
        <Icon path={mdiMessageVideo} />
        {#if gifOpen}
          <MobileKeyboard
            key="NUSWFJ1TIPKW"
            on:click={async ({ detail }) => {
              gif = detail;
              const _secret = await GUN.SEA.encrypt(
                "IMAGE=" + detail.gif,
                localStorage.getItem("_secret") || "#foo"
              );
              const _message = user.get("all").set({ what: _secret });
              const _index = new Date().toISOString();
              getCert(_message, _index);
              newMessage = "";
              canAutoScroll = true;
              autoScroll();
            }}
          />
        {/if}
      </span>

      <label class="m-1" for="image-send-picker">
        <Icon path={mdiImageOutline} />
      </label>
      <input
        type="file"
        name=""
        id="image-send-picker"
        on:change={imageUploaded}
        accept="image/jpeg"
        class="hidden"
      />

      <input
        id="submit__area__main__"
        class="input w-5/6 input-bordered"
        type="text"
        placeholder="Type a message..."
        bind:value={newMessage}
        maxlength="98"
      />

      {#if localStorage.getItem("autoscroll") == "true"}
        <button class="btn btn-ghost" type="button" on:click={autoScroll}>
          <Icon path={mdiArrowDownCircleOutline} />
        </button>
      {/if}
      <button type="submit" class="btn btn-ghost" disabled={!newMessage}>
        <Icon path={mdiSendOutline} />
      </button>
    </form>
  {:else}
    <Login />
  {/if}
</div>

<style>
  .navbar {
    overflow: hidden;
    position: fixed;
    bottom: 0;
    width: 100%;
    backdrop-filter: blur(8px);
    text-align: center;
  }
</style>
