<script>
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
  import { user } from "./user";
</script>

<div class="app">
  <Route path="/">
    <Header />
    {#if user.is}
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
</div>
