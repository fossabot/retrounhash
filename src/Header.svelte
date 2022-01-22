<script>
  import { username, user } from "./user";
  import { TextField } from "smelte";
  import jq from "jquery";
  const urlParams = new URLSearchParams(window.location.search);

  import { Button, MaterialApp } from "svelte-materialify";

  function signout() {
    user.leave();
    username.set("");
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

  function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }

  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    location.href = "/chat";
  }

  function closeNavNoSave() {
    document.getElementById("myNav").style.width = "0%";
  }

  async function initRoom() {
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
        location.href = "/chat";
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  function roomGen() {
    var secret_channel = Math.random().toString(36).substr(4, 10);
    var sKEY = Math.random().toString(36).substr(4, 5);
    jq("body").append('<input id="copyURL" type="text" value="" />');
    jq("#copyURL")
      .val(
        window.location.protocol +
          "//" +
          window.location.hostname +
          "/chat?c=" +
          secret_channel +
          "&s=" +
          sKEY
      )
      .select();
    document.execCommand("copy");
    jq("#copyURL").remove();

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
    localStorage.setItem("_secret", "#foo");
    location.href = "/chat?c=chat";
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

  function dontShowPopupPwa() {
    localStorage.setItem("dontShowPopupPwa", "true");
    location.reload();
  }
</script>

<MaterialApp>
  <br /><br /><br />
  <nav class="navbar navbar-dark fixed-top blur" style="color: white;">
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
      <div class="text-center h5">densewaire / {channel}</div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          {#if $username}
            {#if !urlParams.has("s")}
              <li class="nav-item m-2">
                <Button on:click={openNav}
                  ><i class="fas fa-cog" /> settings</Button
                >
              </li>
              <li class="nav-item m-2">
                <Button on:click={initRoom}
                  ><i class="fas fa-door-open" /> join or create room</Button
                >
              </li>
              <li class="nav-item m-2">
                <Button on:click={roomGen}
                  ><i class="fas fa-user-secret" /> create secret room</Button
                >
              </li>
              <li class="nav-item m-2">
                <Button on:click={share_link}
                  ><i class="fas fa-copy" /> share room link</Button
                >
              </li>
              <li class="nav-item m-2">
                <Button on:click={signout}
                  ><i class="fas fa-sign-out-alt" /> Sign Out</Button
                >
              </li>
            {:else}
              <li class="nav-item m-2">
                <Button on:click={leaveSecretRoom}
                  ><i class="fas fa-user-secret" /> leave secret room</Button
                >
              </li>
            {/if}
          {:else if !urlParams.has("s")}
            <li class="nav-item m-2">
              <Button>
                <a href="/chat"
                  ><i class="fas fa-sign-in-alt" /> Login</a
                >
              </Button>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </nav>

  <div id="myNav" class="overlay" style="color: white;">
    <a href="#" class="closebtn" on:click={closeNavNoSave}>&times;</a>
    <div class="overlay-content">
      <div class="m-3 h4 p-3">
        <i class="fas fa-cog" />
        SETTINGS
      </div>
      <div class="m-3 p-3">
        <div class="m-3 h6">Show auto scroll ?</div>
        {@html `<button class='btn btn-success' onclick="localStorage.setItem('autoscroll', 'yes')">yes</button>
        <button class='btn btn-danger' onclick="localStorage.setItem('autoscroll', 'no')">no</button>`}
      </div>
      <div class="m-3 p-3">
        <div class="m-3 h6">Set custom secret key ?</div>
        {@html `
          <input class="form-control" type="text" name="encryption" id="encryption" onchange="localStorage.setItem('_secret', this.value);" placeholder="my_secret" maxlength="12" minlength="3" />
          <small class="form-text">Someone having the same secret key would be able to see your messages. Other people won't.</small>
          <button class="btn btn-primary" onclick='localStorage.setItem("_secret", "#foo");location.reload();'>
            reset and set me visible
          </button>
        `}
      </div>
      {#if !window.matchMedia("(display-mode: standalone)").matches}
        <div class="m-3 p-3">
          <div class="m-3 h6">Install as web app!</div>
          <button class="btn btn-success" on:click={installPwa}>
            INSTALL
          </button>
          {#if localStorage.getItem("dontShowPopupPwa") !== "true"}
            <button class="btn btn-danger" on:click={dontShowPopupPwa}>
              Do not show popup again
            </button>
          {/if}
        </div>
      {/if}

      <div class="m-3 p-3">
        <div class="m-3 h6" on:click={closeNav}>Save Settings</div>
      </div>
    </div>
  </div>
</MaterialApp>
