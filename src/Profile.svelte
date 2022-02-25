<script>
    import {
        Card,
        CardText,
        Button,
        MaterialApp,
        CardActions,
        CardSubtitle,
        CardTitle,
    } from "svelte-materialify";
    import { db, username } from "./user.js";
    import Post from "./comp/post.svelte";
    export var pub;

    import Swal from "sweetalert2";

    //initialisation
    let isFollowing;
    let userName;
    let userAvatar;
    let isLoading = false;
    let isLoading2 = false;
    let posts = [];

    async function follow() {
        isLoading = true;
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    data[userName] = pub;
                    db.user().get("following").put(data);
                })
                .then(async () => {
                    isLoading = false;
                });
        });
        isFollowing = true;
    }

    if (username) {
        db.get(`~${pub}`)
            .get("alias")
            .once((data) => {
                if (data == undefined) {
                    Swal.fire({
                        title: "invalid url",
                        text: "the url you have entered is incorrect! please try again",
                        icon: "error",
                        preConfirm: () => {
                            location.href = "/";
                        },
                    });
                }
                userName = data;
                userAvatar = `https://avatars.dicebear.com/api/identicon/${data}.svg?backgroundColor=white`;
            });

        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            isLoading = true;
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    if (data[userName] == null || data[userName] == undefined) {
                        isFollowing = false;
                    } else {
                        isFollowing = true;
                    }
                })
                .then(async () => {
                    isLoading = false;
                });
        });

        db.get(`~${pub}`)
            .get("posts")
            //.get("post")
            //.get("all")
            .map()
            .once(async (data) => {
                if (data.description.length >= 401) {
                } else {
                    isLoading2 = true;
                    data.user = userName;
                    data.pub = pub;
                    posts = [data, ...posts];
                }
            })
            .then(() => {
                isLoading2 = false;
            });
    }

    async function unfollow() {
        isLoading = true;
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    delete data[userName];
                    db.user().get("following").put(data);
                })
                .then(async () => {
                    isLoading = false;
                });
        });
        isFollowing = false;
    }
</script>

<div>
    <main>
        <div class="h2 m-2 text-center">User's profile</div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardText class="text-center">
                <img
                    style="border-radius: 3.5px !important;width: 40px !important;height: 40px !important;"
                    src={userAvatar}
                    alt="userAvatar"
                    id="userAvatar"
                    class="m-2"
                />
                <br />
                <span class="h2">
                    {userName}
                </span>
                <div class="m-3">
                    You will see the user's posts in the explore setion atter
                    you follow him.
                </div>
            </CardText>
            <CardActions>
                {#if !isFollowing}
                    <Button on:click={follow}>follow</Button>
                {:else}
                    <Button on:click={unfollow}>Unfollow</Button>
                {/if}
            </CardActions>
        </Card>
        <br />
        <Card class="m-2">
            <div class="m-2 p-2 h3">User's posts:</div>
            {#each posts as post}
                <Post {post} />
            {/each}
            <div class="text-center m-2 p-2">
                <hr />
                <div class="m-2 h4 ">Looks like you have reached end.</div>
            </div>
        </Card>
    </main>
</div>
