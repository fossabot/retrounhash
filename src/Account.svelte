<script>
    import {
        Card,
        CardText,
        CardActions,
        CardTitle,
        Button,
        Dialog,
        MaterialApp,
    } from "svelte-materialify";

    import Swal from "sweetalert2";
    import { user, username } from "./user.js";

    function deleteAccount() {
        Swal.fire({
            title: "enter your username",
            input: "text",
            showCancelButton: true,
            confirmButtonText: "next",
            showLoaderOnConfirm: true,
            preConfirm: (_username) => {
                Swal.fire({
                    title: "enter your password",
                    input: "text",
                    showCancelButton: true,
                    preConfirm: (password) => {
                        user.delete(_username, password, console.log);
                        user.leave();
                        location.href = "/";
                    },
                });
            },
        });
    }

    function changePassword() {
        Swal.fire({
            title: "enter your username",
            input: "text",
            confirmButtonText: "next",
            showCancelButton: true,
            preConfirm: (_name) => {
                Swal.fire({
                    title: "enter your password",
                    input: "password",
                    confirmButtonText: "next",
                    preConfirm: (pass) => {
                        Swal.fire({
                            title: "enter new password",
                            confirmButtonText: "change it",
                            input: "password",
                            preConfirm: (newPass) => {
                                user.leave();
                                user.auth(_name, pass, {
                                    change: newPass,
                                });
                            },
                        });
                    },
                });
            },
        });
    }
</script>

<MaterialApp>
    <main>
        <div class="display-2 m-2 text-center">Account</div>
        <Card class="m-2">
            <CardTitle>Delete my account</CardTitle>
            <CardText>
                After this action, your account will be permanently deleted and
                will stand no way to recover.
            </CardText>
            <CardActions>
                <Button on:click={deleteAccount}>Delete my account</Button>
            </CardActions>
        </Card>
        <Card class="m-2">
            <CardTitle>Change your password</CardTitle>
            <CardText>
                here, you can change tour password and have a new one :)
            </CardText>
            <CardActions>
                <Button on:click={changePassword}>Change Password</Button>
            </CardActions>
        </Card>
    </main>
</MaterialApp>
