<script lang="ts">
    import NotReady from "$lib/notReady.svelte";
    import { AdminPass, API_BASE, type player } from "../stores";
    import { onMount } from "svelte";
    import Btn from "$lib/btn.svelte";
    
    let ready = false
    let adminPass = ""
    let players:player[] = []
    let selected:string[] = []

    function selectID(id:string) {
        const index = selected.indexOf(id)
        if (index == -1) {
            selected[1] = selected[0]
            selected[0] = id
        } else {
            if (index == 0) {
                selected[0] = selected[1]
            }
            selected[1] = ""
        }
    }

    onMount(async () => {
        adminPass = AdminPass()
        if (adminPass) {
            const resp = await fetch(`${API_BASE}/players`)
            players = await resp.json()
        }
        
        ready = true
    })

    async function start(id1:string, id2:string) {
        await fetch(`${API_BASE}/match/new`, {
            "body": JSON.stringify({
                player1: id1,
                player2: id2,
            }),
            "method": "POST",
            "headers": {
                Authorization: adminPass
            }
        })
        
        location.pathname = "/"
    }

</script>

<style>
    .btn-h3 {
        font-size: 1rem;
    }
    .btn-h1 {
        font-size: 2.7rem;
    }
</style>

{#if !ready}
    <NotReady />
{:else if !adminPass}
    <h1 style="font-size: 4rem; margin-top: 25vh">You aren't admin!</h1>
{:else}
    <div class="row" style="flex-wrap:wrap">
        {#each players as pl (pl.id)}
            <Btn enabled={selected.includes(pl.id)} onClick={() => selectID(pl.id)}>
                <h3 class="btn-h3">{pl.name}</h3>
                <h3 class="btn-h3">({pl.elo})</h3>
            </Btn>
        {/each}
    </div>
    <Btn onClick={async () => (await start(selected[1], selected[0]))} disabled={(selected[1] ?? "") == ""} customStyle="position:absolute; top: 70vh; width: 80vw; margin-left: 10vw">
        <h1 class="btn-h1">Start!</h1>
    </Btn>
{/if}
