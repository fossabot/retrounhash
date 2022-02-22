<script>
  import { user, db } from "./user";
  import { Button, TextField, Card, Alert } from "svelte-materialify";
  import Swal from "sweetalert2";

  let username;
  let password;
  let userName;
  let isLoading = false;

  const toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    timer: 3000,
    timerProgressBar: true,
    showCancelButton: false,
    showConfirmButton: false,
  });

  function login(from_snup) {
    localStorage.setItem("recently_snup", "true");
    isLoading = true;
    user.auth(username, password, ({ err }) => {
      if (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
        isLoading = false;
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
                .then(async (ack) => {
                  await db
                    .get(`~${pub}`)
                    .get("alias")
                    .once((data) => {
                      userName = data;
                    })
                    .then(() => {
                      db.user().auth(
                        JSON.parse(sessionStorage.getItem("pair")),
                        async () => {
                          await db
                            .user()
                            .get("following")
                            .once(async (data = {}) => {
                              data[userName] = pub;
                              db.user().get("following").put(data);
                            })
                            .then(async () => {
                              isLoading = false;
                            });
                        }
                      );
                    });
                });
            });
        }
        toast.fire({
          title: "logged in",
        });

        isLoading = false;
      }
    });
  }

  function signup() {
    isLoading = true;
    user.create(username, password, ({ err }) => {
      if (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
        isLoading = false;
      } else {
        login(true);
      }
    });
  }

  if (localStorage.getItem("keys")) {
    db.user().auth(JSON.parse(localStorage.getItem("keys")), () => {
      toast.fire({
        title: "logged in"
      })
    });
  }
</script>

<div>
  <Card bind:disabled={isLoading} bind:loading={isLoading}>
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
            href="https://retrounhash.js.cool/termsOfUse.html"
            >terms of service</a
          >
        </Alert>
        <Button on:click={login}>Login</Button>
        <Button on:click={signup}>Sign Up</Button>
      </div>
    </div>
  </Card>
</div>
