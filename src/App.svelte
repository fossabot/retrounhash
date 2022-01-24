<script>
  import Chat from "./Chat.svelte";
  import Header from "./Header.svelte";
  import { Route } from "tinro";
  import Main from "./Main.svelte";
  import Account from "./Account.svelte";
  import Settings from "./Settings.svelte"
  import { user } from "./user";
</script>

<div class="app">
  <Route path="/">
    <Header />
    {#if user.is}
      <Chat />
    {:else}
      <Main />
    {/if}
  </Route>
  <Route path="/chat">
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
</div>
