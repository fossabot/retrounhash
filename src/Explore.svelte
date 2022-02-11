<script>
    import Login from "./Login.svelte";
    import {
        Card,
        CardText,
        CardTitle,
        ListItemGroup,
        ListItem,
        MaterialApp,
        Icon,
    } from "svelte-materialify";
    import { mdiPostOutline } from "@mdi/js";
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

    let posts = [];
    db.user()
        .get("following")
        .once(async (data) => {
            Object.entries(data).forEach(async (entry) => {
                const [key, value] = entry;
                console.log(entry[1]);

                await db.get(`~${entry[1]}`)
                    .get("posts")
                    .get("post")
                    .get("all")
                    .map()
                    .once(async (data) => {
                        posts = [...posts, data];
                        console.log(data);
                    });
            });
        });

    db.user().auth(JSON.parse(sessionStorage.getItem("pair")), () => {
        db.user()
            .get("following")
            .put({
                key: "mqR2n3OX6oSbXhfc1BcyT10aw1WBDOSYEqiJUvSGmu8.8wqycy6OpZpHXcPtkabTtQQS1P5REIXhGxBsILPhD3U",
                lol: "iOGC5-QCpOtyLPXRHPA-hK0gyGmDUdBMogdwgUqP2c0.2-hjWktPzgIfgtVBgc0hXi3MeAFvliy4c6N6Uieu_Hw"
            });
    });
</script>

{#if $username}
    <MaterialApp>
        <div class="display-2 m-2 text-center" />
        <Card class="m-2">
            <CardTitle class="h2">
                <Icon path={mdiPostOutline} size="30px" />
                Posts
            </CardTitle>
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
                                no posts! go nd follow someone!
                            </div>
                        {/if}
                        {#each posts as post}
                            <Card class="m-1">
                                <CardTitle>
                                    {post.title}
                                </CardTitle>
                                <CardText>
                                    {post.description}
                                </CardText>
                            </Card>
                        {/each}
                    </div>
                </ListItemGroup>
            </CardText>
        </Card>
    </MaterialApp>
{:else}
    <Login />
{/if}
