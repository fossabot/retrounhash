<script>
    import Gun from "gun";
    import {
        Card,
        CardText,
        CardActions,
        CardTitle,
        TextField,
        Button,
        MaterialApp,
    } from "svelte-materialify";
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
                                parseInt(document.querySelector("#date")) || 1000000 //well, 
                    ),
                    //blacklist: "ban"
                }
            );
            db.user().get("certs").get("chat").get("certificate").put(cert);
            db.user()
                .get("info")
                .get("profile")
                .get("name")
                .put(document.querySelector("#roomName").value);

            //console.log()
            //  await db.user().get("certs").get("chat").get(userKeys.pub).then()
            //);
        });
        addItem(localStorage.getItem("channel"));
        location.href = "/";
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
                <TextField
                    id="roomName"
                    counter="30"
                    maxLength="30"
                    minLength="3"
                >
                    {$username}'s space
                </TextField>
                <TextField id="data" type="number">
                    Number of days to retain write permission for others
                </TextField>
            </CardText>
            <CardActions>
                <Button on:click={createRoom}>Create</Button>
            </CardActions>
        </Card>
    </main>
</MaterialApp>
