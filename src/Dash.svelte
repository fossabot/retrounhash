<script>
    import Login from "./Login.svelte";
    import { v4 as uuidv4 } from "uuid";
    import Swal from "sweetalert2";
    import compress from "compress-base64";
    import {
        ListItemGroup,
        ListItem,
        Icon,
        Tabs,
        Tab,
        Window,
        WindowItem,
        AppBar,
        ExpansionPanel,
        ExpansionPanels,
    } from "svelte-materialify";
    import {
        mdiCalendar,
        mdiChatOutline,
        mdiCloseCircle,
        mdiDotsCircle,
    } from "@mdi/js";

    import { user, username, db } from "./user.js";

    let items = JSON.parse(localStorage.getItem("items") || "[]");

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    let data;
    let arrayPersona = [];
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

    let val = 0;
    let posts = [];
    let base64String;
    let textRecieved = "";
    let following_ = [];
    let altForImg;
    let dateOfThePersona;

    if (user.is) {
        /*db.user()
            .get("following")
            .once(async (data) => {
                Object.entries(data).forEach(async (entry) => {
                    const [key, value] = entry;

                    await db
                        .get(`~${entry[1]}`)
                        .get("persona")
                        //.get("post")
                        //.get("all")
                        .map()
                        .once(async (data) => {
                            data.user = entry[0];
                            data.pub = entry[1];
                            //data.date = Gun.state.is(data, "description");
                            posts = [data, ...posts];
                        })
                        .then(() => {});
                });
            });*/

        db.user()
            .get("following")
            .once(async (data) => {
                delete data._;
                Object.entries(data).forEach(async (entry) => {
                    if (entry["key"] == "#") {
                    } else {
                        const [key, value] = entry;
                        following_ = [
                            {
                                name: key,
                                pub: value,
                            },
                            ...following_,
                        ];
                    }
                });
            });
    }

    function imageUploaded() {
        var file = document.querySelector("#avatar-chooser").files[0];

        var reader = new FileReader();
        reader.onload = async function () {
            base64String = reader.result;
            await Swal.fire({
                title: "enter a description",
                input: "text",
                preConfirm: async (data) => {
                    altForImg = data;
                },
            }).then(() => {
                var userKeys = JSON.parse(sessionStorage.getItem("pair"));
                db.user().auth(userKeys, async () => {
                    let timeSTR = uuidv4();
                    await db
                        .user()
                        .get("persona")
                        .get(timeSTR)
                        .put({
                            img: base64String,
                            text: altForImg,
                        })
                        .then(() => {
                            base64String = "";
                        });
                });
            });
        };
        reader.readAsDataURL(file);
    }

    $: base64String,
        async () => {
            base64String = await compress(base64String, {
                width: 400,
                type: "image/jpeg", // default
                max: 200, // max size
                min: 20, // min size
                quality: 0.7,
            });
        };

    function showPersona(post) {
        document.querySelector("#overlay").style.display = "block";
        document.querySelector("#overlayImg").src = post.img;
        textRecieved = post.text;
        dateOfThePersona =
            new Date(Gun.state.is(post, "img")).toLocaleDateString() +
            " - " +
            new Date(Gun.state.is(post, "img")).toLocaleTimeString();
    }

    function closeOverlay() {
        document.querySelector("#overlay").style.display = "none";
    }

    async function getPersona(pubKey) {
        arrayPersona = [];
        await db
            .user(pubKey)
            .get("persona")
            .map()
            .once(async (data) => {
                arrayPersona = [data, ...arrayPersona];
            })
            .then((data) => {});

        return arrayPersona;
    }

    if (localStorage.getItem("recently_snup") == "true") {
        localStorage.setItem("keys", sessionStorage.getItem("pair"));
        localStorage.setItem("recently_snup", "false");
    }
</script>

{#if $username}
    <AppBar>
        <div slot="title">Dashboard</div>
        <div slot="extension">
            <Tabs class="green-text" bind:value={val} fixedTabs>
                <div slot="tabs">
                    <Tab>
                        <Icon
                            path={mdiChatOutline}
                            style="margin-right: 5px;"
                        />
                        Chats
                    </Tab>
                    <Tab>
                        <Icon path={mdiDotsCircle} style="margin-right: 5px;" />
                        pērsona
                    </Tab>
                </div>
            </Tabs>
        </div>
    </AppBar>
    <Window value={val}>
        <WindowItem>
            <ListItemGroup class="p-3">
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
                        <ListItem>loading....</ListItem>
                    {:then name}
                        <a href={`/room?c=${item}`}>
                            <ListItem>
                                {name}
                            </ListItem>
                        </a>
                    {/await}
                {/each}
            </ListItemGroup>
        </WindowItem>
        <WindowItem>
            <ListItem>
                <label for="avatar-chooser" class="p-2">
                    <img
                        style="border-radius: 5px;width: 20px !important;height: 20px;"
                        id="avatarDisplay"
                        src="https://i.ibb.co/KxyyLj8/584abe1a2912007028bd932e.png"
                        alt="choose your avatar"
                    />
                    add your pērsona
                </label>
            </ListItem>
            <input
                type="file"
                name="avatar-chooser"
                id="avatar-chooser"
                on:change={imageUploaded}
                accept="image/jpeg"
            />
            <ExpansionPanels inset class="m-2">
                {#each following_ as following}
                    {#if following.name == "#" || following.name == ">"}
                        <div />
                    {:else}
                        <ExpansionPanel>
                            <div slot="header">
                                {following.name}
                            </div>
                            {#await getPersona(following.pub)}
                                loading...
                            {:then data}
                                <div id="persona__cards">
                                    {#each data as data}
                                        <img
                                            src={data.img}
                                            on:click={showPersona(data)}
                                            alt={data.text}
                                            style="width: 100px !important;height: 100px;"
                                        />
                                    {/each}
                                </div>
                            {/await}
                        </ExpansionPanel>
                    {/if}
                {/each}
            </ExpansionPanels>
        </WindowItem>
    </Window>
    <div id="overlay">
        <img src="" alt="" id="overlayImg" />
        {#if textRecieved.length <= 100}
            <div class="text-center">
                {textRecieved}
            </div>
        {/if}
        <div>
            <span class="p-1 m-2" on:click={closeOverlay}>
                <Icon path={mdiCloseCircle} size="36px" />
            </span>
            <span class="p-1 m-2">
                <Icon path={mdiCalendar} size="36px" />
                {dateOfThePersona || "error"}
            </span>
        </div>
    </div>
{:else}
    <Login />
{/if}

<style>
    #overlay {
        position: fixed; /* Sit on top of the page content */
        display: none; /* Hidden by default */
        width: 100%; /* Full width (cover the whole page) */
        height: 100%; /* Full height (cover the whole page) */
        top: 0;
        left: 0;
        text-align: center;
        right: 0;
        backdrop-filter: blur(3px);
        bottom: 0;
        background-color: rgba(
            0,
            0,
            0,
            0.5
        ); /* Black background with opacity */
        z-index: 999999; /* Specify a stack order in case you're using a different order for other elements */
        cursor: pointer; /* Add a pointer on hover */
    }
    #overlayImg {
        margin-top: 5rem;
        width: 30rem;
        height: 30rem;
        object-fit: cover;
        aspect-ratio: 1/1;
        border-radius: 5px;
    }
    img {
        border-radius: 5px !important;
        object-fit: cover;
    }
    #persona__cards {
        display: flex;
        flex-wrap: wrap;
    }
</style>
