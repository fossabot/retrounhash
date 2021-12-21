<script>
  import { user } from './user';

  let username;
  let password;

  function login() {
    user.auth(username, password, ({ err }) => err && alert(err));
  }

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
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
      <div class="form-text">we don't need your email.</div>
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
      <div class="form-text">
        by clicking sign-up, you're agreeing to our <a
          href="https://unsign.vercel.app/terms_of_service.html"
          >terms of service</a
        >
        <br />
        see out <a href="/privacy">privacy policy</a> too.
      </div>
    </div>
    <button class="btn btn-primary" on:click={login}>Login</button>
    <button class="btn btn-primary" on:click={signup}>Sign Up</button>
  </div>
</div>
