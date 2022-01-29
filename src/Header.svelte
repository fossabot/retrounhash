<script>
  import { username, user } from "./user";
  import jq from "jquery";

  const urlParams = new URLSearchParams(window.location.search);

  import {
    NavigationDrawer,
    List,
    ListItem,
    Button,
    Icon,
    MaterialApp,
  } from "svelte-materialify";
  import {
    mdiAccount,
    mdiPlus,
    mdiKey,
    mdiShare,
    mdiLogout,
    mdiCog,
    mdiExitRun,
  } from "@mdi/js";
  import Gun from "gun";

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
          "/chat?c=" +
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

  function roomGen() {
    var secret_channel = Math.random().toString(36).substr(4, 10);
    var sKEY = Math.random().toString(36).substr(4, 5);
    jq("body").append('<input id="copyURL" type="text" value="" />');
    jq("#copyURL")
      .val(
        window.location.protocol +
          "//" +
          window.location.hostname +
          "/?c=" +
          secret_channel +
          "&s=" +
          sKEY
      )
      .select();
    document.execCommand("copy");
    jq("#copyURL").remove();
    CloseNav();
    Swal.fire({
      title: "Go there now ?",
      text: "join the secret room ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      cancelButtonText: "i will go later",
    }).then((result) => {
      if (result.isConfirmed) {
        Toast.fire({
          icon: "success",
          title: "share the copied link with anyone to chat privately!",
          timer: 4600,
        }).then(() => {
          location.href =
            window.location.protocol +
            "//" +
            window.location.hostname +
            "/chat?c=" +
            secret_channel +
            "&s=" +
            sKEY;
        });
      } else {
        Toast.fire({
          title: "canceled",
          timer: 1500,
        });
      }
    });
  }

  if (urlParams.has("c")) {
    var channel = urlParams.get("c");
    localStorage.setItem("channel", channel);
    Toast.fire({
      icon: "success",
      title: "joined " + channel + "!",
      timer: 3000,
    });
  } else {
    var channel = localStorage.getItem("channel") || "chat";
  }

  if (urlParams.has("s")) {
    var secretKey = urlParams.get("s");
    var current__secret = localStorage.getItem("_secret");
    localStorage.setItem("prev_secret", current__secret);
    localStorage.setItem("_secret", secretKey);
  }

  /*if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }*/

  function leaveSecretRoom() {
    CloseNav();
    localStorage.setItem("_secret", "#foo");
    localStorage.setItem("channel", "chat");
    location.href = "/";
  }

  let deferredPrompt;

  if (/\/chat(.*)/.test(location.pathname)) {
    if (localStorage.getItem("dontShowPopupPwa") !== "true") {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        Swal.fire({
          title: "Install as web app",
          text:
            "please install this site as a web app for the best experience!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Let's do it!",
          cancelButtonText: "later",
        }).then((result) => {
          if (result.isConfirmed) {
            Toast.fire({
              icon: "success",
              title: "Click install!",
              timer: 1000,
            }).then(() => {
              deferredPrompt.prompt();
              // Wait for the user to respond to the prompt
              deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                  Toast.fire({
                    title: "Open the application for better experience!",
                    timer: 3500,
                  });
                } else {
                  Toast.fire({
                    title: "This may result in poor performance!",
                    timer: 3500,
                  });
                }
              });
            });
          } else {
            Toast.fire({
              title: "This may result in poor performance!",
              timer: 1500,
            });
          }
        });
      });
    } else {
      window.removeEventListener("beforeinstallprompt", (e) => {});
    }
  }

  function installPwa() {
    Toast.fire({
      icon: "success",
      title: "Click install!",
      timer: 1000,
    }).then(() => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          Toast.fire({
            title: "Open the application for better experience!",
            timer: 3500,
          });
        } else {
          Toast.fire({
            title: "This may result in poor performance!",
            timer: 3500,
          });
        }
      });
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

  function CloseNav() {
    NavActive = false;
  }

  document.addEventListener("swiped-right", function (e) {
    NavActive = true;
  });

  document.addEventListener("swiped-left", function () {
    CloseNav();
  });

  async function computeName() {
    var name = await Gun()
      .get(`~${localStorage.getItem("channel")}`)
      .get("info")
      .get("profile")
      .get("name")
      .then();

    document.querySelector("#channelName").innerHTML = name;
  }
  computeName();
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
        densewaire / <span id="channelName">loading..</span>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        on:click={ToogleNav}
      >
        <i class="fas fa-ellipsis-v" />
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
      {#if urlParams.has("s")}
        <div class="text-center">
          <img
            style="width: 100px !important;height: 100px;"
            src={`https://avatars.dicebear.com/api/identicon/${$username}.svg?backgroundColor=white`}
            alt="your avatar"
          />
        </div>
        <ListItem on:click={leaveSecretRoom}
          ><Icon path={mdiExitRun} /> Leave Secret Room</ListItem
        >
      {:else}
        {#if !$username}
          <div class="text-center">
            <img
              width="width: 100px !important; height: 100px;"
              src="/favicon.ico"
              alt=""
            />
          </div>
          <a href="/chat"><ListItem>Login</ListItem></a>
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
          <ListItem on:click={roomGen}
            ><Icon path={mdiKey} /> Create Secret Room</ListItem
          >
          <ListItem on:click={share_link}
            ><Icon path={mdiShare} /> Share Link</ListItem
          >
          <ListItem on:click={signout}
            ><Icon path={mdiLogout} />Sign Out</ListItem
          >
          <a href="/Settings"
            ><ListItem><Icon path={mdiCog} /> Settings</ListItem></a
          >
        {/if}
      {/if}
    </List>
  </NavigationDrawer>
</MaterialApp>
