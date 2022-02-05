<script>
    import {
        Card,
        TextField,
        CardText,
        CardActions,
        CardTitle,
        Button,
        Switch,
        MaterialApp,
    } from "svelte-materialify";
    import { user, username } from "./user.js";

    let showAutoscroll;
    let encryptionValue;
    let enableSwipe;

    if (localStorage.getItem("autoscroll") == "true") {
        showAutoscroll = true;
    } else {
        showAutoscroll = false;
    }

    if (localStorage.getItem("swipe") == "true") {
        enableSwipe = true;
    } else {
        enableSwipe = false;
    }

    function saveSettings() {
        localStorage.setItem("autoscroll", showAutoscroll);
        localStorage.setItem("_secret", encryptionValue);
        localStorage.setItem("swipe", enableSwipe);
    }

    let encryptionPlaceholder = localStorage.getItem("_secret") || "";
</script>

<MaterialApp>
    <main>
        <div class="h2 m-2 text-center">Settings</div>
        <Card class="m-2">
            <CardTitle>Show autoscroll?</CardTitle>
            <CardText>
                the autoscroll button apears next to the send button and help in
                going down the message list quickly.
            </CardText>
            <CardActions>
                <Switch bind:checked={showAutoscroll} inset>
                    {showAutoscroll}
                </Switch>
            </CardActions>
        </Card>
        <Card class="m-2">
            <CardTitle>Custom Encryption</CardTitle>
            <CardText>
                you can encrypt your messages with custom encryption keys so
                that only you and someone with the same key will be able to see
                your messages.
            </CardText>
            <CardActions>
                <TextField
                    bind:value={encryptionValue}
                    counter="10"
                    bind:placeholder={encryptionPlaceholder}
                    >enter your keyword here</TextField
                >
            </CardActions>
        </Card>
        <Card class="m-2">
            <CardTitle>Enable swipe gestures ?</CardTitle>
            <CardText>
                if you are on a mobile, you can use swipe genstures to open
                drawers and to navigate with an ease.
            </CardText>
            <CardActions>
                <Switch bind:checked={enableSwipe} inset>
                    {enableSwipe}
                </Switch>
            </CardActions>
        </Card>
        <div class="text-center m-3">
            <Button on:click={saveSettings}>Save Settings</Button>
        </div>
    </main>
</MaterialApp>
