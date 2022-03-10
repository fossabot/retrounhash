<script>
    import Login from "./Login.svelte";
    import Post from "./comp/post.svelte";
    import Icon from "mdi-svelte";
    import { mdiPostOutline } from "@mdi/js";
    import { user, username, db } from "./user.js";

    import Gun from "gun";
    export var embed;

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
    
    let widthCard;
    if (embed) {
        widthCard = "96";
    } else {
        widthCard = "full";
    }
</script>

{#if user.is}
    <div>
        <div class="card mb-5 mt-5 w-{widthCard} rounded-m shadow-xl">
            <div class="card-body">
                {#if !embed}
                    <div class="card-title text-center">
                        <Icon path={mdiPostOutline} size="30px" />
                        <div class="text-xl regular-case">Posts</div>
                    </div>
                {/if}
                {#each posts as post}
                    <Post {post} />
                {/each}
                <div class="m-2 p-1 text-xl text-center text-center">
                    <hr />
                    Follow more people to see their posts.
                </div>
            </div>
        </div>
    </div>
{:else}
    <Login />
{/if}
