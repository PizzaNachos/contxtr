// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, locals }) => {
  // const a = await parent();
  const { supabase, getSession } = locals
  let session = await locals.getSession()
  console.log("Page Session",session)

  if (!session) {
    console.log("No session")
    // throw redirect(303, '/');
  }
  const { data: tableData } = await supabase.from('test').select('*');

  return {
    user: session?.user ?? null,
    tableData
  };
};
