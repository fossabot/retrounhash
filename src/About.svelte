<script>
    import { Card, CardText, CardTitle, MaterialApp } from "svelte-materialify";
    import { user, username } from "./user.js";

    var pubKeyUser = JSON.parse(sessionStorage.getItem("pair")) || {
        pub: ''
    };
    
</script>

<div>
    <main>
        <div class="h3 m-2 text-center">Info</div>
        {#if $username}
            <Card class="m-2">
                <CardTitle>Basic Info</CardTitle>
                <CardText>
                    Username:
                    <span style="user-select: all;">
                        {$username || "not logged in !"}
                    </span>
                    <br />
                    Public Key:
                    <a href={`/User/`+pubKeyUser.pub}>
                    <code style="user-select: all;">
                        {pubKeyUser.pub}
                    </code>
                    </a>
                </CardText>
            </Card>
        {/if}
        <Card class="m-2">
            <CardTitle>Attribution</CardTitle>
            <CardText>
                <div class="m-3 h4">
                    Some libraries and frameworks this application uses.
                </div>
                <a href="https://github.com/amark/gun"
                    ><img
                        alt="amark/gun"
                        class="img-fluid"
                        src="https://gh-card.dev/repos/amark/gun.svg?fullname="
                    /></a
                ><br />
                <a href="https://github.com/TheComputerM/svelte-materialify"
                    ><img
                        alt=""
                        class="img-fluid"
                        src="https://gh-card.dev/repos/TheComputerM/svelte-materialify.svg?fullname="
                    /></a
                ><br />
                <a href="https://github.com/AlexxNB/tinro"
                    ><img
                        alt=""
                        class="img-fluid"
                        src="https://gh-card.dev/repos/AlexxNB/tinro.svg"
                    /></a
                ><br />
                <a href="https://github.com/Templarian/MaterialDesign-JS"
                    ><img
                        alt=""
                        class="img-fluid"
                        src="https://gh-card.dev/repos/Templarian/MaterialDesign-JS.svg"
                    /></a
                ><br />
            </CardText>
        </Card>
    </main>
</div>
