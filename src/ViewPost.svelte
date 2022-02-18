<script>
    import {
        Card,
        CardText,
        Button,
        Icon,
        MaterialApp,
        CardActions,
        CardSubtitle,
        CardTitle,
    } from "svelte-materialify";
    import Login from "./Login.svelte";

    import { mdiShareCircle } from "@mdi/js";

    import { db, user, username } from "./user.js";
    export var pub;
    export var uid;

    //initialisation
    let postData = {
        user: "",
        date: "",
        description: "",
        time: "",
    };
    let postsReady = false;

    if ($username) {
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .get(`~${pub}`)
                .get("alias")
                .once((data) => {})
                .then(async (username) => {
                    await db
                        .get(`~${pub}`)
                        .get("posts")
                        //.get("post")
                        //.get("all")
                        .get(uid)
                        .once(async (data) => {
                            data.user = username;
                            postData = data;
                        })
                        .then(() => {
                            postsReady = true;
                        });
                });
        });
    }

    function sharePost(post) {
        navigator.share({
            title: `${postData.user}'s post on retrounhash!`,
            text: `${postData.description}`,
            url: `/Post/${post.pub}/${post.uid}`,
        });
    }
</script>

{#if $username}
    <div>
        <main>
            {#if postsReady}
                <div class="h2 m-2 text-center">{postData.user}'s post</div>
                <Card class="m-1">
                    <CardTitle>
                        <a href={`/User/${postData.pub}`}>
                            <img
                                src={`https://avatars.dicebear.com/api/identicon/${postData.user}.svg?backgroundColor=white`}
                                alt={`${postData.user}'s avatar`}
                                style="border-radius: 5px;"
                                class="m-1"
                            />
                            {postData.user}
                        </a>
                    </CardTitle>
                    <CardText>
                        {postData.description}
                    </CardText>
                    <CardSubtitle>
                        {new Date(postData.date).toLocaleDateString()}- {new Date(
                            postData.date
                        ).toLocaleTimeString()}

                        {#if navigator.canShare}
                            <div class="m-2" on:click={sharePost(postData)}>
                                <Icon path={mdiShareCircle} /> Share
                            </div>
                        {/if}
                    </CardSubtitle>
                </Card>
            {:else}
                <div class="m-2 display-4 text-center">Loading...</div>
            {/if}
        </main>
    </div>
{:else}
    <Login />
{/if}
