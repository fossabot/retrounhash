<script>
    import {
        Card,
        CardActions,
        CardSubtitle,
        CardText,
        CardTitle,
        Icon,
    } from "svelte-materialify";
    import { mdiShareCircle } from "@mdi/js";

    export var post;

    function sharePost(post) {
        navigator.share({
            text: `Hey!, come and see ${post.user}'s post on retorunhash !`,
            url: `/Post/${post.pub}/${post.uid}`,
        });
    }
</script>

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
        {#if post.img}
            <img
                src={post.img}
                alt=""
                class="img-fluid"
                id="img--main"
            />
            <div class="text-center m-2 p-1">
                {post.description}
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
</Card>
<style>
    #img--main{
        aspect-ratio: auto;
    }
</style>