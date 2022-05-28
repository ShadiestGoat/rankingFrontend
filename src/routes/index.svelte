<script lang="ts">
    import { animateNumber, API_BASE, API_BASE_ORIGIN, CHANGE_TIME, type match, AdminPass } from "../stores";
    import { onMount } from "svelte";
    import Profile from "../lib/profile.svelte";
    import { writable } from "svelte/store";
    import NotReady from "$lib/notReady.svelte";
    import Btn from "$lib/btn.svelte";

    const ELO_K = process.env.ELO_K as any as number

    let matchInfo:match | undefined
    let matchReady = false
    let stake = 0
    let adminPass = ""
    
    let player1Light = false
    let player2Light = false

    $: oppositeStake = ELO_K-stake
    $: drawStake = Math.round(Math.abs(stake-oppositeStake)/2)
    let screenWidth = 0

    async function updateStake(init = false) {
        const respStake = await fetch(`${API_BASE}/match/stake`)
        const stakeJSON = await respStake.json()
        if (init) {
            stake = stakeJSON.stake
        } else {
            const anStakeStore = writable(stake)
            anStakeStore.subscribe((n) => {
                stake = n
            })
            animateNumber(stake, stakeJSON.stake, anStakeStore)
        }
    }

    onMount(async () => {
        screenWidth = window.innerWidth
        
        adminPass = AdminPass()
        const resp = await fetch(API_BASE + "/match/")
        console.log(API_BASE + "/match/")

        if (resp.status == 400) {
            const data = await resp.json()
            if (data.err == "NoMatchGoingOn") {
                matchReady = true
            }
        } else if (resp.status != 200) {
            console.error(resp)
            return
        } else {
            matchReady = true
            matchInfo = await resp.json()
            await updateStake(true)
        }

        const ws = new WebSocket(`ws://${API_BASE_ORIGIN}/api/ws`)

        ws.onmessage = async function (e) {
            const eventData:{event:string, data:Record<string, unknown>} = JSON.parse(e.data)
            switch (eventData.event) {
                case "newMatch":
                    await updateStake()
                    matchInfo = eventData.data as match
                case "endMatch":
                    matchInfo = undefined
                    player1Light = false
                    player1Light = false
                case "newPoint":
                    const newMatch = eventData.data as match
                    if (!matchInfo) {
                        matchInfo = newMatch
                        return
                    }
                    
                    player1Light = newMatch.player1Points != matchInfo.player1Points
                    player2Light = newMatch.player2Points != matchInfo.player2Points
                    

                    matchInfo.player1Points = newMatch.player1Points
                    matchInfo.player2Points = newMatch.player2Points

                    const player1ELOStore = writable(matchInfo.player1.elo)                    
                    player1ELOStore.subscribe((n) => {
                        if (matchInfo) matchInfo.player1.elo = n
                    })
                    animateNumber(matchInfo.player1.elo, newMatch.player1.elo, player1ELOStore)

                    const player2ELOStore = writable(matchInfo.player2.elo)                    
                    player2ELOStore.subscribe((n) => {
                        if (matchInfo) matchInfo.player2.elo = n
                    })
                    animateNumber(matchInfo.player2.elo, newMatch.player2.elo, player2ELOStore)
        
                    setTimeout(() => {
                        player1Light = false
                        player2Light = false
                    }, CHANGE_TIME*1.75)
                    await updateStake()
            }
        }
    })
</script>

<svelte:window on:resize={function (e) {
    screenWidth = window.innerWidth
}} />

<div class="row">
    {#if !matchReady}
        <NotReady />
    {:else if matchInfo}
        <div class="col" style="position: absolute;">
            {#if screenWidth > 400}
                <h1 style="margin-top: 44vh; font-size: 5rem">VS</h1>
                <h1 style="font-size: 1.3rem">({matchInfo.player1.elo > matchInfo.player2.elo ? ` ${stake} / ${drawStake} / ${oppositeStake} ` : ` ${oppositeStake} / ${drawStake} / ${stake} `})</h1>
            {/if}
            {#if adminPass}
                <div class="row">
                    <Btn onClick={async () => {
                        await fetch(API_BASE + "/match/end", {
                            method: "POST",
                            headers: {
                                Authorization: adminPass
                            }
                        })
                    }} customStyle="margin: {screenWidth > 400 ? 17 : 78}vh 0 0; width: {19}vw; position: relative;{screenWidth > 680 ? "" : "height: 5rem"}">
                        {#if screenWidth > 680}
                            <h1 style="font-size: 2rem;">END</h1>
                        {/if}
                    </Btn>
                </div>
            {/if}
        </div>
        <Profile pointWon={player1Light} elo={matchInfo.player1.elo} points={matchInfo.player1Points} username={matchInfo.player1.name} color="green" />
        <Profile pointWon={player2Light} elo={matchInfo.player2.elo} points={matchInfo.player2Points} username={matchInfo.player2.name} color="red" />
    {:else}
        <div class="col">
            <h1 style="font-size: 4rem; margin-top: 20vh">No Match is on!</h1>
            {#if adminPass}
                <Btn onClick={() => {location.pathname="/admin"}} customStyle="margin-top: 30vh;">
                    <h1 style="font-size: 2.7rem;">Start One</h1>
                </Btn>
            {/if}
        </div>
    {/if}
</div>
