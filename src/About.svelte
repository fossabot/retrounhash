<script>
    import { user, username } from "./user.js";

    var pubKeyUser = JSON.parse(sessionStorage.getItem("pair")) || {
        pub: "",
    };
</script>

<div>
    <main>
        <h1 class="text-center text-xl normal-case">Info</h1>
        {#if $username}
            <div class="card w-full m-4 bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="card-title">Basic Info</div>
                    Username:
                    <span style="user-select: all;">
                        {$username || "not logged in !"}
                    </span>
                    <br />
                    Public Key:
                    <a href={`/User/` + pubKeyUser.pub}>
                        <code style="user-select: all;">
                            {pubKeyUser.pub}
                        </code>
                    </a>
                </div>
            </div>
        {/if}
        <div class="card w-full m-4 bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="card-title">Attribution</div>
                <div class="text-md">Some libraries and frameworks this application uses.</div>
                <a href="https://github.com/amark/gun"
                    ><img
                        alt="amark/gun"
                        src="https://gh-card.dev/repos/amark/gun.svg?fullname="
                    /></a
                ><br />
                <a href="https://github.com/saadeghi/daisyui"
                    ><img
                        alt=""
                        src="https://gh-card.dev/repos/saadeghi/daisyui.svg?fullname="
                    /></a
                ><br />
                <a href="https://github.com/AlexxNB/tinro"
                    ><img
                        alt=""
                        src="https://gh-card.dev/repos/AlexxNB/tinro.svg"
                    /></a
                ><br />
                <a href="https://github.com/Templarian/MaterialDesign-JS"
                    ><img
                        alt=""
                        src="https://gh-card.dev/repos/Templarian/MaterialDesign-JS.svg"
                    /></a
                ><br />
            </div>
        </div>
    </main>
</div>
