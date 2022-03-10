<script>
    import Login from "./Login.svelte";
    import Explore from "./Explore.svelte";
    import {
        mdiLoading,
        mdiPlusCircleOutline,
        mdiViewDashboard,
    } from "@mdi/js";
    import Icon from "mdi-svelte";
    import PostPage from "./Post.svelte";
    import { username, db } from "./user.js";

    let items = JSON.parse(localStorage.getItem("items") || "[]");

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    let data;
    let dataImg;
    let mainData;
    let mainImage;

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

        /*mainImage = await db
            .get(`~${pubb}`)
            .get("info")
            .get("profile")
            .get("avatar")
            .then(async (_data) => {
                dataImg = _data;
                return dataImg;
            });*/

        return mainData;
    }

    async function returnImage(pubb) {
        mainImage = await db
            .get(`~${pubb}`)
            .get("info")
            .get("profile")
            .get("avatar")
            .then(async (_data) => {
                dataImg = _data;
                return dataImg;
            });

        return mainImage;
    }

    if (localStorage.getItem("recently_snup") == "true") {
        if (sessionStorage.getItem("pair") == null) {
        } else {
            localStorage.setItem("keys", sessionStorage.getItem("pair"));
        }
        localStorage.setItem("recently_snup", "false");
    }

    document.title = "retrounhash";
</script>

{#if $username}
    <div
        style="display:flex;flex-wrap: wrap;justify-content:center;align-items:center;"
    >
        <div>
            <div style="min-height: 300px;" class="card w-96 mb-5 mt-5 w-full bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="card-title">
                        <Icon path={mdiViewDashboard} /> Dashboard
                        <div class="divider" />
                    </div>
                    {#if !localStorage.getItem("items") || localStorage.getItem("items") == "[]"}
                        <div class="text-center">
                            <img
                                class=""
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
                            <div class="m-1 text-md">loading...</div>
                        {:then data}
                            <a href={`/room?c=${item}`}>
                                <div class="m-1 pl-4 w-96 mw-96 text-md flex items-center">
                                    <div class="avatar mr-2">
                                        <div class="mask mask-squircle w-12">
                                            {#await returnImage(item)}
                                                <Icon path={mdiLoading} />
                                            {:then img}
                                                <img src={img} alt="" />
                                            {/await}
                                        </div>
                                    </div>
                                    {data}
                                    <div class="divider" />
                                </div>
                            </a>
                        {/await}
                    {/each}
                </div>
            </div>
        </div>
        <div class="m-4">
            <PostPage embed={true} />
        </div>
        <div class="m-4">
            <Explore embed={true} />
        </div>
    </div>
{:else}
    <Login />
{/if}
