<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Toast_col, {toast} from '$lib/components/Toast_col.svelte';

    export let data: PageData;
    $: ({ user, tableData } = data);
</script>
<div>
  <button on:click={() => toast("Test Toast", 2000, "rgb(100,100,100)","white")}>Test Toast</button>
  <div class='t'>
    <Toast_col />
  </div>
  
</div>
<style>
  .t{
    position: relative;
  }
</style>
  <!-- <div>Protected content for {user?.email}</div>
  <pre>{JSON.stringify(tableData, null, 2)}</pre>
  <pre>{JSON.stringify(user, null, 2)}</pre> -->
  