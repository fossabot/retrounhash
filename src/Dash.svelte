<script>
    import Login from "./Login.svelte";
    import { v4 as uuidv4 } from "uuid";
    import Swal from "sweetalert2";
    import compress from "compress-base64";
    import {
        Card,
        CardText,
        CardTitle,
        ListItemGroup,
        ListItem,
        Icon,
        Tabs,
        Tab,
        Window,
        WindowItem,
        AppBar,
    } from "svelte-materialify";
    import { mdiChatOutline, mdiDotsCircle } from "@mdi/js";
    import { user, username, db } from "./user.js";

    let items = JSON.parse(localStorage.getItem("items") || "[]");
    function addItem(pub) {
        items = [...items, pub]; //{ name: name, pubKeyRoom: pub}];
    }

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    function remove(arr, item) {
        for (var i = arr.length; i--; ) {
            if (arr[i] === item) arr.Dashsplice(i, 1);
        }
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

    let val = 0;
    let posts = [];
    let base64String;
    let textRecieved;
    let altForImg;

    if (user.is) {
        db.user()
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
                            img: await compress(base64String, {
                                width: 800,
                                type: "image/jpeg", // default
                                max: 200, // max size
                                min: 20, // min size
                                quality: 0.8,
                            }),
                            text: altForImg,
                        })
                        .then(() => {
                            base64String = "";
                            console.log("avatar uploaded");
                        });
                });
            });
        };
        reader.readAsDataURL(file);
    }

    function showPersona(post) {
        document.querySelector("#overlay").style.display = "block";
        document.querySelector("#overlayImg").src = post.img;
        textRecieved = post.text;
    }

    function closeOverlay() {
        document.querySelector("#overlay").style.display = "none";
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
            <div cpass="p-2">
                {#each posts as post}
                    <ListItem on:click={showPersona(post)}>
                        <img src={post.img} alt="" />
                        {post.user}
                    </ListItem>
                {/each}
            </div>
        </WindowItem>
    </Window>
    <div id="overlay" on:click={closeOverlay}>
        <img src="" alt="" id="overlayImg" />
        <div class="text-center">
            {textRecieved}
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
        backdrop-filter: blur(2px);
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
</style>
