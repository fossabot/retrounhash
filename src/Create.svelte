<script>
    import Gun from "gun";
    import {
        Card,
        CardText,
        CardActions,
        CardTitle,
        TextField,
        Button,
        Icon,
        MaterialApp,
        Textarea,
    } from "svelte-materialify";

    import { mdiImageOutline } from "@mdi/js";

    import { user, username } from "./user.js";

    const db = new Gun({
        peers: [
            "https://gunjs.herokuapp.com/gun",
            "https://gun--server.herokuapp.com/gun",
        ],
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
                .then(() => {
                    console.log("dane1");
                });

            await db
                .user()
                .get("info")
                .get("profile")
                .get("name")
                .put(document.querySelector("#roomName").value)
                .then(() => {
                    console.log("done");
                });

            await db
                .user()
                .get("info")
                .get("profile")
                .get("description")
                .put(document.querySelector("#description").value)
                .then(() => {
                    console.log("dooone !");
                });

            await db
                .user()
                .user()
                .get("info")
                .get("profile")
                .get("avatar")
                .put(base64String)
                .then(() => {
                    console.log("avatar uploaded");
                });

            //console.log(
            //  await db.user().get("certs").get("chat").get(userKeys.pub).then()
            //);
        });
        setTimeout(() => {
            addItem(localStorage.getItem("channel"));
            location.href = "/";
        }, 3000);
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
        console.log("next");
        reader.onload = async function () {
            base64String = reader.result
                //.replace("data:", "")
                //.replace(/^.+,/, "");
        };
        reader.readAsDataURL(file);
    }
</script>

<MaterialApp>
    <main>
        <div class="h2 m-2 text-center">Manage Room</div>
        <Card class="m-2">
            <CardTitle>Create a chat room</CardTitle>
            <CardText>
                Make a chat room where you are the moderator.
                <br />
                <br />
                <label style="height: 38px;" for="avatar-chooser">
                    <Icon size="50px" path={mdiImageOutline} />
                    <!--i class="fas fa-image fa-lg" /-->
                </label>
                <input
                    type="file"
                    name="avatar-chooser"
                    id="avatar-chooser"
                    on:change={imageUploaded}
                    accept="image/*"
                />
                <br /><br />
                <TextField
                    id="roomName"
                    bind:value={roomName}
                    counter="30"
                    maxLength="30"
                    minLength="3"
                >
                    {$username}'s space
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
</MaterialApp>
