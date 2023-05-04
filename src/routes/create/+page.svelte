<script lang="ts">
    import type { WordType } from '$lib/types';
	import { blur} from 'svelte/transition'
    import { post_sentence, post_word, post_tag } from '$lib/create.js';
    import ToastCol, { toast } from '$lib/components/Toast_col.svelte';

    export let data;
    let { tags_map, words, sentences,tags } = data

    let create_word_word =""
    let create_tag_tag = ""
    let create_sentence_sentence = {
        sentence: ["",""],
        translation: ["","",""]
    }
    async function create_word(e){
        if (create_word_word == ""){
            toast("Cannot create Empty Word", 2000, "rgb(100,0,0)","white")
            return;
        }

        let ret = await post_word(create_word_word)
        if(ret.data){
            let data = ret.data[0]
            toast("Sentence Created", 2000, "rgb(0,150,0)","white")
            create_word_word = "";
            words.push(data)
            words = words
        } else {
            console.error(ret.error)
            toast("There was an API error(Try refreshing the page or relogging in) :(", 2000, "rgb(100,0,0)","white")
        }
    }
    async function create_tag(e){
        if (create_tag_tag == ""){
            toast("Cannot create Empty Tag", 2000, "rgb(100,0,0)","white")
            return;
        }

        let ret = await post_tag(create_tag_tag)
        if(ret.data){
            toast("create_tag_tag Created", 2000, "rgb(0,150,0)","white")
            create_tag_tag = "";
            let my_s = tags_map.get(chosen_word.id) ?? []
            my_s.push(data);
            tags_map.set(chosen_word.id, my_s);
            tags_map = tags_map;
        } else {
            console.error(ret.error)
            toast("There was an API error(Try refreshing the page or relogging in) :(", 2000, "rgb(100,0,0)","white")
        }
    }
    async function create_sentence(){
        if (create_sentence_sentence.translation[1] == "" || chosen_word == null){
            toast("Cannot create Empty Sentence", 2000, "rgb(100,0,0)","white")
            return;
        }

        let ret = await post_sentence(create_sentence_sentence, chosen_word.id)
        if(ret?.data){
            let data = ret.data[0];
            toast("Sentence Created", 2000, "rgb(0,150,0)","white")
            let my_s = sentences.get(chosen_word.id) ?? []
            my_s.push(data);
            sentences.set(chosen_word.id, my_s);
            sentences = sentences;

            create_sentence_sentence = {
                sentence: ["",""],
                translation: ["","",""]
            }
        } else {
            console.error(ret?.error)
            toast("There was an API error(Try refreshing the page or relogging in) :(", 2000, "rgb(100,0,0)","white")
        }


    }

    let chosen_word : WordType | any = {}
    console.log(words)
    $: words.sort((a : WordType,b : WordType) => {
        if (a.competence_object?.status == 'learning' && b.competence_object.status == "learning"){
            if (a.competence_object.learning_step != b.competence_object.learning_step) {
                return  a.competence_object.learning_step - b.competence_object.learning_step
            } else {
                return (sentences.get(a?.id)?.length ?? 0) - (sentences.get(b?.id)?.length ?? 0)
            }
        }
        if (a.competence_object?.status == 'learning') return -1
        if (b.competence_object?.status == 'learning') return 1

        if (a.competence_object.status == "review" && b.competence_object.status == "review"){
            return a.competence_object.ease - b.competence_object.ease;
        }
        });
    $: searched_words = words;
    function search_words(e){
        let t = e?.target?.value ?? ""
        if (!t) {
            searched_words = words
        }
        searched_words = words.filter((w) => w.word.includes(t))
    }
</script>

<svelte:head>
	<title>Contxtr: Creating</title>
	<meta name="description" content="Contxt App" />
</svelte:head>
<div class='container' in:blur>
    <div class="words">
        <input type=text placeholder="search" on:input={(e) => search_words(e)}/>
        <div class="word_list">
            {#each searched_words as w}
                <span class="word_grid" on:click={() => chosen_word=w} on:keypress={() => chosen_word=w} > 
                    <span>{w.word}</span>
                    <span>{w?.competence_object?.status}</span>
                    <span>#s{sentences.get(w.id)?.length ?? 0}</span>
                </span>
            {/each}
        </div>
        <div class="create_word">
            <input id="word_to_create" bind:value={create_word_word}/>
            <button on:click={(e) => create_word(e)}>Create Word</button>
        </div>
    </div>
    <div class="modify_word">
        Modifying Data for word "{chosen_word.word ?? ""}"
            <div class="create_sentence">
                Create Sentence:
                <div class="create_word_input_grid">
                    <input bind:value={create_sentence_sentence.sentence[0]} id="first_half_sentence" type=text placeholder="First Half"/>
                    <span id="target_sentence_word">{chosen_word?.word ?? ""}</span>
                    <input bind:value={create_sentence_sentence.sentence[1]} id="second_half_sentence" type=text placeholder="Second Half"/>

                    <input bind:value={create_sentence_sentence.translation[0]} id="first_half_translation" type=text placeholder="First Half Translation"/>
                    <input bind:value={create_sentence_sentence.translation[1]} id="middle_half_translation" type=text placeholder="Second Half Translation"/>
                    <input bind:value={create_sentence_sentence.translation[2]} id="last_half_translation" type=text placeholder="Last Half Translation"/>
                </div>
                Preview: 
                <div>
                    <div class='sentence_preview'> 
                        <div>
                            <span>{create_sentence_sentence.sentence[0]}<span class="target">{chosen_word?.word ?? ""}</span>{create_sentence_sentence.sentence[1]}</span>
                            <span>{create_sentence_sentence.translation[0]}<span class="target">{create_sentence_sentence.translation[1]}</span>{create_sentence_sentence.translation[2]}</span>
                        </div>
                    </div>
                    <button on:click={create_sentence}>Create Sentence</button>    
                </div>

                <div class="chosen_sentences">
                    {#each sentences.get(chosen_word?.id) ?? [] as s}
                    <div>
                        {s.text[0]}{chosen_word?.word}{s.text[1]}
                        <br/>
                        {s.translation[0]}{s.translation[1]}{s.translation[2]}
                    </div>
                    {/each}
                </div>
      
            </div>

            <div class="create_tag">
                <input id="tag_to_create" bind:value={create_tag_tag}/>
                <button on:click={(e) => create_tag(e)}>Create a new Tag</button>
                <div class="add_tag_to_word">
                    <div class="chosen_sentences">
                        {#if (tags_map.get(chosen_word?.id)?.length ?? 0) > 0 }
                            Tags for {chosen_word.word ?? ""}
                        {:else}
                            No tags for {chosen_word.word ?? ""}
                        {/if}
                        {#each tags_map.get(chosen_word?.id) ?? [] as s}
                            <div>
                                {s.name}
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="tags">
                    {#each tags as t}
                        {JSON.stringify(t)}            
                    {/each}
                </div>
            </div>
                </div>


    <div class='toast'>
        <ToastCol />
    </div>
</div>
<style>
    .container{
        position: relative;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 20em 20em 20em;
        gap: 2em;
    }
    .toast{
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
    .words{
        grid-row: 1 / 3;
        margin: 0em 0;
        padding: 1em;
        display: flex;
        flex-direction: column;
        color: white;
        gap: 1em;
        font-size: large;
        background-color: rgba(30,30,30,1);
        border-radius: 10px;
    }
    .word_list{
        display: flex;
        flex-direction: column;
        color: white;
        gap: 1em;
        font-size: large;
        background-color: rgba(30,30,30,1);
        overflow-y: scroll;
    }
    .modify_word{
        font-size: larger;
        display: flex;
        flex-direction: column;
        gap: 1em;
        grid-row: 1 / 3;
    }
    .create_sentence{
        padding: 1em;
        background-color: rgb(30,30,30);
        border-radius: 10px;
    }
    .create_sentence > *{
        margin-bottom: 1em;
    }
    .create_sentence button{
        float: right;
    }

    .create_tag{
        padding: 1em;
        background-color: rgb(30,30,30);
        border-radius: 10px;
    }

    .create_word_input_grid{
        display: grid;
        grid-template-columns: 2fr 1fr 2fr;
    }
    .create_word_input_grid #target_sentence_word{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: larger;
    }
    input{
        padding: 1ch;
        font-size: 1.15rem;
        border-radius: 10px;
        background-color: rgb(20,20,20);
        color: white;
        border: 2px solid black;
        outline: none;
        transition: all .25s ease;
        min-width: 5ch;
    }
    button{
        font-size: 1rem;
        padding: .5em;
        border-radius: 5px;
        background-color: rgb(60,60,60);
        color: white;
        transition: all .5s ease;
        border: 2px solid rgba(0,0,0,0);
    }
    button:hover{
        border: 2px solid black;
    }
    .word_grid{
        display: grid;
        grid-template-columns: 2fr 1fr 3ch;
    }
    .sentence_preview{
        width: fit-content;
        padding: .5em;
        border-radius: 5px;
        background-color: rgb(20,20,20);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1em;
    }

    .sentence_preview div{
        width: fit-content;
        padding: .5em;
        border-radius: 5px;
        background-color: rgb(20,20,20);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 1em;
    }

    .sentence_preview
    .target{
        color: rgb(200,200,250);
        font-weight: 500; 
    }
    .chosen_sentences{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1em;
        padding: 1em;
    }
    .chosen_sentences * {
        padding: .5em;
        border-radius: 5px;
        background-color: rgb(20,20,20);
    }
</style>