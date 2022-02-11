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

    //initialisation
    let posts = [];
    let noPosts;

    db.user()
        .get("following")
        .once(async (data) => {
            Object.entries(data).forEach(async (entry) => {
                const [key, value] = entry;
                console.log(entry[0]);

                if (entry[0] == "#" || entry[0] == "_" || entry[0] == ">" ) {
                    noPosts = true;
                } else {
                    noPosts = false;
                }

                await db
                    .get(`~${entry[1]}`)
                    .get("posts")
                    .get("post")
                    .get("all")
                    .map()
                    .once(async (data) => {
                        posts = [data, ...posts];
                        console.log(data);
                    });
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
                        {#if noPosts}
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
