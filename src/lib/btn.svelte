<script lang="ts">
    export let onClick:()=>(Promise<unknown>|unknown)
    export let disabled = false
    export let enabled = false
    export let customClass = ""
    export let customStyle = ""
</script>

<style>
    .btn {
        background-color: #252525;
        border-radius: 25px;
        padding: 4.5vh 5vw;
        margin: 3vh 7vw;
        border: #252525 solid 2px;
        transition: background-color 0.4s, border 0.4s, opacity 0.4s;
    }

    .btn:not(:disabled):hover, .btn-enabled {
        cursor: pointer;
        background-color: #1d1d1d;
        border: #6e6e6e solid 2px;
    }

    .btn:disabled:hover {
        opacity: 0.4;
    }
</style>

<button on:click={onClick} disabled={disabled} class="btn {enabled ? "btn-enabled" : ""} {customClass}" style={customStyle} >
    <slot />
</button>