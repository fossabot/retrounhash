<script>
    import Gun from "gun";
    import { v4 as uuidv4 } from 'uuid';

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
                            uid: timeSTR
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
</script>

<MaterialApp>
    <main>
        <div class="h2 m-2 text-center">Create a post</div>
        <Card bind:disabled={isLoading} bind:loading={isLoading} class="m-2">
            <CardTitle>Create a post your followers will see</CardTitle>
            <CardText>
                write an inspiring post, or just post some memes from reddit.
                <br /><br />
                <Textarea
                    id="description"
                    counter="400"
                    bind:value={postDescription}
                    maxLength="400"
                    placeholder={`type up the post ..`}
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
