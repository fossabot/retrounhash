<script>
  import { username, user } from './user';
  import { TextField, Button } from "smelte";
  import jq from "jquery";
  const urlParams = new URLSearchParams(window.location.search);

  function signout() {
    user.leave();
    username.set('');
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

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
        icon: 'success',
        title: 'link copied!'
      })
  }

  function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }

  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    location.reload();
  }
   
  function closeNavNoSave() {
    document.getElementById("myNav").style.width = "0%";
  }


  async function initRoom(){
    await Swal.fire({
      title: 'Enter the room to join or create',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'join',
      showLoaderOnConfirm: true,
      preConfirm: (NameOfTheRoom) => {
        localStorage.setItem("channel", NameOfTheRoom);
        location.href = "/chat";
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }
  if(urlParams.has('c')){
    var channel = urlParams.get('c');
    localStorage.setItem("channel", channel);
    Toast.fire({
        icon: 'success',
        title: 'joined ' + channel + '!'
      })
  }else{
    var channel = localStorage.getItem("channel") || "chat";
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
</script>
<br><br><br><br>
<nav class="navbar navbar-dark fixed-top bg-primary">
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
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      {#if $username}
        <li class="nav-item m-2">
         <button class="btn btn-primary" on:click={openNav}><i class="fas fa-cog"></i> settings</button>
        </li>
        <li class="nav-item m-2">
         <button class="btn btn-info" on:click={initRoom}><i class="fas fa-door-open"></i> join or create room</button>
        </li>
        <li class="nav-item m-2">
         <button class="btn btn-info" on:click={share_link}><i class="fas fa-copy"></i> share room link</button>
        </li>
        <li class="nav-item m-2">
         <button class="btn btn-danger" on:click={signout}><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </li>
      {:else}
        <li class="nav-item m-2">
         <a class="btn btn-primary" href="/chat"><i class="fas fa-sign-in-alt"></i> Login</a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<div id="myNav" class="overlay" style="color: white;">
  <a href="#" class="closebtn" on:click={closeNavNoSave}>&times;</a>
  <div class="overlay-content">
    <div class="m-3 h4 p-3">
      <i class="fas fa-cog"></i>
      SETTINGS
    </div>
    <div class="m-3 p-3">
     <div class="m-3 h6">
       Show auto scroll ?
     </div>
      {@html
        `<button class='btn btn-success' onclick="localStorage.setItem('autoscroll', 'yes')">yes</button>
        <button class='btn btn-danger' onclick="localStorage.setItem('autoscroll', 'no')">no</button>`
      }
    </div>
    <div class="m-3 p-3">
     <div class="m-3 h6">
      Set custom secret key ?
     </div>
      {@html
        `
          <input class="form-control" type="text" name="encryption" id="encryption" onchange="localStorage.setItem('_secret', this.value);" placeholder="my_secret" maxlength="12" minlength="3" />
          <small class="form-text">Someone having the same secret key would be able to see your messages. Other people won't.</small>
          <button class="btn btn-primary" onclick='localStorage.setItem("_secret", "#foo");location.reload();'>
            reset and set me visible
          </button>
        `
      }
    </div>
    

    <div class="m-3 p-3">
     <div class="m-3 h6" on:click={closeNav}>
      Save Settings
     </div>
    </div>

  </div>
</div>
