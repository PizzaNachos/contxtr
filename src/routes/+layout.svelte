<script context="module">
</script>
<script lang="ts">
	import './styles.css';
	import {blur} from 'svelte/transition'
    import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { user, login,logout } from '$lib/user_store';
	import { onMount } from "svelte";
	import {refresh_user} from "$lib/user_store"

	let usr = {
		usr:"",
		psw:""
	}
	let loading = false
	beforeNavigate(() => {
		loading = true;
	})
	afterNavigate(() => {
		loading = false
	})
	onMount(async() => {
		await refresh_user()
	})
</script>

<div>
{#if $user.logged_in == -1}
	<main>
		<div>
			Welcome to Contxtr, the Language Vocab Flash Card App (With Context!)
		</div>
		Login
		<input type=text bind:value={usr.usr}/>
		<input type=password bind:value={usr.psw}/>
		<button on:click={() => login(usr)}>Login</button>
	</main>
{:else if $user.logged_in == 1}
<div class="page">
	<header>
		<a href="/">Contxt'r</a>
		<div class='links'>
			<a href="/study">Study</a>
			<a href="/create">Create stuff</a>
		</div>
		<button on:click={logout} class="logout">Logout</button>
		{$user.user.email}
	</header>

	<main class:loading>
		{#if loading}
			<span class='word'>Loading</span>
		{/if}
		<div class="content">
			<slot />
		</div>
	</main>

	<footer>
		This is an open source project
	</footer>
</div>
{:else}
	<div class='l_c'>
		<div class="auth_loading">
			<span>Loading</span>
		</div>
	</div>
{/if}
</div>

<style>
	.page{
		min-height: 100vh;
	}
	.l_c{
		height:100vh;
	}
	.auth_loading{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		animation: 1s ease 0s infinite loading_anim;
	}
	@keyframes loading_anim {
	0% {
		background-color: inherit;
	}
	50%{
		background-color: rgb(50, 50, 50);
	}
	100% {
		background-color: inherit;
	}
}
	main{
		padding: 3em;
		transition: opacity .25s ease-in-out;
		min-height: 65vh;
	}
	main .word{
		padding: 3em;
		animation: flash_word 1s linear;
	}
	@keyframes flash_word {
		0% {
			color: rgb(150, 150, 150);
		}
		50%{
			color: rgb(250, 250, 250);
		}
		100% {
			color: rgb(150, 150, 150);
		}
	}

	header {
		position: sticky;
		background-color: rgb(30,30,30);
		padding: 1em;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 2em;
		height: 10vh;
	}
	header > a{
		font-size: 2em;
		padding: 1em;
	}
	footer{
		background-color: rgb(30,30,30);
		height: 25vh;
		padding: 5em;
	}
	button{
		background-color: inherit;
		font-size: 1rem;
		transition: all .32s ease-in-out;
		background-color: rgb(30,30,30);
		padding: 10px;
		color:white;
		border: 2px solid rgb(30,30,30);
	}
	.logout{
		justify-self: flex-end;
	}
	.links > a {
		font-size: 1rem;
		transition: all .32s ease-in-out;
		border: 2px solid rgb(30,30,30);
		background-color: rgb(30,30,30);
		padding: 10px;
	}
	.links > a:hover {
		background-color: rgb(45,45,45);
		border: 2px solid rgb(100,100,100);
		border-radius: 7px;
	}
	button:hover{
		background-color: rgb(45,45,45);
		border: 2px solid rgb(100,100,100);
		border-radius: 7px;
	}
</style>
