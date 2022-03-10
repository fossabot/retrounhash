<script>
  import { user, db } from "./user";
  import Swal from "sweetalert2";
  import { word } from "minifaker";
  import "minifaker/locales/en";

  import { mdiEye, mdiEyeOff, mdiReload } from "@mdi/js";
  let username;
  let password;
  let passwordType = "password";
  let userName;
  let eyeIcon = mdiEye;
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
        title: "logged in",
      });
    });
  }

  function tooglePassSeen() {
    if (passwordType === "password") {
      passwordType = "text";
      eyeIcon = mdiEyeOff;
    } else {
      passwordType = "password";
      eyeIcon = mdiEye;
    }
  }

  function generateUsername() {
    username = word({ type: "adjective" }) + "-" + word({ type: "noun" });
  }
</script>

<div class="w-full p-4 text-center">
  <div class="card m-4 bg-base-100 shadow-xl text-center">
    <div class="p-2">
      <div class="form m-3 p-2 ">
        <div class="mb-3">
          <input
            name="Username"
            class="input input-bordered input-success w-full"
            bind:value={username}
            minlength="3"
            maxlength="20"
            placeholder="Mark Willson"
          />
          <!--span on:click={generateUsername}>
            <Icon path={mdiReload} />
          </span-->
        </div>
        <div class="mb-3">
          <input
            class="input input-bordered input-success w-full"
            name="Password"
            placeholder="************"
            bind:value={password}
            type="password"
          />
          <!--span on:click={tooglePassSeen}>
            <Icon bind:path={eyeIcon} />
          </span-->
        </div>
        <div class="text-center">
          <div class="alert alert-success w-100 shadow-lg mb-2">
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
              <span>
                By signing up or login in you agree to our
                <a
                  class="underlined"
                  target="_blank"
                  href="https://retrounhash.js.cool/termsOfUse.html"
                  >terms of service</a
                >
              </span>
            </div>
          </div>
        </div>
        <div class="text-left">
          <button class="btn btn-primary m-2" on:click={login}>Login</button>
          <button class="btn btn-secondary m-2" on:click={signup}
            >Sign Up</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
