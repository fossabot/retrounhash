<script>
  import { username, user } from './user';
  import { TextField, Button } from "smelte";


  function signout() {
    user.leave();
    username.set('');
  }

  function openNav() {
    document.getElementById("myNav").style.width = "100%";
  }

  function closeNav() {
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
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
    location.reload();
  }

  var channel = localStorage.getItem("channel") || "chat";
</script>
<br><br><br><br>
<nav class="navbar navbar-dark fixed-top bg-primary">
 <div class="container-fluid">
    <a class="navbar-brand" href="/">
      {#if $username}
        <img
          src={`https://avatars.dicebear.com/api/identicon/${$username}.svg`}
          alt="logo_user"
          width="30"
          height="30"
          class="d-inline-block align-text-top"
        />
      {:else}
        <img
          src="/favicon.png"
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
         <button class="btn btn-danger" on:click={signout}><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </li>
      {:else}
        <li class="nav-item m-2">
         <a class="btn btn-primary" href="/login"><i class="fas fa-sign-in-alt"></i> Login</a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<div id="myNav" class="overlay">
  <a href="javascript:void(0)" class="closebtn" on:click={closeNav}>&times;</a>
  <div class="overlay-content">
    <div class="m-3 p-3">
       
    </div>
  </div>
</div>
