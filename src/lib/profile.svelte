<script lang="ts">
import { AdminPass, API_BASE } from "../stores";

import { onMount } from "svelte";


    export let username:string
    export let elo:number
    export let points:number
    export let color:("red" | "green")
    export let pointWon:boolean

    let adminPass = ""

    onMount(() => {
        adminPass = AdminPass()
    })
</script>

<style>
    .profile {
        height: 100vh;
        width: 50vw;
        justify-content: space-around;
    }
    .username {
        font-size: 3.5rem;
        line-height: 1.4;
    }
    .elo {
        margin: 1vh 2vw;
        font-size: 1.4rem;
        color: var(--color);
        line-height: 1.4;
    }
    .score {
        /* margin-top: 3vh; */
        font-size: 13rem;
    }
    .red {
        --color: #b91010;
    }
    .green {
        --color: #05bb05;
    }
    .gray {
        --color: #5f5f5f;
    }
    .ico {
        --color: var(--ico);
    }
    .color-inidicator {
        background: transparent;
        border: var(--color) 2px solid;
        height: 15vh;
        margin-left: auto;
        margin-right: auto;
        width: 23vw;
        border-radius: 6.25px;
        margin-bottom: 5vh;
        transition: box-shadow 0.5s, background 0.5s;
    }
    .color-inidicator:hover:not(:disabled) {
        cursor: pointer;
        background-color: var(--color);
    }
    .point-gotten {
        background: var(--color);
        box-shadow: 0 0 20px 6px var(--color);
    }
</style>

<div class="profile col">
    <div class="row" style="justify-content: center;">
        <div class="col">
            <h1 class="username">{username}</h1>
            <h2 class="elo ico">({elo})</h2>
        </div>
    </div>
    <h1 class="score row">{points}</h1>
    <button disabled={adminPass == ""} on:click={async () => {
        await fetch(API_BASE + "/match/" + (color == "green" ? "player1" : "player2"), {
            headers: {
                Authorization: adminPass
            },
            method: "POST",
        })
    }} class="color-inidicator row {color} {pointWon ? "point-gotten" : ""}"></button>
</div>
