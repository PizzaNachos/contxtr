import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabase_client';
import { invalidate, invalidateAll } from '$app/navigation';

export let user = writable({
    user: null,
    logged_in: 0,
    loading: true
});

export async function get_user_id(){
    let sto = (get(user))
    if (((sto?.user ?? null) != null) && (sto.loading != true)) {
        return sto.user.id
    } else {
        return await refresh_user()
    }
}

export async function refresh_user(){
    let s = await supabase.auth.getUser()
    if((s?.data?.user ?? null) != null) {
        console.log(s)
        user.set({
            user: s.data.user,
            logged_in: 1,
            loading: false
        })
    } else {
        user.set({
            user: null,
            logged_in: -1,
            loading: false
        })
    }
    return s?.data?.user?.id ?? null
}	

export async function login(usr : {usr:string, psw:string}) {
    const s = await supabase.auth.signInWithPassword({
        email: usr.usr.trim(),
        password: usr.psw.trim(),
    })
    if(s.data.user != null) {
        console.log("Logged in",s)
        user.set({
            user: s.data.user,
            logged_in: 1,
            loading: false
        })
    } else {
        console.error("Not loggen in",s)
        user.set({
            user: null,
            logged_in: -1,
            loading: false
        })
    }
}
export async function logout(){

    let data = await supabase.auth.signOut();
    if(!data.error){
        user.set({user:null, logged_in:-1, loading: false})
        // invalidate("Äuth")
        invalidateAll()
    }
}