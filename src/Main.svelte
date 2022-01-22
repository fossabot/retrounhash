<script>
  import { CardTitle,  Card, CardText, Button, MaterialApp } from 'svelte-materialify';
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
          src="https://i.ibb.co/FztSPsx/images-2-removebg-preview.png"
          alt="icap"
        />
        <CardText>
          <CardTitle>Decentralised</CardTitle>
          <p class="card-text">
            Your data in your hands. Synced among peers in real time. No one own
            the data of this application.
          </p>
          <Button>
            <a href="/chat">
              Get Started
            </a>
          </Button>
        </CardText>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="Hands - Favorite Image.png"
          alt=""
        />
        <div>
          <CardTitle>
            Send Images!
          </CardTitle>
          <CardText>
            A picture is worth thousand words. Send pics fast, with end to end
            encryption 🔒!
          </CardText>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="The Band - Speaker 1.png"
          alt=""
        />
        <div>
          <CardTitle>
            Audio Message
          </CardTitle>
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
          src="Hands - Pinch.png"
          alt=""
        />
        <div>
          <CardTitle>
            Secret Room
          </CardTitle>
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
          src="https://img.search.brave.com/AiC2YO0DTyHD9Pq4YWQjl3Bmgt-weNxjVvBVfsTFrqM/fit/600/523/ce/1/aHR0cDovL3d3dy5w/bmdhbGwuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE2LzA2/L0NlbnNvcmVkLVN0/YW1wLnBuZw"
          alt=""
        />
        <div>
          <CardTitle>
            No Censorship
          </CardTitle>
          <CardText>
            As the application is managed by the users, Censorship is only
            possible if more than half or people agree on it.
          </CardText>
        </div>
      </Card>

      <Card outlined style="max-width:300px;margin: .6rem;">
        <img
          class="card-img"
          style="height: 100%;width: 100%;"
          src="https://i.ibb.co/d2Zt1yw/choose-markdown-removebg-preview.png"
          alt="Card ime cap"
        />
        <div>
          <CardTitle>
            Markdown Supporte
          </CardTitle>
          <CardText>
            Write formatted text as you write in any other application! *bold*
            _itallic_ `code`
          <Button>
            <a href="https://markdownguide.org/basic-syntax/">
              Markdown guide
            </a>
          </Button>
          <br />
         </CardText>
        </div>
      </Card>
    </div>
    <div class="text-center">
      <img alt="" class="img-fluid" src="Allura - Staying Home.png" />
    </div>
    <div class="text-center p-3">
      <Button>
        <a href="/chat">
          Login Or Register
        </a>
      </Button>
    </div>
    <div class="text-center" style="padding: 20px;margin: 10px;">
      <div class="h4" style="color: white;">
        <i class="far fa-copyright" /> densewaire 2022
      </div>
    </div>
  </main>
</MaterialApp>
