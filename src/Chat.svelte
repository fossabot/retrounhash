<script>
  import ChatMessage from "./ChatMessage.svelte";
  import { onMount } from "svelte";
  import { username, user } from "./user";
  import debounce from "lodash.debounce";
  import "emoji-picker-element";
  import GUN from "gun";
  import Gun from "gun";
  const peers = [
    "https://gunjs.herokuapp.com/gun",
    "https://gun--server.herokuapp.com/gun",
  ];
  const db = new Gun({ peers });
  const db1 = new Gun({ peers });
  const db2 = new Gun({ peers });

  import { ProgressLinear } from "svelte-materialify";

  const urlParams = new URLSearchParams(window.location.search);

  let newMessage;
  let messages = [];

  let scrollBottom;
  let lastScrollTop;
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
      },
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
      .map()//match)
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

  async function setCert(permission, pass) {
    permission = '*';
    pass = '1234';
    const room = localStorage.getItem("channel") || await SEA.pair();
    localStorage.setItem("channel", room.pub);
    console.log(room.pub);
    db1.user().auth(room, async (dat) => {
      var userKeys = JSON.parse(sessionStorage.getItem("pair"));
      console.log("user: " + userKeys.pub);
      let enc = await SEA.encrypt(room, pass || "thePassDummy");
      db1.user().get("host").get("key").put(enc);
      const cert = await SEA.certify(
        permission || "*",
        { "*": "chat" }, //, "+": "*" },
        room,
        null,
        {
          //blacklist: "ban"
        }
      );
      db1.user().get("certs").get("chat").get("certificate").put(cert);
    });
  }

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

      console.log(certificate + "cert");

      // let text = "hello!!";
      // let hash = await SEA.work(text, null, null, { name: 'SHA-256' })

      /*db2
        .get(`~${key}`)
        .get("chat")
        .get(index)
        .on((data) => {
          console.log(data);
        });*/
        
      db2
        .get(`~${key}`)
        .get("chat")
        .get(index) //${userKeys.pub}`)
        .put(
          message || "no message specified",
          (ack) => {
            console.log("callback: " + JSON.stringify(ack));
          },
          { opt: { cert: certificate } }
        );
      console.log("pub key" + userKeys.pub);
    }
    //if (db2.user().is) {
    //  console.log("no auth");
    //  console.log(db2.user().is);
    //  putInChat();
    //} else {

    const userKeys = JSON.parse(sessionStorage.getItem("pair"));

    db2.user().auth(userKeys, async () => {
      putInChat(message, index);
    });
    //}
  }

  async function sendMessage() {
    var channel = localStorage.getItem("channel") || "chat";

    const secret = await SEA.encrypt(
      newMessage.toString(),
      localStorage.getItem("_secret") || "#foo"
    );
    const message = user.get("all").set({ what: secret });
    const index = new Date().toISOString();
    getCert(message, index);
    //db.get("densewaire/" + channel)
    //  .get(index)
    //  .put(message);
    newMessage = "";
    canAutoScroll = true;
    autoScroll();
  }
  function emoji() {
    if (document.querySelector(".emoji__").innerHTML == "") {
      document.querySelector(".emoji__").innerHTML =
        "<emoji-picker class='light'></emoji-picker>";
    } else {
      document.querySelector(".emoji__").innerHTML = "";
    }
    document
      .querySelector(".emoji__")
      .addEventListener(
        "emoji-click",
        (event) =>
          (document.querySelector("#submit__area__main__").value +=
            event.detail.unicode)
      );
  }

  let base64String = "";

  async function imageUploaded() {
    var file = document.querySelector("input[type=file]")["files"][0];

    var reader = new FileReader();
    console.log("next");
    reader.onload = async function () {
      base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

      const _secret = await SEA.encrypt(
        "IMAGE=" + reader.result.toString(),
        localStorage.getItem("_secret") || "#foo"
      );
      const _message = user.get("all").set({ what: _secret });
      const _index = new Date().toISOString();
      getCert(_message, _index)
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
          console.log(base64);

          const __secret = await SEA.encrypt(
            "AUDIO=" + base64.toString(),
            localStorage.getItem("_secret") || "#foo"
          );
          const __message = user.get("all").set({ what: __secret });
          const __index = new Date().toISOString();
          getCert(__message, __index)
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
        });
      }, 5000);
    });
  }

  let isProgActive = true;
  setTimeout(() => {
    isProgActive = false;
  }, 5000);
</script>

<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      <ProgressLinear height="10px" indeterminate bind:active={isProgActive} />
      {#each messages as message (message.when)}
        <ChatMessage {message} sender={$username} />
      {/each}
      <div class="dummy" style="height: 150px;" bind:this={scrollBottom} />
    </main>
    <form
      autocomplete="off"
      style="backdrop-filter: blur(10px);background: transparent;"
      on:submit|preventDefault={sendMessage}
      class="fixed-bottom navbar blur"
    >
      <span class="emoji__" />
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          <span
            class="input-group-text"
            style="height: 38px;"
            id="emoji_add"
            on:click={emoji}><i class="fas fa-laugh-wink fa-lg" /></span
          >
          <span
            class="input-group-text"
            style="height: 38px;"
            id="record"
            on:click={record}><i class="fas fa-microphone-alt fa-lg" /></span
          >
          <label for="file-upload" class="custom-file-upload input-group-text">
            <i class="fas fa-image fa-lg" />
          </label>
          <input
            type="file"
            name=""
            id="file-upload"
            on:change={imageUploaded}
            accept="image/*"
          />
        </div>
        <input
          style="background: white;"
          id="submit__area__main__"
          class="form-control"
          type="text"
          placeholder="Type a message..."
          bind:value={newMessage}
          maxlength="100"
        />
        <div class="input-group-append">
          {#if localStorage.getItem("autoscroll") == "true"}
            <button
              type="button"
              style="height: 38px;"
              class="btn input-group-text"
              on:click={autoScroll}
            >
              <i class="fas fa-angle-down fa-lg" />
            </button>
          {/if}
          <button
            type="submit"
            style="height: 38px;"
            class="btn input-group-text"
            disabled={!newMessage}
          >
            <i class="fas fa-angle-double-right fa-2x" />
          </button>
        </div>
      </div>
    </form>
  {:else}
    <main>
      please login :)
    </main>
  {/if}
</div>
