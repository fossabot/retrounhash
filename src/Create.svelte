<script>
    import Gun from "gun";
    import "gun/lib/rindexed";
    import "gun/sea";
    import "gun/lib/radisk";
    import "gun/lib/radix";
    import compress from "compress-base64";
    import Swal from "sweetalert2";

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
            "http://localhost:8765/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
        axe: true,
        rindexed: true,
        radisk: true,
        localStorage: false,
    });

    async function createRoom() {
        if (base64String) {
            const room = await SEA.pair();
            isLoading = true;
            localStorage.setItem("channel", room.pub);
            db.user().auth(room, async (dat) => {
                var userKeys = JSON.parse(sessionStorage.getItem("pair"));
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
                        await db
                            .user()
                            .get("info")
                            .get("profile")
                            .get("name")
                            .put(document.querySelector("#roomName").value)
                            .then(async () => {
                                await db
                                    .user()
                                    .get("info")
                                    .get("profile")
                                    .get("description")
                                    .put(
                                        document.querySelector("#description")
                                            .value
                                    )
                                    .then(async () => {
                                        await db
                                            .user()
                                            .get("info")
                                            .get("profile")
                                            .get("avatar")
                                            .put(base64String)
                                            .then(() => {
                                                base64String = "";
                                                isLoading = false;
                                                addItem(
                                                    localStorage.getItem(
                                                        "channel"
                                                    )
                                                );
                                                location.href = "/";
                                            });
                                    });
                            });
                    });
            });
        } else {
            Swal.fire({
                title: "please add an image",
                text: "please add a nice image for your room :)",
                icon: "error",
            });
        }
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
    let isLoading = false;

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
        <div class="h2 m-2 text-center">Manage Room</div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardTitle>Create a chat room</CardTitle>
            <CardText>
                Make a chat room where you are the moderator.
                <br />
                <br />
                <div class="text-center">
                    <label for="avatar-chooser">
                        <img
                            style="border-radius: 5px;width: 100px !important;height: 100px;object-fit: cover;"
                            id="avatarDisplay"
                            src="https://i.ibb.co/KxyyLj8/584abe1a2912007028bd932e.png"
                            alt="choose your avatar"
                        />
                        <br />
                        Choose The Pic For your Room
                    </label>
                </div>
                <input
                    type="file"
                    name="avatar-chooser"
                    id="avatar-chooser"
                    on:change={imageUploaded}
                    accept="image/jpeg"
                />
                <br /><br />
                <TextField
                    id="roomName"
                    bind:value={roomName}
                    counter="30"
                    maxLength="30"
                    minLength="3"
                    placeholder={`${$username}'s space`}
                >
                    Name Of The Room
                </TextField>
                <Textarea
                    id="description"
                    counter="400"
                    maxLength="400"
                    placeholder={`explain why the person should join ${
                        roomName || "this room"
                    }`}
                >
                    Description for the room
                </Textarea>
                <TextField placeholder="365" id="data" type="number">
                    Number of days to retain write permission (optional)
                </TextField>
            </CardText>
            <CardActions>
                <Button on:click={createRoom}>Create</Button>
            </CardActions>
        </Card>
    </main>
</div>
