
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// This would be replaced with actual email service like Resend and SMS service like Twilio
const sendEmailReminder = async (email: string, subject: string, message: string) => {
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  // In a real implementation, we would use a service like Resend
  return { success: true, id: crypto.randomUUID() };
};

const sendSmsReminder = async (phone: string, message: string) => {
  console.log(`Sending SMS to: ${phone}`);
  console.log(`Message: ${message}`);
  // In a real implementation, we would use a service like Twilio
  return { success: true, id: crypto.randomUUID() };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get due reminders
    const { data: reminders, error: reminderError } = await supabase
      .from("appointment_reminders")
      .select(`
        *,
        users:user_id (email, phone)
      `)
      .eq("sent", false);

    if (reminderError) {
      throw new Error(`Error fetching reminders: ${reminderError.message}`);
    }

    const results = [];

    // Process each reminder
    for (const reminder of reminders) {
      try {
        // Get appointment details (in a real implementation, this would fetch from an appointments table)
        // This is just a placeholder since we don't have an actual appointments table yet
        const appointment = {
          id: reminder.appointment_id,
          title: "Sample Appointment",
          date: new Date(),
          time: "10:00 AM",
          location: "123 Healthcare Ave"
        };

        const user = reminder.users;
        const message = `Reminder: You have an appointment "${appointment.title}" at ${appointment.time} on ${appointment.date.toLocaleDateString()}. Location: ${appointment.location}`;

        let result;
        if (reminder.type === "email" && user.email) {
          result = await sendEmailReminder(
            user.email,
            `Appointment Reminder: ${appointment.title}`,
            message
          );
        } else if (reminder.type === "sms" && user.phone) {
          result = await sendSmsReminder(user.phone, message);
        } else {
          result = { success: false, error: "Missing contact information" };
        }

        // If successfully sent, mark as sent in the database
        if (result.success) {
          await supabase
            .from("appointment_reminders")
            .update({ sent: true })
            .eq("id", reminder.id);
        }

        results.push({
          id: reminder.id,
          type: reminder.type,
          success: result.success,
          error: result.error || null
        });
      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
        results.push({
          id: reminder.id,
          type: reminder.type,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-reminder function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

// This function would be triggered by a cron job in a production environment
