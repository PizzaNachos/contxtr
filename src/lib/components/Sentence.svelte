<script lang="ts">
  import { fade } from "svelte/transition";
  import type { SentenceType, WordType } from "$lib/types";

  export let me: SentenceType | any;
  export let target: WordType | any;
  export let update_function: Function;
  export let loading_w: Boolean = false;

  let input_val = "";
  function check(e: any) {
    let i : string = e?.target?.value?.trim().toLowerCase();
    if (target.reverse) {
      if (i == target.word.trim().toLowerCase()) {
        shown = 2;
      }
    } else {
      if (i == me.match_regex.trim().toLowerCase()) {
        shown = 2;
      }
    }
  }

  let shown = 0;
  function show_translation() {
    if (shown < 2) {
      shown += 1;
    }
  }
  function update(level) {
    input_val = "";
    shown = 0;
    update_function(level);
  }
  function num_input(e : any) {
    let k = Number(e?.key);
    if ((k == 1 || k == 2 || k == 3 || k == 4) && shown == 2) {
      update(k);
      e.preventDefault()
    }
  }
</script>

{#if target.reverse == true}
  <div class="card" on:keypress={(e) => num_input(e)}>
    <span class:loading_w>
      {me.translation[0]}<span class="target">{me.translation[1]}</span>{me.translation[2]}
    </span>
    <input class={shown == 2 ? "disabled" : ""} type="text" on:input={(e) => check(e)} bind:value={input_val}/>
    <div>
      {#if shown == 0}
        <button on:click={() => show_translation()}> Show </button>
      {:else if shown == 1}
        <button on:click={() => show_translation()}> Show All </button>
      {/if}
    </div>

    {#if shown > 0}
      <span class="translation" in:fade>
        <span>{me.text[0]}</span><span>
          {#if shown == 1}
            {"_".repeat(target.word.length)}
          {:else if shown == 2}
            {target.word}
          {/if}
        </span><span>{me.text[1]}</span>
      </span>
    {/if}

    <div class="finish_buttons" in:fade>
      {#if shown == 2}
        <button class="next_button" on:click={() => { update(1);}}>
          Fail (1)
        </button>
        <button class="next_button" on:click={() => {update(2)}}>
          Hard (2)
        </button>
        <button
          class="next_button"
          on:click={() => {
            update(3);
          }}
        >
          Good (3)
        </button>
        <button
          class="next_button"
          on:click={() => {
            update(4);
          }}
        >
          Easy (4)
        </button>
      {/if}
    </div>
  </div>
{:else}
  <div class="card" on:keypress={(e) => num_input(e)}>
    <span class:loading_w>
      {me.text[0]}<span class="target">{target.word}</span>{me.text[1]}
    </span>
    <input class={shown == 2 ? "disabled" : ""} type="text" on:input={(e) => check(e)} bind:value={input_val} />
    <div>
      {#if shown == 0}
        <button on:click={() => show_translation()}> Show </button>
      {:else if shown == 1}
        <button on:click={() => show_translation()}> Show All </button>
      {/if}
    </div>

    {#if shown > 0}
      <span class="translation" in:fade>
        {me.translation[0]}
        {#if shown == 1}
          {"_".repeat(target.word.length)}
        {:else if shown == 2}
          {me.translation[1]}
        {/if}
        {me.translation[2]}
      </span>
    {/if}

    <div class="finish_buttons" in:fade>
      {#if shown == 2}
        <button class="next_button" on:click={() => {update(1)}}>
          Fail (1)
        </button>
        <button
          class="next_button"
          on:click={() => {
            update(2);
          }}
        >
          Hard (2)
        </button>
        <button
          class="next_button"
          on:click={() => {
            update(3);
          }}
        >
          Good (3)
        </button>
        <button
          class="next_button"
          on:click={() => {
            update(4);
          }}
        >
          Easy (4)
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  span.target {
    color: rgb(200, 200, 250);
    font-weight: 500;
  }
  .card {
    font-size: 1.5rem;
    border-radius: 10px;
    background-color: rgb(40, 40, 40);
    padding: 1em 2em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
    box-shadow: 0 0 10px black;
  }
  .card span {
    transition: all 0.25s ease-in-out;
  }
  input {
    padding: 1ch;
    font-size: 1em;
    border-radius: 10px;
    background-color: rgb(20, 20, 20);
    color: white;
    border: 2px solid black;
    outline: none;
    transition: all 0.25s ease;
    width: 100%;
  }
  .finish_buttons {
    height: 3em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
  }
  .translation {
    overflow-wrap: break-word;
  }
  button {
    font-size: 0.85em;
    padding: 0.5em;
    border-radius: 5px;
    background-color: rgb(60, 60, 60);
    color: white;
    transition: all 0.5s ease;
    border: 2px solid rgba(0, 0, 0, 0);
  }
  button:hover {
    border: 2px solid black;
  }
  .next_button {
    background-color: rgb(80, 80, 80);
  }
  input.disabled {
    background-color: rgb(35, 35, 35);
    border: 2px solid rgba(0, 0, 0, 0);
  }
  .loading_w {
    opacity: 0;
  }
</style>
