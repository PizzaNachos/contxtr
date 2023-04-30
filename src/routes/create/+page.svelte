<script lang="ts">
    import type { WordType } from '../aapi/types.js';
	import { blur} from 'svelte/transition'
    import { supabase } from '$lib/supabase_client.js';
    import { get_user_id, user } from '$lib/user_store.js';
    import { get } from 'svelte/store';
    import { post_sentence, post_word } from '$lib/create.js';
    import ToastCol, {toast} from '$lib/components/Toast_col.svelte';
    export let data;
    let {tags,words, sentences} = data

    let create_word_word =""
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
            toast("Sentence Created", 2000, "rgb(0,150,0)","white")
            create_word_word = "";
            words.push(ret.data)
            words = words
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
        if(ret.data){
            toast("Sentence Created", 2000, "rgb(0,150,0)","white")
            let my_s = sentences.get(chosen_word.id) ?? []
            my_s.push(ret.data);
            sentences.set(chosen_word.word, my_s);
            sentences = sentences;

            create_sentence_sentence = {
                sentence: ["",""],
                translation: ["","",""]
            }
        } else {
            console.error(ret.error)
            toast("There was an API error(Try refreshing the page or relogging in) :(", 2000, "rgb(100,0,0)","white")
        }


    }
    function create_tag(){

    }
    function reload_data(){

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
<div class='container' in:blur>
    <div>
        Create Sentence:
        <div class="create_sentence">
            <div class="words">
                <input type=text placeholder="search" on:input={(e) => search_words(e)}/>
                {#each searched_words as w}
                    <span class="word_grid" on:click={() => chosen_word=w} on:keypress={() => chosen_word=w} > 
                        <span>{w.word}</span>
                        <span>{w?.competence_object?.status}</span>
                        <span>#s{sentences.get(w.id)?.length ?? 0}</span>
                    </span>
                {/each}
            </div>
            <div>
                <div class="create_word_input_grid">
                    <input bind:value={create_sentence_sentence.sentence[0]} id="first_half_sentence" type=text placeholder="First Half"/>
                    <span id="target_sentence_word">{chosen_word?.word ?? ""}</span>
                    <input bind:value={create_sentence_sentence.sentence[1]} id="second_half_sentence" type=text placeholder="Second Half"/>

                    <input bind:value={create_sentence_sentence.translation[0]} id="first_half_translation" type=text placeholder="First Half Translation"/>
                    <input bind:value={create_sentence_sentence.translation[1]} id="middle_half_translation" type=text placeholder="Second Half Translation"/>
                    <input bind:value={create_sentence_sentence.translation[2]} id="last_half_translation" type=text placeholder="Last Half Translation"/>
                </div>
                <div>
                    ¿
                </div>
                <button on:click={create_sentence}>Create Sentence</button>

                <div class='sentence_preview'> 
                    <div>
                        {create_sentence_sentence.sentence[0]}<span class="target">{chosen_word?.word ?? ""}</span>{create_sentence_sentence.sentence[1]} 
                    </div>
                    <div>
                        {create_sentence_sentence.translation[0]}<span class="target">{create_sentence_sentence.translation[1]}</span>{create_sentence_sentence.translation[2]} 
                    </div>
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
        </div>
    </div>
    <div class="create_word">
        <input id="word_to_create" bind:value={create_word_word}/>
        <button on:click={(e) => create_word(e)}>Create Word</button>
    </div>

    <div class='toast'>
        <ToastCol />
    </div>
    <!-- {#if error == true}
    <div transition:blur class='toast error'>
        {error_message}
    </div>
    {/if}
    {#if success == true}
    <div transition:blur class='toast success'>
        {success_message}
    </div>
    {/if} -->
</div>
<style>
    .container{
        position: relative;
    }
    .toast{
        position: fixed;
        bottom: 10px;
        right: 10px;
        /* border-radius: 10px; */
        /* padding: 1em; */
        /* box-shadow: 0 0 5px black; */
    }
    /* .error{
        color: white;
        background-color: rgba(200,0,0);
        font-weight: 800;
        font-size: 1.2em;
    }
    .success{
        color: white;
        background-color: rgb(22, 76, 22);
        font-weight: 800;
        font-size: 1em;
    } */
    .words{
        margin: 0em 0;
        padding: 0 1em 1em 1em;
        display: flex;
        flex-direction: column;
        color: white;
        gap: 1em;
        font-size: large;
        background-color: rgba(30,30,30,1);
        border-radius: 10px;
        overflow-y: scroll;
        max-height: 50vh;
    }

    .create_sentence{
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2em;
        /* max-height: 100vh; */
        /* overflow: hidden; */
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
        margin: 2em;
        padding: .5em;
        border-radius: 5px;
        background-color: rgb(30,30,30);
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .target{
        color: rgb(200,200,250);
        font-weight: 500; 
    }
    .chosen_sentences{
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 1em;
    }
</style>