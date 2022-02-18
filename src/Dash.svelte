<script>
    import Login from "./Login.svelte";
    import {
        Card,
        CardText,
        CardTitle,
        ListItemGroup,
        ListItem,
        Icon,
        Tabs,
        Tab,
        Window,
        WindowItem,
        AppBar,
    } from "svelte-materialify";
    import { mdiChatOutline, mdiDotsCircle } from "@mdi/js";
    import { user, username, db } from "./user.js";

    let items = JSON.parse(localStorage.getItem("items") || "[]");
    function addItem(pub) {
        items = [...items, pub]; //{ name: name, pubKeyRoom: pub}];
    }

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    function remove(arr, item) {
        for (var i = arr.length; i--; ) {
            if (arr[i] === item) arr.Dashsplice(i, 1);
        }
    }

    let data;
    let mainData;
    async function returnNull(pubb) {
        mainData = await db
            .get(`~${pubb}`)
            .get("info")
            .get("profile")
            .get("name")
            .then(async (_data) => {
                data = _data;
                return data;
            });

        return mainData;
    }

    let val = 0;
</script>

{#if $username}
    <AppBar>
        <div slot="title">
            Dashboard
        </div>
        <div slot="extension">
            <Tabs class="green-text" bind:value={val} fixedTabs>
                <div slot="tabs">
                    <Tab>
                        <Icon path={mdiChatOutline} />
                        Chats
                    </Tab>
                    <Tab>
                        <Icon path={mdiDotsCircle} />
                        pērsona
                    </Tab>
                </div>
            </Tabs>
        </div>
    </AppBar>
    <Window value={val}>
        <WindowItem>
            <ListItemGroup class="p-3">
                {#if !localStorage.getItem("items") || localStorage.getItem("items") == "[]"}
                    <div class="text-center">
                        <img
                            class="img-fluid"
                            src="images/empty-state-concept-3428212-2902554.png"
                            alt=""
                        />
                    </div>
                    <div class="text-center m-3 h3">
                        no rooms, yet! Go and make one !
                    </div>
                {/if}
                {#each items as item, i (item)}
                    {#await returnNull(item)}
                        <ListItem>loading....</ListItem>
                    {:then name}
                        <a href={`/room?c=${item}`}>
                            <ListItem>
                                {name}
                            </ListItem>
                        </a>
                    {/await}
                {/each}
            </ListItemGroup>
        </WindowItem>
        <WindowItem>Persona</WindowItem>
    </Window>
{:else}
    <Login />
{/if}
