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
    let keyConfigName;
    let enableKey;

    $: enableKey ||
        keyConfigName ||
        enableSwipe ||
        enableSwipe ||
        encryptionValue ||
        showAutoscroll,
        saveSettings();

    if (localStorage.getItem("autoscroll") == "true") {
        showAutoscroll = true;
    } else {
        showAutoscroll = false;
    }

    if (localStorage.getItem("keyToNav") == "true") {
        enableKey = true;
    } else {
        enableKey = false;
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
        localStorage.setItem("keyToNav", enableKey);
    }

    let encryptionPlaceholder = localStorage.getItem("_secret") || "";

    function changeKey() {
        keyConfigName = "press the new key";
        document.onkeyup = (e) => {
            localStorage.setItem("keyToNav__enable", e.keyCode);
            keyConfigName = `key set as ${e.code}`;
            location.href = "/";
        };
    }
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
        <Card class="m-2">
            <CardTitle>Enable key bindings ?</CardTitle>
            <CardText>
                if you are on a pc, you can use keys (Ctrl by default) to open
                drawers and to navigate with an ease.
            </CardText>
            <CardActions>
                <Switch class="m-2" bind:checked={enableKey} inset>
                    {enableKey}
                </Switch>
                {#if enableKey}
                    <Button class="m-2" on:click={changeKey}>
                        {keyConfigName || "Change the key"}
                    </Button>
                {/if}
            </CardActions>
        </Card>
        <div class="m-2 h4 form-text text-muted text-center">
            settings are automattically saved
        </div>
        <div class="p-2" />
    </main>
</MaterialApp>
