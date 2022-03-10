<script>
    import Icon from 'mdi-svelte';
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
        Swal.fire({
            title: "delete the post ?",
            showCancelButton: true,
            confirmButtonText: "delete",
            cancelButtonText: "cancel",
            icon: "question",
        }).then((result) => {
            if (result.isConfirmed) {
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
                                icon: "success"
                            }).then(() => {
                                location.reload();
                            });
                        });
                });
            }
        });
    }
</script>

<div class="card mb-5 mt-5 w-full bg-base-00 shadow-xl">
    <div class="card-body">
        <div class="card-title">
            <a href={`/User/${post.pub}`} class="flex justify-center">
                <div class="avatar">
                    <div class="w-10 mask mask-squircle">
                        <img
                            src={`https://avatars.dicebear.com/api/identicon/${post.user}.svg?backgroundColor=white`}
                            alt={`${post.user}'s avatar`}
                        />
                    </div>
                </div>
                <span class="mt-2 ml-3">
                    {post.user}
                </span>
            </a>
        </div>
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
    </div>
    <div class="m-2 p-2">
        <div class="m-1">
            {new Date(post.date).toLocaleDateString()}- {new Date(
                post.date
            ).toLocaleTimeString()}
        </div>
        {#if $username == post.user}
            <span on:click={deletePost(post.uid)}>
                <Icon path={mdiTrashCan} />
            </span>
        {/if}
        {#if navigator.canShare}
            <span class="m-2" on:click={sharePost(post)}>
                <Icon path={mdiShareCircle} /> Share
            </span>
        {/if}
    </div>
</div>

<style>
    #img--main {
        aspect-ratio: auto;
        object-fit: cover;
    }
    a {
        text-decoration: none;
    }
</style>
