<script>
    import { v4 as uuidv4 } from "uuid";

    import Swal from "sweetalert2";
    /*import "gun/lib/rindexed";
    import "gun/sea";
    import "gun/lib/radisk";
    import "gun/lib/radix";

    const db = new Gun({
        peers: [
            "http://localhost:8765/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
        axe: true,
        rindexed: true,
        radisk: false,
        localStorage: false,
    });*/

    import { db } from "./user"

    let postDescription;
    let isLoading = false;

    async function createPost() {
        isLoading = true;
        db.user().auth(
            JSON.parse(sessionStorage.getItem("pair")),
            async (dat) => {
                try {
                    let timeSTR = uuidv4();
                    await db
                        .user()
                        .get("posts")
                        //.get("post")
                        //.get("all")
                        .get(timeSTR)
                        .put({
                            description:
                                postDescription || "no post description",
                            //date: new Date().toLocaleDateString(),
                            //time: new Date().toLocaleTimeString(),
                            uid: timeSTR,
                        })
                        .then(async () => {
                            isLoading = false;
                            postDescription = "";
                            Swal.fire({
                                icon: "success",
                                title: "post uploaded!",
                                text: "your post was successfully ploaded to the main network.",
                            });
                        });
                } catch (e) {
                    Swal.fire({
                        icon: "error",
                        title: "oops!",
                        text: e,
                    });
                }
            }
        );
    }

    let getImageUploadSwitchValue;
    let base64String;

    function imageUploaded() {
        var file = document.querySelector("#avatar-chooser").files[0];

        var reader = new FileReader();
        reader.onload = async function () {
            base64String = reader.result;
            var userKeys = JSON.parse(sessionStorage.getItem("pair"));
            db.user().auth(userKeys, async () => {
                try {
                    Swal.fire({
                        title: "enter any description for the img",
                        input: "text",
                        text: "describe the pic the way you want",
                        preConfirm: async (desc) => {
                            let timeSTR = uuidv4();
                            await db
                                .user()
                                .get("posts")
                                .get(timeSTR)
                                .put({
                                    img: await base64String,
                                    description: desc,
                                    uid: timeSTR,
                                })
                                .then(async () => {
                                    isLoading = false;
                                    postDescription = "";
                                    Swal.fire({
                                        icon: "success",
                                        title: "post uploaded!",
                                        text: "your post was successfully ploaded to the main network.",
                                    });
                                });
                        },
                    });
                } catch (e) {
                    Swal.fire({
                        icon: "error",
                        title: "oops!",
                        text: e,
                    });
                }
            });
        };
        reader.readAsDataURL(file);
    }

    $: base64String,
        async () => {
            base64String = await compress(base64String, {
                width: 400,
                type: "image/jpeg", // default
                max: 100, // max size
                min: 20, // min size
                quality: 0.5,
            });
        };
</script>

<div>
    <main>
        <div class="h2 m-2 text-center">Create a post</div>
        <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="card-title">
                    Create a post your followers will see
                </div>
                write an inspiring post, or just post some memes from reddit.
                <br /><br />
                {#if !getImageUploadSwitchValue}
                    <textarea
                        class="textarea bordered textarea-accent"
                        id="postDescription"
                        bind:value={postDescription}
                        maxlength="400"
                        placeholder="type up the post .."
                    />
                {/if}
                <label for="uploadedSwitch"> upload picture ? </label>
                <input
                    type="checkbox"
                    bind:checked={getImageUploadSwitchValue}
                    class="toggle toggle-primary"
                    id="uploadedSwitch"
                />
                {#if getImageUploadSwitchValue}
                    <label for="avatar-chooser" class="p-2 m-2">
                        <div class="avatar">
                            <div class="w-24 mask mask-squircle">
                                <img
                                    src="https://i.ibb.co/KxyyLj8/584abe1a2912007028bd932e.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <br />
                        <div class="m-1 text-l p-1">post picture.</div>
                    </label>
                {/if}
                <input
                    type="file"
                    name="avatar-chooser"
                    id="avatar-chooser"
                    on:change={imageUploaded}
                    accept="image/jpeg"
                    class="hidden"
                />
                {#if !getImageUploadSwitchValue}
                    <div class="m-1 p-1">
                        <button class="btn btn-success" on:click={createPost}
                            >Create</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    </main>
</div>
