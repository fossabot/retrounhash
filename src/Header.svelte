<script>
  import { username, user, db } from "./user";
  import jq from "jquery";
  import Swal from "sweetalert2";
  import compress from "compress-base64";
  import Icon from "mdi-svelte";
  const urlParams = new URLSearchParams(window.location.search);
  import Drawer from "svelte-drawer-component";
  let open = false;

  import {
    mdiShare,
    mdiContentSave,
    mdiEject,
    mdiInformationOutline,
    mdiArrowLeftBoldCircleOutline,
  } from "@mdi/js";

  import Gun from "gun";
  import "gun/lib/rindexed";
  import { writable } from "svelte/store";

  const db3 = new Gun({
    peers: [
      "http://localhost:8765/gun",
      "https://gun--server.herokuapp.com/gun",
    ],
    localStorage: false,
  });

  function signout() {
    open = false;
    Swal.fire({
      title: "signout ?",
      showCancelButton: true,
      confirmButtonText: "signout",
      cancelButtonText: "cancel ",
    }).then((result) => {
      if (result.isConfirmed) {
        db.user()
          .get("online")
          .put(false, ({ err, ok }) => {
            if (err) {
              alert(err);
            } else {
              localStorage.clear();
              user.leave();
              username.set("");
            }
          });
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

  if (urlParams.has("c")) {
    localStorage.setItem("channel", urlParams.get("c"));
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
        function (registration) {},
        function (err) {
          console.warn(err);
        }
      );
    });
  }

  if (!localStorage.getItem("swipe")) {
    localStorage.setItem("swipe", "true");
  }
  if (localStorage.getItem("swipe") == "true") {
    document.addEventListener("swiped-right", function (e) {
      if (isChat) {
        open = true;
      }
    });

    document.addEventListener("swiped-left", function (e) {
      if (isChat) {
        open = false;
      }
    });
  }

  let NameOfTheRecentRoom;
  let roomDescription = "";
  let roomName = "";
  let roomImage = "";

  //async function computeName() {
  db3
    .get(`~${localStorage.getItem("channel")}`)
    .get("info")
    .get("profile")
    .get("name")
    .on(async (data) => {
      if (/\/room(.*)/.test(location.pathname)) {
        roomName = data;
        document.title = data + " | retrounhash";
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
      roomImage = data;
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
            db3.user().auth(keys, async () => {
              await db3
                .user()
                .get("info")
                .get("profile")
                .get("avatar")
                .put(
                  await compress(changedImage, {
                    width: 400,
                    type: "image/jpeg", // default
                    max: 200, // max size
                    min: 20, // min size
                    quality: 0.8,
                  })
                )
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
        db3.user().auth(keys, async () => {
          Swal.fire({
            title: "Enter New Name",
            input: "text",
            inputAttributes: {
              autocapitalize: "off",
              maxlength: "30",
              maxLength: "30",
            },
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
          Swal.fire({
            title: "Enter New Description",
            input: "text",
            inputAttributes: {
              autocapitalize: "off",
              maxlength: "400",
              maxLength: "400",
            },
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

  if (localStorage.getItem("keyToNav") == "true") {
    document.onkeyup = function (event) {
      if (event.keyCode == localStorage.getItem("keyToNav__enable")) {
        if (isChat) {
          toogle__nav();
        }
      }
    };
  }

  function toogle__nav() {
    if (open == true) {
      open = false;
    } else {
      open = false;
    }
  }
</script>

<div class="navbar mb-3 shadow-xl rounded-box">
  <div class="flex-1">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" class="flex m-2 normal-case text-xl">
      {#if !isChat}
        <a href="/" class="btn btn-ghost text-md">retrounhash</a>
      {:else}
        <a href="/" class="btn btn-ghost">
          <Icon size="30px" path={mdiArrowLeftBoldCircleOutline} />
        </a>
      {/if}
      {#if roomName && roomName !== ""}
        <div class="btn btn-ghost normal-case text-xl">
          <div
            class="avatar"
            on:click={() => {
              open = true;
            }}
          >
            <div class="mask ml-2 mr-2 w-10 mask-squircle">
              <img alt="" src={roomImage} />
            </div>
          </div>
          <span
            class="m-1"
            on:click={() => {
              open = true;
            }}
          >
            {#if roomName}
              {#if !(roomName.length > 31)}
                {roomName}
              {:else}
                <i>room name too big</i>
              {/if}
            {:else}
              <i>loading...</i>
            {/if}
          </span>
        </div>
      {/if}
    </a>
  </div>
  <div class="flex-none flex">
    {#if isChat}
      <div class="navbar-end m-2">
        <button
          on:click={() => {
            open = true;
          }}
        >
          <Icon path={mdiInformationOutline} />
        </button>
      </div>
    {/if}
    <div class="dropdown navbar-end dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar" for="">
        <div class="avatar">
          <div class="w-10 mask mask-squircle">
            {#if $username}
              <img
                src={`https://avatars.dicebear.com/api/identicon/${$username}.svg?backgroundColor=white`}
                alt="logo_user"
              />
            {:else}
              <img src="/favicon.ico" alt="icon" width="30" height="30" />
            {/if}
          </div>
        </div>
      </label>
      <ul
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        {#if $username}
          <li><a href="/Account">Profile</a></li>
          <li><a href="/Create">Create Room</a></li>
          <li><a href="/Post">Create Post</a></li>
          <li><a href="/Search">Search user</a></li>
          <li><a href="/Explore">Explore</a></li>
          <li><a href="/Settings">Settings</a></li>
        {/if}
        <li><a href="/About">About</a></li>
        {#if $username}
          <li><span on:click={signout}>Logout</span></li>
        {/if}
      </ul>
    </div>
  </div>
</div>

<Drawer {open} size="80vw" on:clickAway={() => (open = false)}>
  <div>
    <div class="text-center">
      <label for="avatar-changer" class="text-center">
        <div class="avatar text-center">
          <div class="w-24 mask mask-squircle">
            <img src={roomImage} alt="" />
          </div>
        </div>
      </label>
      <input
        type="file"
        name="avatar-changer"
        id="avatar-changer"
        on:change={imageUploaded}
        accept="image/jpeg"
        class="hidden"
      />
    </div>
    <div
      class="text-center text-xl regular-case"
      on:dblclick={changeRoomName}
      id="InfoRoomName"
    >
      {#if roomName}
        {#if !(roomName.length > 31)}
          {roomName}
        {:else}
          <i>room name too big</i>
        {/if}
      {:else}
        <i>loading...</i>
      {/if}
    </div>
    <hr />
    <div class="pl-1 m-1">About:</div>
    <div
      class="p-1 text-s"
      on:dblclick={changeRoomDescription}
      id="InfoDescription"
    >
      {#if roomDescription}
        {#if !(roomDescription.length > 405)}
          {roomDescription}
        {:else}
          <i>room description too big</i>
        {/if}
      {:else}
        <i>loading...</i>
      {/if}
    </div>
    <button class="btn btn-info m-1" on:click={share_link}
      ><Icon path={mdiShare} />
      Share Link
    </button>
    {#if !$isInList}
      <button class="btn btn-success m-1" on:click={JoinCurrentRoom}>
        <Icon path={mdiContentSave} />
        Join This Room
      </button>
    {:else}
      <button class="btn btn-error m-1" on:click={LeaveCurrentRoom}>
        <Icon path={mdiEject} />
        Leave This Room
      </button>
    {/if}
  </div>
  <hr />
  <div class="alert alert-success shadow-lg mb-2">
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
      <span> double tap data to edit it! ( if you're the admin ) </span>
    </div>
  </div>
</Drawer>
