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

    
    let postTitle;
    let postDescription;
    let isLoading = false;

    async function createPost() {
        isLoading = true;
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
                        title: postTitle || "failed to add title",
                        description: postDescription || "failed to add description",
                    })
                    .then(async () => {
                        isLoading = false;
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
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
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
