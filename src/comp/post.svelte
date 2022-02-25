<script>
    import {
        Card,
        CardActions,
        CardSubtitle,
        CardText,
        CardTitle,
        Icon,
    } from "svelte-materialify";
    import { mdiShareCircle, mdiTrashCan } from "@mdi/js";
    import { username, db } from "../user";
    import Swal from "sweetalert2";

    export var post;

    function sharePost(post) {
        navigator.share({
            text: `Hey!, come and see ${post.user}'s post on retorunhash !`,
            url: `/Post/${post.pub}/${post.uid}`,
        });
    }

    async function deletePost(uid) {
        console.log("called", uid);
        var userKeys = JSON.parse(sessionStorage.getItem("pair"));
        db.user().auth(userKeys, async () => {
            await db
                .user()
                .get("posts")
                .get(uid)
                .put(null)
                .then(async () => {
                    await Swal.fire({
                        title: "deleted",
                    }).then(() => {
                        location.reload();
                    });
                });
        });
    }
</script>

<Card class="m-1">
    <CardTitle>
        <a href={`/User/${post.pub}`}>
            <img
                src={`https://avatars.dicebear.com/api/identicon/${post.user}.svg?backgroundColor=white`}
                alt={`${post.user}'s avatar`}
                style="border-radius: 3.5px !important;width: 40px !important;height: 40px !important;"
                class="m-1"
            />
            {post.user}
        </a>
    </CardTitle>
    <CardText>
        {#if post.img}
            <div class="text-center">
                <a href={`/Post/${post.pub}/${post.uid}`}>
                    <img
                        src={post.img}
                        alt=""
                        class="img-fluid"
                        id="img--main"
                    />
                    <div class="text-center m-2 p-1">
                        {post.description}
                    </div>
                </a>
            </div>
        {:else}
            <a href={`/Post/${post.pub}/${post.uid}`}>
                {post.description}
            </a>
        {/if}
    </CardText>
    <CardSubtitle>
        {new Date(post.date).toLocaleDateString()}- {new Date(
            post.date
        ).toLocaleTimeString()}
        {#if navigator.canShare}
            <div class="m-2" on:click={sharePost(post)}>
                <Icon path={mdiShareCircle} /> Share
            </div>
        {/if}
    </CardSubtitle>
    <CardActions class="m-2 p-2">
        {#if $username == post.user}
            <div on:click={deletePost(post.uid)}>
                <Icon path={mdiTrashCan} />
            </div>
        {/if}
    </CardActions>
</Card>

<style>
    #img--main {
        aspect-ratio: auto;
        object-fit: cover;
    }
    a {
        text-decoration: none;
    }
</style>
