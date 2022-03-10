<script>
    import Gun from "gun";
    import "gun/lib/rindexed";
    import "gun/sea";
    import "gun/lib/radisk";
    import "gun/lib/radix";
    import compress from "compress-base64";
    import Swal from "sweetalert2";
    import { user, username } from "./user.js";

    const db = new Gun({
        peers: [
            "http://localhost:8765/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
        axe: true,
        rindexed: true,
        radisk: false,
        localStorage: false,
    });

    let roomName;
    let base64String;
    let isLoading = false;

    async function createRoom() {
        if (base64String) {
            const room = await SEA.pair();
            isLoading = true;
            localStorage.setItem("channel", room.pub);
            await db.user().auth(room, async (dat) => {
                var userKeys = JSON.parse(sessionStorage.getItem("pair"));
                let enc = await SEA.encrypt(room, userKeys.priv);
                db.user().get("host").get("key").put(enc);
                const cert = await SEA.certify(
                    "*",
                    { "*": "chat" },
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
                        console.log("certificate made");
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
                                        document.querySelector("#description")
                                            .value
                                    )
                                    .then(async () => {
                                        console.log("desc added");
                                        /*await db
                                            .user()
                                            .get("info")
                                            .get("profile")
                                            .get("avatar")
                                            .put(await base64String)
                                            .then(async () => {
                                                console.log("base64 added")
                                                base64String = "";
                                                isLoading = false;
                                                addItem(
                                                    localStorage.getItem(
                                                        "channel"
                                                    )
                                                );
                                                location.href = "/";
                                            });*/

                                        await db
                                            .get(
                                                `~${localStorage.getItem(
                                                    "channel"
                                                )}`
                                            )
                                            .get("host")
                                            .get("key")
                                            .then(async (keyPair) => {
                                                const keys = await SEA.decrypt(
                                                    keyPair,
                                                    JSON.parse(
                                                        sessionStorage.getItem(
                                                            "pair"
                                                        )
                                                    ).priv
                                                );
                                                db.user().auth(
                                                    keys,
                                                    async () => {
                                                        await db
                                                            .user()
                                                            .get("info")
                                                            .get("profile")
                                                            .get("avatar")
                                                            .put(
                                                                await compress(
                                                                    base64String,
                                                                    {
                                                                        width: 400,
                                                                        type: "image/jpeg", // default
                                                                        max: 200, // max size
                                                                        min: 20, // min size
                                                                        quality: 0.8,
                                                                    }
                                                                )
                                                            )
                                                            .then(async () => {
                                                                addItem(
                                                                    localStorage.getItem(
                                                                        "channel"
                                                                    )
                                                                );

                                                                await Swal.fire(
                                                                    {
                                                                        icon: "success",
                                                                        title: "done! 🎉",
                                                                        text: "successfully generated room",
                                                                    }
                                                                ).then(() => {
                                                                    location.href =
                                                                        "/";
                                                                });
                                                            });
                                                    }
                                                );
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

    /*$: base64String,
        async () => {
            base64String = await compress(base64String, {
                width: 400,
                type: "image/jpeg", // default
                max: 200, // max size
                min: 20, // min size
                quality: 0.7,
            });
        };*/
</script>

<div>
    <main>
        <div class="m-4 text-xl text-center">Manage Room</div>
        <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="card-title">Create Chat Room</div>
                Make a chat room where you are the moderator.
                <br />
                <br />
                <div class="text-center">
                    <label for="avatar-chooser" class="text-center w-full">
                        <div class="avatar">
                            <div class="w-24 mask mask-squircle">
                                <img
                                    id="avatarDisplay"
                                    src="https://i.ibb.co/KxyyLj8/584abe1a2912007028bd932e.png"
                                    alt="choose room avatar"
                                />
                            </div>
                        </div>
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
                    class="hidden"
                />
                <br /><br />
                <input
                    type="text"
                    class="input input-bordered w-full max-w-xs"
                    id="roomName"
                    bind:value={roomName}
                    maxLength="30"
                    minLength="3"
                    placeholder={`${$username}'s space`}
                />
                <textarea
                    class="textarea textarea-bordered"
                    id="description"
                    maxLength="400"
                    placeholder={`explain why the person should join ${
                        roomName || "this room"
                    }`}
                />
                <input
                    class="input input-bodered w-full max-w-xs"
                    id="data"
                    type="number"
                    placeholder="self destruction after n days."
                />
            </div>
            <div class="m-2">
                <button class="btn btn-success" on:click={createRoom}
                    >Create</button
                >
            </div>
        </div>
    </main>
</div>
