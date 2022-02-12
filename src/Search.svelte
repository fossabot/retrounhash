<script>
    import Login from "./Login.svelte";
    import {
        Card,
        CardText,
        CardTitle,
        CardActions,
        TextField,
        Button,
        MaterialApp,
        Icon,
    } from "svelte-materialify";
    import { mdiPostOutline } from "@mdi/js";
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
    <MaterialApp>
        <div class="display-2 m-2 text-center" />
        <Card class="m-2">
            <CardTitle>
                <Icon path={mdiPostOutline} size="30px" />
                Search users
            </CardTitle>
            <CardText class="h2">enter public key of the user</CardText>
            <CardActions>
                <TextField bind:value={pubKey}>
                    Paste the public key here
                </TextField>
            </CardActions>
        </Card>
        <Card
            bind:disabled={isLoading}
            bind:loading={isLoading}
            class="p-2 text-center"
        >
            <CardTitle>User Information</CardTitle>
            {#if userName}
                <img
                    src={`https://avatars.dicebear.com/api/identicon/${userName}.svg?backgroundColor=white`}
                    alt=""
                    style="border-radius: 5px !important;"
                />
                <br />
                <div class="m-2 h3">
                    {userName}
                </div>
                <a href={`/User/${pubKey}`}>
                    <Button>
                        see {userName}'s profile
                    </Button>
                </a>
                <Button on:click={shareProfile}>
                    Share {userName}'s profile
                </Button>
            {:else}
                <div class="m-2 h3 p-1">user not found</div>
                <br />
                <div class="form-text">
                    try entering the exact public key of the user to find
                </div>
            {/if}
        </Card>
    </MaterialApp>
{:else}
    <Login />
{/if}
