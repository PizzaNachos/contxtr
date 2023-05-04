<script lang="ts">
</script>

<svelte:head>
	<title>Contxt'r</title>
	<meta name="description" content="Contxt App" />
</svelte:head>

<div class=parent>
	<a href="/study">Study</a>
	<a href="/create">Create words and Sentences</a>
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
		border-radius: 5px;
		transition: all .25s ease-in-out;
		background-color: rgb(30,30,30);
		padding: 10px;
	}
	.parent a:hover{
		background-color: rgb(30,30,30);
	}
</style>
