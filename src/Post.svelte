<script>
    import Gun from "gun";
    import { downscaleImage } from "./utils";
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
        MaterialApp,
        Textarea,
    } from "svelte-materialify";
    import { user, username } from "./user.js";

    const db = new Gun({
        peers: [
            "https://gunjs.herokuapp.com/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
        axe: true,
        rindexed: true,
        radisk: true,
        localStorage: false,
    });

    async function createRoom() {
        const room = await SEA.pair();
        localStorage.setItem("channel", room.pub);
        //console.log(room.pub);
        db.user().auth(room, async (dat) => {
            var userKeys = JSON.parse(sessionStorage.getItem("pair"));
            //console.log("user: " + userKeys.pub);
            let enc = await SEA.encrypt(room, userKeys.priv);
            db.user().get("host").get("key").put(enc);
            const cert = await SEA.certify(
                "*",
                { "*": "chat" }, //, "+": "*" },
                room,
                null,
                {
                    expiry: new Date(
                        Date.now() +
                            3600 *
                                1000 *
                                24 *
                                parseInt(document.querySelector("#date")) ||
                            1000000 //well,
                    ),
                    //blacklist: "ban"
                }
            );
            await db
                .user()
                .get("certs")
                .get("chat")
                .get("certificate")
                .put(cert)
                .then(async () => {
                    console.log("certificate uploaded");
                    await db
                        .user()
                        .get("info")
                        .get("profile")
                        .get("name")
                        .put(document.querySelector("#roomName").value)
                        .then(async () => {
                            console.log("name added");
                            await db
                                .user()
                                .get("info")
                                .get("profile")
                                .get("description")
                                .put(
                                    document.querySelector("#description").value
                                )
                                .then(async () => {
                                    console.log("description added");
                                    await db
                                        .user()
                                        .get("info")
                                        .get("profile")
                                        .get("avatar")
                                        .put(downscaleImage(base64String, 200))
                                        .then(() => {
                                            base64String = "";
                                            console.log("avatar uploaded");
                                            addItem(
                                                localStorage.getItem("channel")
                                            );
                                            location.href = "/";
                                        });
                                });
                        });
                });

            //console.log(
            //  await db.user().get("certs").get("chat").get(userKeys.pub).then()
            //);
        });
    }

    let items = JSON.parse(localStorage.getItem("items") || "[]");
    function addItem(pub) {
        items = [pub, ...items];
    }

    $: {
        localStorage.setItem("items", JSON.stringify(items));
    }

    /*function remove(arr, item) {
        for (var i = arr.length; i--; ) {
            if (arr[i] === item) arr.splice(i, 1);
        }
    }*/

    let roomName;
    let base64String;

    function imageUploaded() {
        var file = document.querySelector("#avatar-chooser").files[0];

        var reader = new FileReader();
        reader.onload = async function () {
            base64String = reader.result;
            //.replace("data:", "")
            //.replace(/^.+,/, "");
            document.getElementById("avatarDisplay").src = base64String;
        };
        reader.readAsDataURL(file);
    }

    let postTitle;
    let postDescription;

    async function createPost() {
        db.user().auth(
            JSON.parse(sessionStorage.getItem("pair")),
            async (dat) => {
                await db
                    .user()
                    .get("posts")
                    .get("post")
                    .get("all")
                    .get(new Date().toISOString())
                    .put({
                        title: postTitle || "failed title",
                        description: postDescription || "failed description",
                    })
                    .then(async () => {
                        console.log("done");
                        location.href = "/";
                    });
            }
        );
    }
</script>

<MaterialApp>
    <main>
        <div class="h2 m-2 text-center">Create a post</div>
        <Card class="m-2">
            <CardTitle>Create a post your followers will see</CardTitle>
            <CardText>
                write an inspiring post, or just post some memes from reddit.
                <br /><br />
                <TextField
                    id="roomName"
                    bind:value={postTitle}
                    counter="30"
                    maxLength="30"
                    minLength="3"
                    placeholder="tell us what's it all about"
                >
                    title of the post
                </TextField>
                <Textarea
                    id="description"
                    counter="400"
                    bind:value={postDescription}
                    maxLength="400"
                    placeholder={`did ya fall in your sleep? or was just taken by aliens?`}
                >
                    Content of the post
                </Textarea>
            </CardText>
            <CardActions>
                <Button on:click={createPost}>Create</Button>
            </CardActions>
        </Card>
    </main>
</MaterialApp>
