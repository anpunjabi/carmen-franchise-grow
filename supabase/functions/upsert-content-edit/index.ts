
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, content, page_identifier } = await req.json();

    if (!id || typeof content !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid payload. 'id' and 'content' are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Server not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Try UPDATE first
    const updateRes = await adminClient
      .from("content_edits")
      .update({ content, page_identifier: page_identifier ?? null })
      .eq("id", id)
      .select("id");

    if (updateRes.error) {
      console.error("Update error:", updateRes.error);
    }

    let finalId = id;

    if (!updateRes.error && Array.isArray(updateRes.data) && updateRes.data.length > 0) {
      finalId = updateRes.data[0].id as string;
    } else {
      // No row updated -> INSERT
      const insertRes = await adminClient
        .from("content_edits")
        .insert({ id, content, page_identifier: page_identifier ?? null })
        .select("id")
        .single();

      if (insertRes.error) {
        console.error("Insert error:", insertRes.error);
        return new Response(
          JSON.stringify({ error: insertRes.error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      finalId = insertRes.data.id as string;
    }

    return new Response(
      JSON.stringify({ success: true, id: finalId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Unhandled error in upsert-content-edit:", e);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
