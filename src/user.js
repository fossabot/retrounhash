import GUN from 'gun';
import 'gun/sea';

//import 'gun/lib/radisk2';
//import 'gun/lib/radix2';

import 'gun/axe';
import { writable } from 'svelte/store';

// Database
const peers = [
    "https://gunjs.herokuapp.com/gun",
    "https://gun--server.herokuapp.com/gun",
];
export const db = GUN(
//    {peers}
);

// Gun User
export const user = db.user().recall({ sessionStorage: true });

// Current User's username
export const username = writable('');

user.get('alias').on(v => username.set(v))

db.on('auth', async (event) => {
    const alias = await user.get('alias'); // username string
    username.set(alias);

    console.log(`signed in as ${alias}`);
});