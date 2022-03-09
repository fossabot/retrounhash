<script>
  import { MaterialApp } from "svelte-materialify";
  import Chat from "./Chat.svelte";
  import Header from "./Header.svelte";
  import { Route } from "tinro";
  import Main from "./Main.svelte";
  import Account from "./Account.svelte";
  import Settings from "./Settings.svelte";
  import Create from "./Create.svelte";
  import Dash from "./Dash.svelte";
  import About from "./About.svelte";
  import Post from "./Post.svelte";
  import Explore from "./Explore.svelte";
  import Profile from "./Profile.svelte";
  import Search from "./Search.svelte";
  import ViewPost from "./ViewPost.svelte";
  import Following from "./Following.svelte";
  import { username, user, db } from "./user";

  let theme = "light";

  if (localStorage.getItem("theme") == "true") {
    theme = "dark";
  } else {
    theme = "light";
  }

  /*window.onbeforeunload = function () {
    db.user().get("online").put(false);

    return confirm("close?");
  };*/

  window.addEventListener("blur", () => {
    db.user().get("online").put(false);
  });

  window.addEventListener("focus", () => {
    db.user().get("online").put(true)
  });

  db.user().get("online").put(true);

setInterval(() => {
  db.user().get("lastSeen").put(new Date().toLocaleString())
}, 1000);
</script>

<div  style="min-height: 100vh;">
  <MaterialApp {theme} class={``}>
    <!--{#if $username}-->
    <div class="app">
      <Route path="/">
        <Header />
        {#if $username}
          <Dash />
        {:else}
          <Main />
        {/if}
      </Route>
      <Route path="/chat">
        <Header />
        <Dash />
      </Route>
      <Route path="/room">
        <Header />
        <Chat />
      </Route>
      <Route path="/Account">
        <Header />
        <Account />
      </Route>
      <Route path="/Settings">
        <Header />
        <Settings />
      </Route>
      <Route path="/Create">
        <Header />
        <Create />
      </Route>
      <Route path="/About">
        <Header />
        <About />
      </Route>
      <Route path="/Post">
        <Header />
        <Post />
      </Route>
      <Route path="/Explore">
        <Header />
        <Explore />
      </Route>
      <Route path="/User/:pubKey/*" let:meta>
        <Header />
        <Profile pub={meta.params.pubKey} />
      </Route>
      <Route path="/Search">
        <Header />
        <Search />
      </Route>
      <Route path="/Post/:pubKey/:uid/*" let:meta>
        <Header />
        <ViewPost pub={meta.params.pubKey} uid={meta.params.uid} />
      </Route>
      <Route path="/:publicKey/Following/*" let:meta>
        <Header />
        <Following pub={meta.params.publicKey} />
      </Route>
    </div>
    <!--{:else}
      <Header />
      <Route path="/">
        <Main />
      </Route>
      <Route path="/chat">
        <Dash />
      </Route>
    {/if}-->
  </MaterialApp>
</div>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
