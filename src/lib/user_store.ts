import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase_client';

export let user = writable({
    user: null,
    logged_in: 0
});


export async function refresh_user(){
    let s = await supabase.auth.getUser()
    if(s.data.user != null) {
        console.log(s)
        user.set({
            user: s.data.user,
            logged_in: 1
        })
    } else {
        user.set({
            user: null,
            logged_in: -1
        })
    }
}	

export async function login(usr : {usr:string, psw:string}) {
    const s = await supabase.auth.signInWithPassword({
        email: usr.usr.trim(),
        password: usr.psw.trim(),
    })
    if(s.data.user != null) {
        console.log("Logged in")
        user.set({
            user: s.data.user,
            logged_in: 1
        })
    } else {
        console.error("Not loggen in")
        user.set({
            user: null,
            logged_in: -1
        })
    }
}
export async function logout(){
    let data = await supabase.auth.signOut();
    if(!data.error){
        user.set({user:null, logged_in:-1})
    }
}