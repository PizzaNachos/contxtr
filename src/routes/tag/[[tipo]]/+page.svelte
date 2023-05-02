<script lang="ts">
	import Sentence from '$lib/components/Sentence.svelte';
    import { each } from 'svelte/internal';
	import type {WordType, SentenceType} from "$lib/types";
    import { invalidateAll } from '$app/navigation';
	import {draw, blur} from 'svelte/transition'
	import { update_word_database } from '$lib/update';

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
	$: currenct_sentences = sentence_map.get(word?.id ?? "")?.sort((a,b) => a.last_seen < b.last_seen) ?? [];
	$: s = currenct_sentences.shift()
	let sentence_loading = false;

	async function update_word(level: 1 | 2 | 3 | 4){

		let word_clone = structuredClone(word);
		sentence_loading = true;
		word = words.shift() ?? null;
		sentence_loading = false;

		try {
			let new_w : WordType = await update_word_database({word: word_clone,change: level,sentence_id: s.id});
			if (new_w != null){
				let i = 0;
				while (i < words.length && words[i].next_study < new_w.next_study){
					i += 1
				}
				words.splice(i,0,word)
			} else {
				if(word == null){
					invalidateAll();
				}
			}
		} catch(e){

		}

		words = words;
		currenct_sentences.splice(currenct_sentences.length, 0, s)
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Contxt App" />
</svelte:head>

<div class=parent in:blur>
	{#if (words.length == 0 && word == null)}
		<span in:blur>
			<div>Nothing left to study</div>
			<br/>			
			<a href="/tag?time=future">Study ahead by 1 hour</a> or <a href="/create">Create more words</a>
		</span>
	{:else}
	<span in:blur>
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
	.parent a {
		text-decoration: underline;
	}
</style>
