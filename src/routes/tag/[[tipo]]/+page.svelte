<script lang="ts">
	import Sentence from '$lib/images/Sentence.svelte';
    import { each } from 'svelte/internal';
	import type {WordType, SentenceType} from "../../aapi/types";
    import { invalidateAll } from '$app/navigation';
	import {draw, blur} from 'svelte/transition'

	export let data;

	let {sentence_map, words} = data;
	let test_word : WordType = {
		competence_object: {
			ease: 0,
			learning_step: 1,
			status: 'learning',
		},
		id: -1,
		next_study: 0,
		word: "something broke",
		reverse: false
	}

	let word = words.shift() ?? null// ?? test_word;
	$: currenct_sentences = sentence_map.get(word?.word ?? "")?.sort((a,b) => a.last_seen < b.last_seen) ?? [];
	$: s = currenct_sentences.shift()
	let sentence_loading = false;

	async function update_word(level){
		sentence_loading = true;
		let data = {
			word: word,
			change: level,
			sentence_id: s.id
		}

		let new_w = await fetch("/aapi/update/word", {
			method: "POST",
			body: JSON.stringify(data),
		}).then(res => res.json())

		if (new_w != ""){
			let i = 0;
			while (i < words.length && words[i].next_study < new_w.next_study){
				i += 1
			}
			words.splice(i,0,word)
			word = words.shift() ?? test_word;
		} else {
			word = words.shift() ?? null;
			if(word == null){
				invalidateAll();
			}
		}
		words = words;
		currenct_sentences.splice(currenct_sentences.length, 0, s)
		sentence_loading = false;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Contxt App" />
</svelte:head>

<div class=parent>
	{#if (words.length == 0 && word == null)}
		<span transition:blur>
			<span>Nothing left to study</span>			
			<a href="/tag?time=future">Study ahead by 1 hour</a>
		</span>
	{:else}
	<span transition:blur>
		<Sentence 
		me={s} 
		target={word} 
		update_function={update_word}
		loading_w={sentence_loading}
		/>
	<span>Words left to study {words.length}</span>
	</span>
	{/if}

</div>

<style>
	.parent{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 3em;
		margin: auto;
	}
</style>
