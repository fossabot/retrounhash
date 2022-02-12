<script>
  import { user, db } from "./user";
  import {
    Button,
    TextField,
    Icon,
    Alert,
    MaterialApp,
  } from "svelte-materialify";

  let username;
  let password;

  function login(from_snup) {
    user.auth(username, password, ({ err }) => {
      if (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
      } else {
        if (from_snup) {
          db.user()
            .get("profile")
            .put({ name: username }, async () => {
              // register the user in a content addressed node
              const pub = db.user().is.pub;
              const hash = await SEA.work(pub, null, null, { name: "SHA-256" });
              await db
                .get("#user_catalogue_2")
                .get(hash)
                .put(pub)
                .then((ack) => {
                  console.log("cat gen", ack);
                });

              return;
            });
        }
        Swal.fire({
          icon: "success",
          title: "yay 🎉",
          text: "you're now logged in!",
        });
      }
    });
  }

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
      } else {
        login(true);
      }
    });
  }
</script>

<MaterialApp>
  <div class="container blur" style="padding: 20px;">
    <div class="form m-3 p-2 ">
      <div class="mb-3">
        <TextField
          name="Username"
          counter="20"
          bind:value={username}
          minlength="3"
          maxlength="20"
          placeholder="JhonDoe1989"
        >
          Username
        </TextField>
      </div>
      <div class="mb-3">
        <TextField
          name="Password"
          counter="8"
          minlength="8"
          placeholder="************"
          bind:value={password}
          type="password"
        >
          Password
        </TextField>
      </div>
      <Alert class="primary-text" text border="left">
        By signing up or login in you agree to our <a
          target="_blank"
          href="https://retrounhash.js.cool/termsOfUse.html">terms of service</a
        >
      </Alert>
      <Button on:click={login}>Login</Button>
      <Button on:click={signup}>Sign Up</Button>
    </div>
  </div>
</MaterialApp>
