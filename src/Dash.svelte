<script>
    import Login from "./Login.svelte";
    import { mdiViewDashboard } from "@mdi/js";
    import Icon from "mdi-svelte";
    import {  username, db } from "./user.js";

    let items = JSON.parse(localStorage.getItem("items") || "[]");

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    let data;
    let mainData;
    async function returnNull(pubb) {
        mainData = await db
            .get(`~${pubb}`)
            .get("info")
            .get("profile")
            .get("name")
            .then(async (_data) => {
                data = _data;
                return data;
            });

        return mainData;
    }


    if (localStorage.getItem("recently_snup") == "true") {
        if (sessionStorage.getItem("pair") == null) {
        } else {
            localStorage.setItem("keys", sessionStorage.getItem("pair"));
        }
        localStorage.setItem("recently_snup", "false");
    }
</script>

{#if $username}
    <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="card-title">
                <Icon path={mdiViewDashboard} /> Dashboard
            </div>
            {#if !localStorage.getItem("items") || localStorage.getItem("items") == "[]"}
                <div class="text-center">
                    <img
                        class="img-fluid"
                        src="images/empty-state-concept-3428212-2902554.png"
                        alt=""
                    />
                </div>
                <div class="text-center m-3 h3">
                    no rooms, yet! Go and make one !
                </div>
            {/if}
            {#each items as item, i (item)}
                {#await returnNull(item)}
                    <div class="m-1 text-md">
                        loading...
                    </div>
                {:then name}
                    <a href={`/room?c=${item}`}>
                        <div class="m-1 text-md">
                            {name}
                        </div>
                    </a>
                {/await}
            {/each}
        </div>
    </div>
{:else}
    <Login />
{/if}
