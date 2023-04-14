<script>

	import './styles.css';
	import {draw, blur} from 'svelte/transition'
	import { supabase } from '$lib/supabase_client';
    import { afterNavigate, beforeNavigate } from '$app/navigation';
	let logged_in = 0
	let usr = {
		usr:"",
		pws:""
	}

	supabase.auth.refreshSession().then(res => {
		if (res.data.session == null){
			logged_in = -1
		} else {
			logged_in = 1
		}
	}).catch(err => {
		logged_in = -1
	})

	const l = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: usr.usr,
			password: usr.pws,
		})
		if (error){
			logged_in = -1
			// console.log(error)
		} else if(data){
			logged_in = 1
			// console.log(data, supabase)
		}
	}
	let loading = false
	beforeNavigate(() => {
		loading = true;
	})
	afterNavigate(() => {
		loading = false
	})
</script>

<!-- <div class="app"> -->
	{#if logged_in == -1}
	<main>
		<input type=text bind:value={usr.usr}/>
		<input type=password bind:value={usr.pws}/>
		<button on:click={() => l()}>L</button>
	</main>

	{:else if logged_in == 1}
		<header>
			<a href="/">Contxt'r</a>
			<div class='links'>
				<a href="/tag">Words</a>
				<a href="/create">Create stuff</a>
			</div>

		</header>
		{#if !loading}
		<main transition:blur>
			<slot />
		</main>
		{:else} 
		<div class="l_c">
			<div class="loading">
				<span>Loading</span>
			</div>
		</div>

		{/if}

	{:else if logged_in == 0 }
	<div class='l_c'>
		<div class="loading">
			<span>Loading</span>
		</div>
	</div>

	{/if}

<style>
	.l_c{
		height:100vh;
	}
	main{
		padding: 3em;
		transition: opacity .25s ease-in-out;
	}
	header {
		/* width: 100%; */
		position: sticky;
		background-color: rgb(30,30,30);
		padding: 1em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 2em;
	}
	header > a{
		font-size: 2em;
		padding: 1em;
	}
	.links > a {
		font-size: 1rem;
		border-radius: 5px;
		transition: all .25s ease-in-out;
		background-color: rgb(30,30,30);
		padding: 10px;
	}
	a:hover{
		background-color: rgb(30,30,30);
	}
</style>
