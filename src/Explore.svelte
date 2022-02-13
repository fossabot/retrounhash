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
    let isLoading = false;

    db.user()
        .get("following")
        .once(async (data) => {
            isLoading = true;
            Object.entries(data).forEach(async (entry) => {
                const [key, value] = entry;
                console.log(entry[0]);

                await db
                    .get(`~${entry[1]}`)
                    .get("posts")
                    //.get("post")
                    //.get("all")
                    .map()
                    .once(async (data) => {
                        data.user = entry[0];
                        posts = [data, ...posts];
                    })
                    .then(() => {
                        isLoading = false;
                    });
            });
        });
</script>

{#if $username}
    <MaterialApp>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardTitle class="h2">
                <Icon path={mdiPostOutline} size="30px" />
                Posts
            </CardTitle>
            <CardText>
                <ListItemGroup>
                    {#each posts as post}
                        <Card class="m-1">
                            <CardTitle>
                                <img
                                    src={`https://avatars.dicebear.com/api/identicon/${post.user}.svg?backgroundColor=white`}
                                    alt={`post by ${post.user}`}
                                    style="border-radius: 5px"
                                    class="m-1"
                                />
                                {post.user}
                            </CardTitle>
                            <CardText>
                                {post.description}
                            </CardText>
                        </Card>
                    {/each}
                </ListItemGroup>
            </CardText>
        </Card>
    </MaterialApp>
{:else}
    <Login />
{/if}
