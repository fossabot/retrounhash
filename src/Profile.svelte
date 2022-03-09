<script>
    import { db, username } from "./user.js";
    import Login from "./Login.svelte";
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
    let userIsOnline = false;
    let followingCount = 0;
    let userstatus;
    let userStatusBg;
    let userLastSeen;

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
                .then(async () => {});
        });
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
                .on(async (data = {}) => {
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
            .then(() => {});
    }

    async function unfollow() {
        isLoading = true;
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    delete data[userName];
                    await db.user().get("following").put(data);
                })
                .then(async () => {});
        });
    }

    db.user(pub)
        .get("online")
        .on((stat) => {
            userIsOnline = stat;
            if (stat) {
                userstatus = "online";
                userStatusBg = "success";
            } else {
                userstatus = "offline";
                userStatusBg = "error";
            }
        });

    db.user(pub)
        .get("following")
        .on(async (data = {}) => {
            db.user(pub)
                .get("following")
                .once(async (data = {}) => {
                    console.log(data);
                    delete data._;
                    delete data["#"];
                    delete data[">"];
                    Object.values(data).forEach(async (follower) => {
                        followingCount += 1;
                    });
                });
            followingCount = 0;
        });

    db.user(pub)
        .get("lastSeen")
        .on((data) => {
            var lastSeen = new Date(data);
            userLastSeen =
                lastSeen.getDate() +
                "/" +
                lastSeen.getMonth() +
                "/" +
                lastSeen.getFullYear() +
                "—" +
                lastSeen.toLocaleTimeString(); /* +
                ":" +
                lastSeen.getMinutes() +
                ":" +
                lastSeen.getSeconds();*/
        });
</script>

{#if $username}
    <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="card-title text-xl regular-case">
                {userName}'s profile
            </div>
            <div class="text-center">
                <div class={`avatar ${userstatus}`}>
                    <div class="w-24 mask mask-squircle">
                        <img
                            src={userAvatar}
                            alt="userAvatar"
                            id="userAvatar"
                        />
                    </div>
                </div>
            </div>
            <br />
            <span class="text-l text-center">
                <div class="m-3 text-xl">
                    {userName}
                </div>
                <br />
                {#if userIsOnline == true || userIsOnline == false}
                    <span class={`btn btn-${userStatusBg}`}>
                        online: {userIsOnline}
                        {#if !userIsOnline}
                            <br />
                            last seen at: {userLastSeen}
                        {/if}
                    </span>
                {/if}
                <a href={`/${pub}/Following/`} class="btn btn-standard">
                    following: {followingCount}
                </a>
            </span>
            <div class="m-3">
                You will see the user's posts in the explore section after you
                follow them.
            </div>
        </div>
        <div class="m-2">
            {#if !isFollowing}
                <button class="btn btn-success" on:click={follow}>follow</button
                >
            {:else}
                <button class="btn btn-warning" on:click={unfollow}
                    >Unfollow</button
                >
            {/if}
        </div>
    </div>
    <br />
    <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="m-2 p-2 text-xl">User's posts:</div>
            {#each posts as post}
                <Post {post} />
            {/each}
            <div class="text-center m-2 p-2">
                <hr />
                <div class="m-2 p-2">Looks like you have reached end.</div>
            </div>
        </div>
    </div>
{:else}
    <Login />
{/if}
