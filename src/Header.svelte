<script>
  import { username, user, db } from "./user";
  import jq from "jquery";
  import {
    downscaleImage
  } from "./utils"

  const urlParams = new URLSearchParams(window.location.search);

  import {
    NavigationDrawer,
    List,
    ListItem,
    Divider,
    Icon,
    MaterialApp,
  } from "svelte-materialify";

  import {
    mdiAccount,
    mdiPlus,
    mdiShare,
    mdiLogout,
    mdiCog,
    mdiContentSave,
    mdiEject,
    mdiInformation,
    mdiLogin,
    mdiMenu,
    mdiInformationOutline,
  } from "@mdi/js";
  import Gun from "gun";
  import "gun/lib/rindexed";
  import { writable } from "svelte/store";

  const db3 = new Gun({
    peers: [
      "https://gunjs.herokuapp.com/gun",
      "https://gun--server.herokuapp.com/gun",
    ],
    localStorage: false,
  });

  function signout() {
    CloseNav();
    Swal.fire({
      title: "signout ?",
      showCancelButton: true,
      confirmButtonText: "signout",
      cancelButtonText: "take me in!",
    }).then((result) => {
      if (result.isConfirmed) {
        user.leave();
        username.set("");
      }
    });
  }

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

  function share_link() {
    jq("body").append('<input id="copyURL" type="text" value="" />');
    jq("#copyURL")
      .val(
        window.location.protocol +
          "//" +
          window.location.hostname +
          "/room?c=" +
          localStorage.getItem("channel") || "chat"
      )
      .select();
    document.execCommand("copy");
    jq("#copyURL").remove();
    Toast.fire({
      icon: "success",
      title: "link copied!",
      timer: 2600,
    });
  }

  /*async function initRoom() {
    CloseNav();
    await Swal.fire({
      title: "Enter the room to join or create",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "join",
      showLoaderOnConfirm: true,
      preConfirm: (NameOfTheRoom) => {
        localStorage.setItem("channel", NameOfTheRoom);
        location.href = "/";
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }*/

  if (urlParams.has("c")) {
    async function greetAtEnter() {
      /*var name = await db3
        .get(`~${urlParams.get("c")}`)
        .get("info")
        .get("profile")
        .get("name")
        .then();*/

      localStorage.setItem("channel", urlParams.get("c"));
      /*Toast.fire({
        icon: "success",
        title: "joined " + name + "!",
        timer: 1000,
      });*/
    }
    greetAtEnter();
  }

  /*if (urlParams.has("s")) {
    var secretKey = urlParams.get("s");
    var current__secret = localStorage.getItem("_secret");
    localStorage.setItem("prev_secret", current__secret);
    localStorage.setItem("_secret", secretKey);
  }*/

  /*if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }*/

  var NavActive = false;

  function ToogleNav() {
    if (NavActive == true) {
      NavActive = false;
    } else {
      NavActive = true;
    }
  }

  function ToogleInfo() {
    if (InfoState == true) {
      InfoState = false;
    } else {
      InfoState = true;
    }
  }

  function CloseNav() {
    NavActive = false;
  }

  document.addEventListener("swiped-right", function (e) {
    NavActive = true;
  });

  document.addEventListener("swiped-left", function (e) {
    InfoState = false;
    CloseNav();
  });

  let NameOfTheRecentRoom;
  let roomDescription;
  let roomName;

  //async function computeName() {
  db3
    .get(`~${localStorage.getItem("channel")}`)
    .get("info")
    .get("profile")
    .get("name")
    .on(async (data) => {
      roomName = data;
      if (/\/room(.*)/.test(location.pathname)) {
        document.querySelector("#channelName").innerHTML = " / " + data;
      }
    });

  db3
    .get(`~${localStorage.getItem("channel")}`)
    .get("info")
    .get("profile")
    .get("description")
    .on(async (data) => {
      roomDescription = data;
    });

  db3
    .get(`~${localStorage.getItem("channel")}`)
    .get("info")
    .get("profile")
    .get("avatar")
    .on(async (data) => {
      document.querySelector("#roomImage").src =
        data ||
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    });

  /*setTimeout(() => {
      document.querySelector("#channelName").innerHTML =
        " / " + NameOfTheRecentRoom;
      //document.querySelector("#InfoeRoomName").innerHTML = NameOfTheRecentRoom;
      //document.querySelector("#InfoDescription").innerHTML = roomDescription;

      roomNameText = NameOfTheRecentRoom;
      //roomDescriptionText = roomDescription;
      //document.querySelector("#roomImage").src = roomImage;
      roomImage = "";
    }, 2000);*/
  //}

  let items = JSON.parse(localStorage.getItem("items") || "[]");
  function addItem(pub) {
    items.push(pub); //{ name: name, pubKeyRoom: pub}]
    //localStorage.setItem("items", JSON.stringify(items))
  }

  $: {
    localStorage.setItem("items", JSON.stringify(items));
  }

  function remove(value) {
    var index = items.indexOf(value);
    if (index > -1) {
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));
  }

  let InfoState = false;

  function JoinCurrentRoom() {
    addItem(localStorage.getItem("channel"));
    isJoinedRoom.set(true);
  }

  function LeaveCurrentRoom() {
    remove(localStorage.getItem("channel"));
    isJoinedRoom.set(false);
  }

  var joinRoomValidator = localStorage.getItem("items") || [];

  var isChat = /\/room(.*)/.test(location.pathname);

  // initialisation
  let roomNameText;
  let roomDescriptionText;
  let roomImage;
  let changedImage;

  function imageUploaded() {
    var file = document.querySelector("#avatar-changer").files[0];
    var _reader = new FileReader();
    _reader.onload = async function () {
      changedImage = _reader.result;

      try {
        await db3
          .get(`~${localStorage.getItem("channel")}`)
          .get("host")
          .get("key")
          .then(async (keyPair) => {
            const keys = await SEA.decrypt(
              keyPair,
              JSON.parse(sessionStorage.getItem("pair")).priv
            );
            console.log(keys);
            db3.user().auth(keys, async () => {
              await db3
                .user()
                .get("info")
                .get("profile")
                .get("avatar")
                .put(downscaleImage(changedImage, 400))
                .then(() => {
                  changedImage = "";
                  Swal.fire({
                    icon: "success",
                    title: "done! 🎉",
                    text: "successfully updated icon",
                  });
                });
            });
          });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e,
        });
      }
    };
    _reader.readAsDataURL(file);
  }

  const isJoinedRoom = writable(
    joinRoomValidator.includes(localStorage.getItem("channel"))
  );
</script>

<MaterialApp>
  <br /><br /><br />
  <nav
    class="navbar navbar-dark fixed-top blur"
    style="background: rgba(244, 244, 244, 0.95);"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        {#if $username}
          <img
            src={`https://avatars.dicebear.com/api/identicon/${$username}.svg?backgroundColor=white`}
            alt="logo_user"
            width="30"
            height="30"
            class="d-inline-block align-text-top"
          />
        {:else}
          <img
            src="/favicon.ico"
            alt="icon"
            width="30"
            height="30"
            class="d-inline-block align-text-top"
          />
        {/if}
      </a>
      <div class="text-center h5">
        densewaire<span id="channelName" />
      </div>
      {#if isChat}
        <button class="navbar-toggler" type="button" on:click={ToogleInfo}>
          <Icon path={mdiInformationOutline} />
        </button>
      {/if}
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        on:click={ToogleNav}
      >
        <Icon path={mdiMenu} />
      </button>
    </div>
  </nav>
</MaterialApp>
<MaterialApp>
  <NavigationDrawer
    style="overflow: auto;height: 100%;position: fixed;z-index: 9999999999;"
    absolute
    bind:active={NavActive}
  >
    <List>
      {#if /\/room(.*)/.test(location.pathname)}
        <div class="m-2 h3 text-center">Chats</div>
        {#each items as item, i (item)}
          <a href={`/room?c=${item}`}>
            <ListItem>
              {item}
            </ListItem>
          </a>
        {/each}
      {:else}
        {#if !$username}
          <div class="text-center">
            <img
              style="width: 100px !important;"
              class="img-fluid"
              src="/favicon.ico"
              alt="site logo"
            />
          </div>
          <a href="/chat"><ListItem><Icon path={mdiLogin} /> Login</ListItem></a
          >
          <a href="/About"
            ><ListItem><Icon path={mdiInformation} /> About</ListItem></a
          >
        {/if}
        {#if $username}
          <div class="text-center">
            <img
              style="width: 100px !important;height: 100px;"
              src={`https://avatars.dicebear.com/api/identicon/${$username}.svg?backgroundColor=white`}
              alt=""
            />
          </div>
          <a href="/Account"
            ><ListItem><Icon path={mdiAccount} /> Account</ListItem></a
          >
          <a href="/Create"
            ><ListItem><Icon path={mdiPlus} />Create A Room</ListItem></a
          >
          <a href="/Settings"
            ><ListItem><Icon path={mdiCog} /> Settings</ListItem></a
          >
          <ListItem on:click={signout}
            ><Icon path={mdiLogout} />Sign Out</ListItem
          >
          <a href="/About"
            ><ListItem><Icon path={mdiInformation} /> About</ListItem></a
          >
        {/if}
      {/if}
    </List>
  </NavigationDrawer>
  <NavigationDrawer
    style="overflow: auto;height: 100%;position: fixed;z-index: 9999999999;"
    absolute
    bind:active={InfoState}
  >
    <List>
      <div class="text-center">
        <label for="avatar-changer">
          <img
            src=""
            id="roomImage"
            alt=""
            style="object-fit: cover;width: 100px !important;height: 100px !important;border-radius: 5px;"
            class="img-fluid"
          />
        </label>
        <input
          type="file"
          name="avatar-changer"
          id="avatar-changer"
          on:change={imageUploaded}
          accept="image/jpeg"
        />
      </div>
      <div id="InfoRoomName" class="m-2 h3 text-center">
        {roomName || "not specified!"}
      </div>
      <Divider />
      <div class="m-2 h4">About:</div>
      <div id="InfoDescription" class="m-2 h5">
        {roomDescription || "not specified !"}
      </div>
      <ListItem on:click={share_link}
        ><Icon path={mdiShare} /> Share Link</ListItem
      >
      {#if !$isJoinedRoom}
        <ListItem id="JoinRoomButton" on:Click={JoinCurrentRoom}>
          <Icon path={mdiContentSave} /> Join This Room
        </ListItem>
      {:else}
        <ListItem id="LeaveRoomButton" on:click={LeaveCurrentRoom}>
          <Icon path={mdiEject} /> Leave This Room
        </ListItem>
      {/if}
    </List>
  </NavigationDrawer>
</MaterialApp>
