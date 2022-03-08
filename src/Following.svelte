<script>
    import { db, username } from "./user.js";
    export var pub;
    import Swal from "sweetalert2";

    //initialisation
    let userName = "";
    let followingCount = 0;
    let followingPeople = [];
    let userAvatar;
    let followingName;

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

    db.user(pub)
        .get("following")
        .once(async (data = {}) => {
            delete data._;
            delete data["#"];
            delete data[">"];
            Object.values(data).forEach(async (following) => {
                var [key, value] = following;
                followingCount += 1;
                followingPeople = [following, ...followingPeople];
            });
        });

    let data;
    let mainData;
    async function returnNull(pubb) {
        mainData = await db
            .get(`~${pubb}`)
            .get("profile")
            .get("name")
            .then(async (_data) => {
                data = _data;
                return data;
            });

        return mainData;
    }
</script>

<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title text-xl regular-case m-1">
            {userName} is following {followingCount}
            {#if followingCount > 1}
                users.
            {:else}
                user.
            {/if}
        </div>

        {#each followingPeople as person}
            <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="card-title">
                        {#await returnNull(person)}
                            loading...
                        {:then result}
                            {result}
                        {/await}
                    </div>
                    <a href={`/User/${person}`} class="btn btn-standard w-30">
                        see profile
                    </a>
                </div>
            </div>
        {/each}
    </div>
</div>
