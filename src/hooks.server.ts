// src/hooks.server.ts
import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  } from '$env/static/public';
  import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
  import type { Handle, error } from '@sveltejs/kit';
  
  export async function handle({ event, resolve }) {
    event.locals.supabase = createSupabaseServerClient({
      supabaseUrl: PUBLIC_SUPABASE_URL,
      supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
      event
    });
  
    /**
     * a little helper that is written for convenience so that instead
     * of calling `const { data: { session } } = await supabase.auth.getSession()`
     * you just call this `await getSession()`
     */
    event.locals.getSession = async () => {
      let res = await event.locals.supabase.auth.getSession();
      const {
        data: { session },
        error
      } = res
      // console.log("Hooks.server.ts getSession", res)
      return session;
    };
    
    // console.log("Hooks.server.ts EVENT",event)
    // console.log("Hooks.server.ts supabase",event.locals.getSession)

    return resolve(event, {
      /**
       * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
       *
       * https://github.com/sveltejs/kit/issues/8061
       */
      filterSerializedResponseHeaders(name) {
        return name === 'content-range';
      }
    });
  };
  