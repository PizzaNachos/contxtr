import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase_client';

export let user = writable({
    user: null,
    logged_in: 0
});

export async function refresh_user(){
    let s = await supabase.auth.getUser()
    if(s.data) {
        user.set({
            user: s.data,
            logged_in: 1
        })
    } else {
        user.set({
            user: null,
            logged_in: -1
        })
    }
}
export async function login(usr) {
    const s = await supabase.auth.signInWithPassword({
        email: usr.usr,
        password: usr.psw,
    })
    if(s.data.session) {
        user.set({
            user: s.data,
            logged_in: 1
        })
    } else {
        user.set({
            user: null,
            logged_in: -1
        })
    }
}

