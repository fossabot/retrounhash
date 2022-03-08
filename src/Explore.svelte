<script>
    import Login from "./Login.svelte";
    import Post from "./comp/post.svelte";
    import {
        Icon,
    } from "svelte-materialify";
    import { mdiPostOutline } from "@mdi/js";
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
        <div class="card mb-5 mt-5 w-full rounded-m shadow-xl">
            <div class="card-body">
                <div class="card-title text-center">
                    <Icon path={mdiPostOutline} size="30px" />
                    <div class="text-xl regular-case">
                        Posts
                    </div>
                </div>
                {#each posts as post}
                    <Post {post} />
                {/each}
                <div class="m-2 p-1">
                    <hr />
                    Follow more people to see their posts.
                </div>
            </div>
        </div>
    </div>
{:else}
    <Login />
{/if}
