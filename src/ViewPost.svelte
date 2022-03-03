<script>
    import Login from "./Login.svelte";
    import Post from "./comp/post.svelte";
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

    if (username) {
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .get(`~${pub}`)
                .get("alias")
                .then(async (username) => {
                    await db
                        .get(`~${pub}`)
                        .get("posts")
                        .get(uid)
                        .once(async (data) => {
                            data.user = username;
                            data.date = Gun.state.is(data, "description");
                            postData = data;
                            console.log(postData);
                        })
                        .then(() => {
                            postsReady = true;
                        });
                });
        });
    }
</script>

{#if $username}
    {#if postsReady}
        <div class="text-xl text-center">{postData.user}'s post</div>
        <Post post={postData} />
    {:else}
        <div class="m-2 display-4 text-center">Loading...</div>
    {/if}
{:else}
    <Login />
{/if}