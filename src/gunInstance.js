import "gun/lib/radisk";
import "gun/lib/radix";
import "gun/lib/rindexed";


import Gun from "gun";
const peers = [
    "http://localhost:8765/gun",
    "https://gun--server.herokuapp.com/gun",
];

export const db2 = new Gun({
    peers: peers,
    radisk: false,
    axe: true,
    rindexed: true,
    localStorage: false,
});