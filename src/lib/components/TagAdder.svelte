<script lang="ts">
  import type { TagType, WordType } from "$lib/types";
  import { add_tag_database, remove_tag_database } from "$lib/update";

    export let word : WordType;
    export let tags : TagType[];
    export let tag_map : Map<number, TagType[]>;

    $: my_tags = tag_map.get(word.id) ?? [];
    $: not_mine = tags.filter(x => {
        return !my_tags.includes(x) 
    })

    // UI ONLY
    async function remove_tag(tag : TagType){
        await remove_tag_database(tag, word)

        my_tags = my_tags.filter(x => x.id != tag.id) ?? [];
        console.log(tag, my_tags)

    }

    async function add_tag(tag: TagType){
        await add_tag_database(tag,word);

        my_tags.push(tag)
        my_tags =  my_tags

    }
</script>

{#if word.word != ""}
<div class="container"> 
    {#if my_tags.length > 0 }
        Tags for {word.word ?? ""}
    {:else}
        No tags for {word.word ?? ""}
    {/if}

    <div class="add_tag">
        <div class="left">
            {#each my_tags as s}
                <div on:click={() => remove_tag(s)} on:keypress={() => remove_tag(s)} class='left_tag tag'>
                    {s.name}
                </div>
            {/each}
        </div>
        <div class='right'>
            {#each not_mine as t}
                <div on:click={() => add_tag(t)} on:keypress={() => add_tag(t)} class='right_tag tag' >
                    {t.name} 
                </div>
            {/each}
        </div>
    </div>
</div>
{/if}

<style>
    .container{
        background-color :rgb(30,30,30);
        border-radius: 5px;
        padding: 2em;
        font-size: larger;
    }
    .add_tag{
        padding-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }
    .left{
        display: flex;
        flex-direction: column;
        gap: 5px;
        justify-content: flex-start;
        align-items: flex-start;  
        background-color: rgb(30,55,30);

        border-radius: 5px;
    }
    .right{
        display: flex;
        flex-direction: column;
        gap: 5px;
        justify-content: flex-start;
        align-items: flex-start;
        background-color: rgb(55,30,30);

        border-radius: 5px;
    }
    .tag{
        padding: 4px 10px;
        border-radius: 0;
        border: 2px solid rgba(0,0,0,0);
        transition: all .3s ease;
    }
    .right_tag:hover{
        background-color: rgb(45,   45, 45);
		border: 2px solid  rgb(50,235,100);
        border-radius: 5px;
    }
    .left_tag:hover{
        background-color: rgb(45,   45, 45);
        border: 2px solid  rgb(235,50,100);
        border-radius: 5px;
    }
</style>