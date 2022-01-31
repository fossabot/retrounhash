<script>
    import Login from "./Login.svelte";
    import {
        Card,
        CardText,
        CardTitle,
        ListItemGroup,
        ListItem,
        MaterialApp,
    } from "svelte-materialify";
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
            if (arr[i] === item) arr.splice(i, 1);
        }
    }

    let data;
    function returnNull(pubb) {
        db.get(`~${pubb}`)
            .get("info")
            .get("profile")
            .get("name")
            .once((_data) => {
                console.log(_data);
                data = _data;
            });

            return data;
    }
</script>

{#if $username}
    <MaterialApp>
        <div class="display-2 m-2 text-center" />
        <Card class="m-2">
            <CardTitle class="h2">Chats</CardTitle>
            <CardText>
                <ListItemGroup>
                    <div>
                        {#if !localStorage.getItem("items") || localStorage.getItem("items") == "[]"}
                            <div class="text-center">
                                <img
                                    class="img-fluid"
                                    src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-concept-3428212-2902554.png"
                                    alt=""
                                />
                            </div>
                            <div class="text-center m-3 h3">
                                no rooms, yet! Go and make one !
                            </div>
                        {/if}
                        {#each items as item, i (item)}
                            <a href={`/room?c=${item}`}>
                                <ListItem>
                                    {returnNull(item)}
                                </ListItem>
                            </a>
                        {/each}
                    </div>
                </ListItemGroup>
            </CardText>
        </Card>
    </MaterialApp>
{:else}
    <Login />
{/if}
