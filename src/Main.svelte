<script>
  import { Icon } from "svelte-materialify";

  import { mdiGithub, mdiTwitter } from "@mdi/js";
</script>

<div>
  <main style="min-height: 100vh;">
    <div
      style="display:flex;flex-wrap: wrap;justify-content:center;align-items:center;"
    >
      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">Decentralized</div>
          <figure>
            <img
              src="images/images-2-removebg-preview.png"
              alt="visual about decentralisation"
            />
          </figure>

          Your data in your hands. Synced among peers in real time. No one own
          the data of this application.

          <div class="m-2">
            <a href="/chat">
              <button class="btn btn-primary">Get Started</button>
            </a>
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">Send Images!</div>
          <figure>
            <img
              src="images/Hands - Favorite Image.png"
              alt="illustration of gallery "
            />
          </figure>
          <div>
            A picture is worth thousand words. Send pics fast, with end to end
            encryption 🔒!
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">Audio Message</div>
          <figure>
            <img
              src="images/The Band - Speaker 1.png"
              alt="illustration of a speaker "
            />
          </figure>
          <div>
            Send audio messages right from your browser! That too, end to end
            encrypted 🔒.
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">
            Private
          </div>
          <figure>
            <img src="images/cyber-security-illustration-concept-with-characters-data-security-protected-access-control-privacy-data-protection_269730-48-removebg-preview.png" alt="dipiction if privacy " />
          </figure>
          <div>
            the application is not relugated by a central authority, making it more private than any other application.
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">Open Source</div>
          <figure>
            <img src="images/open_source_symbol.png" alt="open source logo" />
          </figure>
          <div>
            The soutce code of this website is open to everyone! Protected by
            the GNU GPLv3.0. everyone is free to modify and distribute the
            software under certian conditions.
            <div class="m-2">
              <a href="//github.com/atordvairn/retrounhash">
                <button class="btn btn-primary"> See Source On GitHub </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="card w-96 bg-base-100 shadow-xl m-2">
        <div class="card-body">
          <div class="card-title">Markdown supported</div>
          <figure>
            <img
              src="images/choose-markdown-removebg-preview.png"
              alt="markdown illustration "
            />
          </figure>
          <div>
            Write formatted text as you write in any other application! *bold*
            _itallic_ `code`

            <div class="m-2">
              <a href="https://markdownguide.org/basic-syntax/">
                <button class="btn btn-primary"> Markdown Guide </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <img
          alt="two fiends talking"
          class="img w-full"
          src="images/Allura - Staying Home.png"
        />
      </div>
      <footer class="footer footer-center p-10 bg-primary text-primary-content">
        <div>
          <div class="w-32 text-center avatar">
            <img
              class="rounded w-32 mask mask-squircle"
              alt="logo"
              src="/images/favicon.png"
            />
          </div>
          <p class="font-bold">
            retrounhash <br />the decentralized application for encrypted
            communication.
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </div>
        <div>
          <div class="grid grid-flow-col gap-4">
            <a class="logo" href="//twitter.com/retrounhash">
              <Icon path={mdiTwitter} size="30px" />
            </a>
            <a class="logo" href="//github.com/atordvairn/retrounhash">
              <Icon path={mdiGithub} size="30px" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  </main>
</div>
