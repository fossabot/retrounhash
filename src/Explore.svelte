<script>
    import Login from "./Login.svelte";
    import Post from "./comp/post.svelte";
    import {
        Card,
        CardText,
        CardTitle,
        ListItemGroup,
        CardActions,
        CardSubtitle,
        MaterialApp,
        Icon,
    } from "svelte-materialify";
    import { mdiPostOutline, mdiShareCircle } from "@mdi/js";
    import { user, username, db } from "./user.js";

    import Gun from "gun";

    //initialisation
    let posts = [];
    let isLoading = false;

    if (user.is) {
        db.user()
            .get("following")
            .once(async (data) => {
                isLoading = true;
                Object.entries(data).forEach(async (entry) => {
                    const [key, value] = entry;

                    await db
                        .get(`~${entry[1]}`)
                        .get("posts")
                        //.get("post")
                        //.get("all")
                        .map()
                        .once(async (data) => {
                            if (data.description.length >= 401) {
                            } else {
                                data.user = entry[0];
                                data.pub = entry[1];
                                data.date = Gun.state.is(data, "description");
                                posts = [data, ...posts];
                            }
                        })
                        .then(() => {
                            isLoading = false;
                        });
                });
            });
    }
</script>

{#if user.is}
    <div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardTitle class="h2">
                <Icon path={mdiPostOutline} size="30px" />
                Posts
            </CardTitle>
            <CardText>
                <ListItemGroup>
                    {#each posts as post}
                        <Post {post} />
                    {/each}
                </ListItemGroup>
            </CardText>
        </Card>
    </div>
{:else}
    <Login />
{/if}
