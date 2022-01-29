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
                    expiry: new Date(Date.now() + (3600 * 1000 * 24 * parseInt(document.querySelector("#date")))),
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
    }
</script>

<MaterialApp>
    <main>
        <div class="display-2 m-2 text-center">Account</div>
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
