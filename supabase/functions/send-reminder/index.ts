// ... imports
serve(async (req) => {
  // ... CORS handling
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Fetch due reminders from the new agent_tasks table
    const { data: tasks, error } = await supabase
      .from("agent_tasks") // UPDATED
      .select(`*, user:user_id (email, phone)`)
      .eq("completed", false)
      .lte('due_date', new Date().toISOString());

    if (error) throw new Error(`Error fetching tasks: ${error.message}`);
    
    // ... (rest of the logic to process and send reminders based on tasks)

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
