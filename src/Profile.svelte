<script>
    import { Card, CardText, Button, MaterialApp } from "svelte-materialify";
    import { db } from "./user.js";
    export var pub;

    //initialisation
    let isFollowing;
    let userName;
    let userAvatar;
    let isLoading = false;

    async function follow() {
        isLoading = true;
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    console.log(data);
                    data[userName] = pub;
                    db.user().get("following").put(data);
                })
                .then(async () => {
                    isLoading = false;
                });
        });
        isFollowing = true;
    }
    db.get(`~${pub}`)
        .get("alias")
        .once((data) => {
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

    async function unfollow() {
        isLoading = true;
        db.user().auth(JSON.parse(sessionStorage.getItem("pair")), async () => {
            await db
                .user()
                .get("following")
                .once(async (data = {}) => {
                    console.log(data);
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

<MaterialApp>
    <main>
        <div class="h2 m-2 text-center">User's profile</div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardText class="text-center">
                <img
                    style="border-radius: 5px;"
                    src={userAvatar}
                    alt="userAvatar"
                    id="userAvatar"
                    class="m-2"
                />
                <br />
                <span class="h2">
                    {userName}
                </span>
            </CardText>
            <CardText>
                You will see the user's posts in the explore setion atter you
                follow him.
                {#if !isFollowing}
                    <Button on:click={follow}>follow</Button>
                {:else}
                    <Button on:click={unfollow}>Unfollow</Button>
                {/if}
            </CardText>
        </Card>
    </main>
</MaterialApp>
