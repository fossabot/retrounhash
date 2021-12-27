<script>
  import Chat from './Chat.svelte';
  import Header from './Header.svelte';
  import { Route } from "tinro";
  import Main from "./Main.svelte";
</script>

<div class="app">
  <Route path="/">
    <Header />
    <Main />
  </Route>
  <Route path="/chat">
    <Header />
    <Chat />
  </Route>
</div>
