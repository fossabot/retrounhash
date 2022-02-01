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
</div>
