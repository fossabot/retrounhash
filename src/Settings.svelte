<script>
    let showAutoscroll;
    let encryptionValue = localStorage.getItem("_secret") || "";
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
        if (encryptionValue !== localStorage.getItem("_secret")) {
            localStorage.setItem("_secret", encryptionValue);
        }
        localStorage.setItem("swipe", enableSwipe);
        localStorage.setItem("keyToNav", enableKey);
    }

    let encryptionPlaceholder = localStorage.getItem("_secret") || false;

    function changeKey() {
        keyConfigName = "press the new key";
        document.onkeyup = (e) => {
            localStorage.setItem("keyToNav__enable", e.keyCode);
            keyConfigName = `key set as ${e.code}`;
            location.href = "/";
        };
    }

    let current__theme = localStorage.getItem("theme");
    let theme = [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter",
        "modern",
        "hack",
    ];

    function themeChange(themeName) {
        localStorage.setItem("theme", themeName);
        document.querySelector("html").setAttribute("data-theme", localStorage.getItem("theme"))
        current__theme = themeName;
    }
</script>

<div class="text-xl text-center regular-case">Settings</div>
<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Show autoscroll?</div>
        the autoscroll button apears next to the send button and help in going down
        the message list quickly.
        <div class="m-2">
            <input
                type="checkbox"
                bind:checked={showAutoscroll}
                class="toggle toggle-primary"
            />
            <span class="p-2">
                {showAutoscroll}
            </span>
        </div>
    </div>
</div>
<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Custom Encryption</div>
        you can encrypt your messages with custom encryption keys so that only you
        and someone with the same key will be able to see your messages.
    </div>
    <div class="m-2">
        <input
            bind:value={encryptionValue}
            class="input w-full input-bordered input-success m-1"
            placeholder="enter the encryption key"
        />
        <br />
        {#if encryptionPlaceholder}
            <div class="m-2 text-m">
                current key is : <code>{encryptionPlaceholder}</code>
            </div>
        {/if}
    </div>
</div>
<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Enable swipe gestures ?</div>
        if you are on a mobile, you can use swipe genstures to open drawers and to
        navigate with an ease.
        <div class="m-2">
            <input
                type="checkbox"
                bind:checked={enableSwipe}
                class="toggle toggle-primary"
            />
            <span class="p-2">
                {enableSwipe}
            </span>
        </div>
    </div>
</div>

<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Enable key bindings ?</div>
        if you are on a pc, you can use keys (Ctrl by default) to open drawers and
        to navigate with an ease.
        <div class="m-2">
            <input
                type="checkbox"
                bind:checked={enableKey}
                class="toggle toggle-primary"
            />
            <span class="p-2">
                {enableKey}
            </span>
            {#if enableKey}
                <button class="btn btn-info m-1" on:click={changeKey}>
                    {keyConfigName || "Change the key"}
                </button>
            {/if}
        </div>
    </div>
</div>
<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Change theme ?</div>
        just choose a theme then.
        <div class="m-2">
            <!--<div class="dropdown dropdown-top" style="z-index: 99999999;">
                <label tabindex="0" class="btn m-1">
                    choose theme
                </label>
                <ul
                    tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >-->
            {#each theme as theme}
                <!-- svelte-ignore a11y-invalid-attribute -->
                <button
                    class="btn btn-ghost"
                    on:click={() => {
                        themeChange(theme);
                    }}>{theme}</button
                >
            {/each}<!--
                </ul>
            </div>-->
            <div class="p-2 m-1">
               current theme: {current__theme || "none"}
            </div>
        </div>
    </div>
    <div class="m-2 text-xl text-muted text-center">
        settings are automattically saved
    </div>
    <span class="p-2" />
</div>
