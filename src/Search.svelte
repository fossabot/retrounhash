<script>
    import Login from "./Login.svelte";
    import { Icon } from "svelte-materialify";
    import { mdiBadgeAccountHorizontalOutline, mdiPostOutline } from "@mdi/js";
    import { username } from "./user.js";
    import { db2 } from "./gunInstance";

    //initialisation
    let pubKey;
    let userName;
    let isLoading = false;

    let users__;
    db2.get("#user_catalogue_2").on((indexedCatalogueOfPubKeys) => {
        delete indexedCatalogueOfPubKeys._;
        const allPubKeys = Object.values(indexedCatalogueOfPubKeys);

        allPubKeys.forEach(async (justSomePubKey) => {
            db2.user(justSomePubKey)
                .get("profile")
                .once(({ name }) => {
                    users__ += `<br />${name}`;
                });
        });
    });

    setInterval(() => {
        if (pubKey !== undefined || pubKey !== "") {
            isLoading = true;
            db2.user(pubKey)
                .get("alias")
                .once((data) => {
                    userName = data;
                })
                .then(() => {
                    isLoading = false;
                });
        }
    }, 3000);

    function shareProfile() {
        navigator.share({
            title: `${userName}'s profile`,
            text: "see a user on retrounhash, a decentralised application for encrypted communication \n",
            url: `/User/${pubKey}`,
        });
    }
</script>

{#if $username}
    <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="card-title">
                <Icon path={mdiPostOutline} size="30px" />
                Search users
            </div>
        </div>
        <div class="m-4 text-xl">Enter the public key of the user</div>
        <div class="m-2">
            <input
                class="input w-full input-bordered input-secondary"
                placeholder="enter the public key of the user"
                bind:value={pubKey}
            />
        </div>
    </div>
    <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl text-center">
        <div class="card-body">
            <div class="card-title">User Information</div>
            {#if userName}
                <div class="text-center">
                    <div class="avatar">
                        <div class="w-24 mask mask-squircle">
                            <img
                                src={`https://avatars.dicebear.com/api/identicon/${userName}.svg?backgroundColor=white`}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
                <div class="m-2 text-xl text-center">
                    {userName}
                </div>
                <a class="btn btn-success" href={`/User/${pubKey}`}>
                    see profile
                </a>
                <button class="btn btn-info" on:click={shareProfile}>
                    Share profile 
                </button>
            {:else}
                <div class="m-2 text-xl camelcase">user not found</div>
                <br />
                <div class="text-m text-center">
                    try entering the exact public key of the user to find
                </div>
            {/if}
        </div>
    </div>
{:else}
    <Login />
{/if}
