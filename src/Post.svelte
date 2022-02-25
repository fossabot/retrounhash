<script>
    import Gun from "gun";
    import { v4 as uuidv4 } from "uuid";

    import Swal from "sweetalert2";
    import "gun/lib/rindexed";
    import "gun/sea";
    import "gun/lib/radisk";
    import "gun/lib/radix";

    import {
        Card,
        CardText,
        CardActions,
        CardTitle,
        TextField,
        Button,
        Switch,
        MaterialApp,
        Textarea,
    } from "svelte-materialify";
    import { user, username } from "./user.js";

    const db = new Gun({
        peers: [
            "http://localhost:8765/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
        axe: true,
        rindexed: true,
        radisk: true,
        localStorage: false,
    });

    let postTitle;
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
                                //.get("post")
                                //.get("all")
                                .get(timeSTR)
                                .put({
                                    img: base64String,
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
                max: 200, // max size
                min: 20, // min size
                quality: 0.7,
            });
        };
</script>

<div>
    <main>
        <div class="h2 m-2 text-center">Create a post</div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardTitle>Create a post your followers will see</CardTitle>
            <CardText>
                write an inspiring post, or just post some memes from reddit.
                <br /><br />
                {#if !getImageUploadSwitchValue}
                    <Textarea
                        id="description"
                        counter="400"
                        bind:value={postDescription}
                        maxLength="400"
                        placeholder={`type up the post ..`}
                    >
                        Content of the post
                    </Textarea>
                {/if}
                <Switch bind:checked={getImageUploadSwitchValue} inset>
                    upload a picture?
                </Switch>
                {#if getImageUploadSwitchValue}
                    <label for="avatar-chooser" class="p-2 text-center m-2">
                        <img
                            style="border-radius: 5px;width: 40px !important;height: 40px;"
                            id="avatarDisplay"
                            src="https://i.ibb.co/KxyyLj8/584abe1a2912007028bd932e.png"
                            alt="choose your avatar"
                        />
                        <br />
                        post a picture.
                    </label>
                {/if}
                <input
                    type="file"
                    name="avatar-chooser"
                    id="avatar-chooser"
                    on:change={imageUploaded}
                    accept="image/jpeg"
                />
            </CardText>
            {#if !getImageUploadSwitchValue}
                <CardActions>
                    <Button on:click={createPost}>Create</Button>
                </CardActions>
            {/if}
        </Card>
    </main>
</div>
