<script>
  import { username, user } from './user';

  function signout() {
    user.leave();
    username.set('');
  }
</script>
<br><br><br><br>
<nav class="navbar navbar-dark fixed-top bg-primary">
 <div class="container-fluid">
    <a class="navbar-brand" href="/">
      {#if $username}
        <img
          src={`https://avatars.dicebear.com/api/big-smile/${$username}.svg`}
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
      <span class="text-center h6">densewaire</span>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      {#if $username}
        <li class="nav-item">
         <button class="btn btn-danger" on:click={signout}>Sign Out 🚪</button>
        </li>
      {:else}
        <li class="nav-item">
         <a class="btn btn-primary" href="/login">Login 🔐</a>
        </li>
      {/if}
    </ul>
  </div>
</nav>
