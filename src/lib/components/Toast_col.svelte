<script lang="ts" context="module">
    let in_comp_fn;
    export function toast(message, duration, background, color){
        in_comp_fn(message,duration,background,color);
    }
</script>
<script>
  import { onMount } from "svelte";

    import { blur } from "svelte/transition";
    let messages = []
    onMount(() => {
        in_comp_fn = (message, duration = 1500,background="rgb(45,45,100)", color="white") => {
            let id = Date.now()
            messages.push({
                m:message,
                bg:background,
                c:color,
                id: id
            })
            messages = messages
            setTimeout(() => {
                messages = messages.filter(m => m.id != id)
            }, duration)
        }  
    })
</script>
<div class='cont'>
    <!-- {#if messages.length > 0} -->
        {#each messages as m}
            <div transition:blur class='toast' style="background-color:{m.bg}; color: {m.c}">
                <span>{m.m}</span>
            </div>
        {/each}
    <!-- {/if} -->
</div>
<style>
    .cont{
        display: flex;
        flex-direction: column-reverse;
        gap: 1em;
    }
    .toast{
        border-radius: 5px;
        padding: 1em;
        /* box-shadow: 0 5px 10px black; */
    }
</style>