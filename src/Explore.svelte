<script>
    import Login from "./Login.svelte";
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

    function sharePost(post) {
        navigator.share({
            text: `Hey!, come and see ${post.user}'s post on retorunhash !`,
            url: `/Post/${post.pub}/${post.uid}`,
        });
    }
</script>

{#if user.is}
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
                                <a href={`/User/${post.pub}`}>
                                    <img
                                        src={`https://avatars.dicebear.com/api/identicon/${post.user}.svg?backgroundColor=white`}
                                        alt={`${post.user}'s avatar`}
                                        style="border-radius: 5px;"
                                        class="m-1"
                                    />
                                    {post.user}
                                </a>
                            </CardTitle>
                            <CardText>
                                <a href={`/Post/${post.pub}/${post.uid}`}>
                                    {post.description}
                                </a>
                            </CardText>
                            <CardSubtitle>
                                {new Date(post.date).toLocaleDateString()}- {new Date(
                                    post.date
                                ).toLocaleTimeString()}
                                <div class="m-2" on:click={sharePost(post)}>
                                    <Icon path={mdiShareCircle} /> Share
                                </div>
                            </CardSubtitle>
                        </Card>
                    {/each}
                </ListItemGroup>
            </CardText>
        </Card>
    </MaterialApp>
{:else}
    <Login />
{/if}
