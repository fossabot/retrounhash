<script>
  import { username, user, db } from "./user";
  import jq from "jquery";
  import { downscaleImage } from "./utils";

  const urlParams = new URLSearchParams(window.location.search);

  import {
    NavigationDrawer,
    List,
    ListItem,
    Divider,
    Icon,
    Alert,
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

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }

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

  if (!localStorage.getItem("swipe")) {
    localStorage.setItem("swipe", "true");
  }
  if (localStorage.getItem("swipe") == "true") {
    document.addEventListener("swiped-right", function (e) {
      NavActive = true;
    });

    document.addEventListener("swiped-left", function (e) {
      InfoState = false;
      CloseNav();
    });
  }

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
      if (data == undefined || data == "" || !/data:image\/(.*)/.test(data)) {
        data =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }
      document.querySelector("#roomImage").src = data;
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
    items = [...items, pub];
    isInList.set(true);
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
    isInList.set(false);
  }

  let InfoState = false;

  function JoinCurrentRoom() {
    addItem(localStorage.getItem("channel"));
  }

  function LeaveCurrentRoom() {
    remove(localStorage.getItem("channel"));
  }

  //var joinRoomValidator = localStorage.getItem("items") || [];

  var isChat = /\/room(.*)/.test(location.pathname);

  // initialisation
  let changedImage;
  const isInList = writable(items.includes(localStorage.getItem("channel")));

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
                .put(changedImage)
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

  let isJoinedRoom; //items.includes(localStorage.getItem("channel"));
  async function changeRoomName() {
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
          ToogleInfo();
          Swal.fire({
            title: "Enter New Name",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Change",
            showLoaderOnConfirm: true,
            preConfirm: async (response) => {
              await db3
                .user()
                .get("info")
                .get("profile")
                .get("name")
                .put(response)
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "done! 🎉",
                    text: "successfully updated room name",
                  });
                });
            },
          });
        });
      });
  }

  async function changeRoomDescription() {
    await db3
      .get(`~${localStorage.getItem("channel")}`)
      .get("host")
      .get("key")
      .then(async (keyPair) => {
        const keys = await SEA.decrypt(
          keyPair,
          JSON.parse(sessionStorage.getItem("pair")).priv
        );
        db3.user().auth(keys, async () => {
          ToogleInfo();
          Swal.fire({
            title: "Enter New Description",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "Change",
            showLoaderOnConfirm: true,
            preConfirm: async (response) => {
              await db3
                .user()
                .get("info")
                .get("profile")
                .get("description")
                .put(response)
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    title: "done! 🎉",
                    text: "successfully updated description",
                  });
                });
            },
          });
        });
      });
  }

  let data;
  async function returnNull(pubb) {
    await db
      .get(`~${pubb}`)
      .get("info")
      .get("profile")
      .get("name")
      .then(async (_data) => {
        data = _data;
      });

    return data;
  }
</script>

<MaterialApp>
  <br /><br /><br />
  <nav
    class="navbar navbar-dark fixed-top blur"
    style="background: rgba(83, 158, 138, 0.8);backdrop-filter: blur(2px);"
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
            style="border-radius: 5px;"
            class="d-inline-block align-text-top"
          />
        {/if}
      </a>
      <div class="text-center h5">
        retrounhash<span id="channelName" />
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
        {#if !localStorage.getItem("items") || localStorage.getItem("items") == "[]"}
          <div class="m-2">empty!</div>
        {:else}
          {#each items as item, i (item)}
            {#await returnNull(item)}
              <ListItem>loading....</ListItem>
            {:then name}
              <a href={`/room?c=${item}`}>
                <ListItem>
                  {name}
                </ListItem>
              </a>
            {/await}
          {/each}
        {/if}
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
      <div
        on:dblclick={changeRoomName}
        id="InfoRoomName"
        class="m-2 h3 text-center"
      >
        {roomName || "loading..."}
      </div>
      <Divider />
      <div class="m-2 h4">About:</div>
      <div
        on:dblclick={changeRoomDescription}
        id="InfoDescription"
        class="m-2 h5"
        style="overflow: scroll;"
      >
        {roomDescription || "loading..."}
      </div>
      <ListItem on:click={share_link}
        ><Icon path={mdiShare} />
        Share Link
      </ListItem>
      {#if !$isInList}
        <ListItem on:click={JoinCurrentRoom}>
          <Icon path={mdiContentSave} />
          Join This Room
        </ListItem>
      {:else}
        <ListItem on:click={LeaveCurrentRoom}>
          <Icon path={mdiEject} />
          Leave This Room
        </ListItem>
      {/if}
    </List>
    <Divider />
    <Alert class="primary-text" text border="left">
      double tap data to edit it! ( if you're the admin )
    </Alert>
  </NavigationDrawer>
</MaterialApp>
