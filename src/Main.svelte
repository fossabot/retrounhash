<script>
  import {
    CardTitle,
    Card,
    CardText,
    Button,
    CardActions,
    Icon,
    MaterialApp,
  } from "svelte-materialify";
  import { mdiGithub, mdiTwitter } from "@mdi/js";
</script>

<MaterialApp>
  <main style="min-height: 100vh;">
    <div
      style="display:flex;flex-wrap: wrap;justify-content:center;align-items:center;"
    >
      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/images-2-removebg-preview.png"
          alt="visual about decentralisation"
        />
        <CardText>
          <CardTitle>Decentralised</CardTitle>
          <p class="card-text">
            Your data in your hands. Synced among peers in real time. No one own
            the data of this application.
          </p>
        </CardText>
        <CardActions>
          <a href="/chat">
            <Button>Get Started</Button>
          </a>
        </CardActions>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/Hands - Favorite Image.png"
          alt="illustration of gallery "
        />
        <div>
          <CardTitle>Send Images!</CardTitle>
          <CardText>
            A picture is worth thousand words. Send pics fast, with end to end
            encryption 🔒!
          </CardText>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/The Band - Speaker 1.png"
          alt="illustration of a speaker "
        />
        <div>
          <CardTitle>Audio Message</CardTitle>
          <CardText>
            Send audio messages right from your browser! That too, end to end
            encrypted 🔒.
          </CardText>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/Hands - Pinch.png"
          alt="hand holding key"
        />
        <div>
          <CardTitle>Secret Room</CardTitle>
          <CardText>
            Want a link based room which no one can use exept you and your
            friends? We have got you covered!
          </CardText>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/open_source_symbol.png"
          alt="open source logo"
        />
        <div>
          <CardTitle>Open Source</CardTitle>
          <CardText>
            The soutce code of this website is open to everyone! Protected by
            the GNU GPLv3.0. everyone is free to modify and distribute the
            software under certian conditions.
          </CardText>
          <CardActions>
            <Button>
              <a href="//github.com/atordvairn/retrounhash">
                See Source On GitHub
              </a>
            </Button>
          </CardActions>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="images/choose-markdown-removebg-preview.png"
          alt="markdown illustration "
        />
        <div>
          <CardTitle>Markdown Supported</CardTitle>
          <CardText>
            Write formatted text as you write in any other application! *bold*
            _itallic_ `code`
          </CardText>
          <CardActions>
            <Button>
              <a href="https://markdownguide.org/basic-syntax/">
                Markdown Guide
              </a>
            </Button>
          </CardActions>
        </div>
      </Card>
    </div>
    <div class="text-center">
      <img
        alt="two fiends talking"
        class="img-fluid"
        src="images/Allura - Staying Home.png"
      />
    </div>
    <div class="text-center p-3">
      <a href="/chat">
        <Button>Login Or Register</Button>
      </a>
    </div>
    <div class="text-center footer" style="padding: 20px;margin: 10px;">
      <div class="h5" style="color: white;">
        <i class="far fa-copyright" /> retrounhash {new Date().getFullYear()}
      </div>
      <div>
        <a class="m-2" href="//github.com/atordvairn/retrounhash">
          <Icon path={mdiGithub} />
        </a>
        <a class="m-2" href="//twitter.com/atordvairn/">
          <Icon path={mdiTwitter} />
        </a>
      </div>
    </div>
  </main>
</MaterialApp>
