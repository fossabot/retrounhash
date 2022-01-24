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
    import { user, username } from "./user.js";

    function deleteAccount() {
        Swal.fire({
            title: 'enter your username',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'next',
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
                Swal.fire({
                    title: 'enter your password',
                    input: 'text',
                    showCancelButton: true,
                    preConfirm: (_username) => {
                        user.delete(_username, password, console.log);
                        user.leave();
                        location.href = "/";
                    }
                })
            }
        })
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
    </main></MaterialApp
>
