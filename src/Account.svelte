<script>
    import Swal from "sweetalert2";
    import { user, username } from "./user.js";

    var pubKeyUser = JSON.parse(sessionStorage.getItem("pair")) || {
        pub: "",
    };
    const persistUsername = username;

    function deleteAccount() {
        /*Swal.fire({
            title: "enter your username",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "next",
            showLoaderOnConfirm: true,
            preConfirm: (_username) => {*/
        Swal.fire({
            title: "Delete it ?",
            icon: "warning",
            confirmButtonText: "destroy",
            showCancelButton: true,
            preConfirm: () => {
                user.delete(JSON.parse(sessionStorage.getItem("pair")), () => {
                    user.leave();
                });
                localStorage.clear();
                location.href = "/";
            },
        });
        /*},
        });*/
    }

    function changePassword() {
        /* Swal.fire({
            title: "enter your username",
            input: "text",
            confirmButtonText: "next",
            showCancelButton: true,
            preConfirm: (_name) => {*/
        Swal.fire({
            title: "enter new password",
            confirmButtonText: "change it",
            input: "password",
            preConfirm: (newPass) => {
                user.auth(JSON.parse(sessionStorage.getItem("pair")), {
                    change: newPass,
                });
            },
        });
        /*},
        });*/
    }
</script>

<div class="text-xl text-center regular-case">Account</div>
<div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <div class="card-title">Basic Info</div>
        Username: {$username || "not logged in !"}
        <br />
        Public Key:
        <a href={`/User/` + pubKeyUser.pub}>
            <div class="mockup-code m-2">
                <div class="m-2">
                    {pubKeyUser.pub}
                </div>
            </div>
        </a>
    </div>
</div>
<div class="m-4">
    <main>
        <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="card-title">Change your password</div>
                here, you can change tour password and have a new one :)
            </div>
            <div class="m-2">
                <button class="btn btn-warning m-2" on:click={changePassword}
                    >Change Password</button
                >
            </div>
        </div>
        <div class="card mb-5 mt-5 w-full bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="card-title">Delete my account</div>
                After this action, your account will be permanently deleted and will
                stand no way to recover.
            </div>
            <div class="m-2">
                <button class="btn btn-danger m-2" on:click={deleteAccount}
                    >Delete my account</button
                >
            </div>
        </div>
    </main>
</div>
