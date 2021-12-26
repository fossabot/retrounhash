<script>
  import { user } from './user';

  let username;
  let password;

  function login() {
    user.auth(username, password, ({ err }) => {
     if (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err
      })
     }else{
      Swal.fire({
        icon: 'success',
        title: 'yay 🎉',
        text: "you're now logged in!"
      })
     }
    });
  }

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err
        })
      } else {
        login();
      }
    });
  }
</script>

<div class="container" style="padding: 20px;">
  <div class="form">
    <div class="mb-3">
      <label for="Username" class="form-label">Username</label>
      <input
        name="Username"
        class="form-control"
        bind:value={username}
        minlength="3"
        maxlength="16"
        style="backdrop-filter: blur(10px);background: transparent;color: white;"
      />
      <div class="form-text" style="color: white;">make it unique !</div>
    </div>
    <div class="mb-3">
      <label for="Password" class="form-label">Password</label>
      <input
        name="Password"
        class="form-control"
        bind:value={password}
        type="password"
        style="backdrop-filter: blur(10px);background: transparent;color: white;"
      />
      <div class="form-text" style="color: white;">
        a strong password will help
      </div>
    </div>
    <button class="btn btn-primary" on:click={login}>Login</button>
    <button class="btn btn-primary" on:click={signup}>Sign Up</button>
  </div>
</div>
