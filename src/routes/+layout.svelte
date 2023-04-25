<script>

	import './styles.css';
	import {draw, blur} from 'svelte/transition'
	import { supabase } from '$lib/supabase_client';
    import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { user, login, refresh_user } from '$lib/user_store';
	
	refresh_user()

	let usr = {
		usr:"",
		pws:""
	}

	let loading = false
	beforeNavigate(() => {
		loading = true;
	})
	afterNavigate(() => {
		loading = false
	})
</script>

<div>
{#if $user.logged_in == -1}
<main>
	<input type=text bind:value={usr.usr}/>
	<input type=password bind:value={usr.pws}/>
	<button on:click={() => login(usr)}>L</button>
</main>

{:else if $user.logged_in == 1}
	<header>
		<a href="/">Contxt'r</a>
		<div class='links'>
			<a href="/tag">Words</a>
			<a href="/create">Create stuff</a>
		</div>
	</header>
	
	<main transition:blur class:loading>
		<slot />
	</main>

{:else if $user.logged_in == 0 }
<div class='l_c'>
	<div class="loading">
		<span>Loading</span>
	</div>
</div>
{/if}
</div>
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
