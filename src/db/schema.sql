-- Create custom ENUM types for structured data
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('independent_agent', 'agency_agent', 'agency_admin', 'super_admin', 'super_super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.interaction_type AS ENUM ('call', 'email', 'meeting', 'tour', 'note', 'placement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table for Agencies
CREATE TABLE IF NOT EXISTS public.agent_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(35),
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Users/Agents
CREATE TABLE IF NOT EXISTS public.agent_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(35),
    role user_role NOT NULL,
    agency_id UUID REFERENCES public.agent_agencies(id) ON DELETE SET NULL,
    subscription_tier VARCHAR(50) DEFAULT 'standard' CHECK (subscription_tier IN ('standard', 'premium')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for User Profiles
CREATE TABLE IF NOT EXISTS public.agent_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.agent_users(id) ON DELETE CASCADE,
    headline TEXT,
    bio TEXT,
    profile_image_url VARCHAR(2048),
    service_locations TEXT,
    years_experience VARCHAR(50),
    specializations TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Senior Clients
CREATE TABLE IF NOT EXISTS public.agent_senior_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by_user_id UUID REFERENCES public.agent_users(id) ON DELETE SET NULL,
    agency_id UUID REFERENCES public.agent_agencies(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(35),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    veteran_status BOOLEAN DEFAULT FALSE,
    care_needs TEXT[],
    budget_range TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Facilities
CREATE TABLE IF NOT EXISTS public.agent_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    street TEXT,
    city TEXT,
    state VARCHAR(10),
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(35),
    website TEXT,
    email TEXT,
    image_url TEXT,
    description TEXT,
    type TEXT,
    tags TEXT[],
    is_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Interactions with clients or facilities
CREATE TABLE IF NOT EXISTS public.agent_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.agent_users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.agent_senior_clients(id) ON DELETE SET NULL,
    facility_id UUID REFERENCES public.agent_facilities(id) ON DELETE SET NULL,
    interaction_type interaction_type NOT NULL,
    content TEXT,
    interaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for User Tasks (To-Do List)
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.agent_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    priority task_priority NOT NULL DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    related_client_id UUID REFERENCES public.agent_senior_clients(id) ON DELETE SET NULL,
    related_facility_id UUID REFERENCES public.agent_facilities(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for AI Conversation History
CREATE TABLE IF NOT EXISTS public.agent_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.agent_users(id) ON DELETE CASCADE,
    openai_thread_id TEXT UNIQUE,
    assistant_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for individual AI messages
CREATE TABLE IF NOT EXISTS public.agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for User Search History
CREATE TABLE IF NOT EXISTS public.agent_search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.agent_users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    search_criteria JSONB,
    result_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies and Triggers (These should be added after the tables are created)
-- It's often best to add RLS and triggers in a separate step or after confirming tables exist.
-- But for a full reset, including them is fine.
-- Enable RLS for all tables
ALTER TABLE public.agent_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_senior_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view agencies" ON public.agent_agencies FOR SELECT USING (true);
CREATE POLICY "Users can manage their own data" ON public.agent_users FOR ALL USING (id = auth.uid());
CREATE POLICY "Users can manage their own profiles" ON public.agent_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public can view facilities" ON public.agent_facilities FOR SELECT USING (true);
CREATE POLICY "Admins can manage facilities" ON public.agent_facilities FOR ALL USING (auth.uid() IN (SELECT id FROM public.agent_users WHERE role IN ('super_admin', 'super_super_admin')));
CREATE POLICY "Users can manage their own related records" ON public.agent_senior_clients FOR ALL USING (created_by_user_id = auth.uid() OR agency_id = (SELECT agency_id FROM public.agent_users WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own interactions" ON public.agent_interactions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own tasks" ON public.agent_tasks FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own conversations" ON public.agent_conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own messages" ON public.agent_messages FOR ALL USING ((SELECT user_id FROM public.agent_conversations WHERE id = conversation_id) = auth.uid());
CREATE POLICY "Users can manage their own search history" ON public.agent_search_history FOR ALL USING (user_id = auth.uid());

-- Function to split a full name into first and last name
CREATE OR REPLACE FUNCTION public.split_name(full_name TEXT)
RETURNS TABLE(first_name TEXT, last_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        substring(full_name from '^(\S+)') AS first_name,
        substring(full_name from '\s(.*)$') AS last_name;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to automatically create an agent_users and agent_profiles record when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    meta jsonb;
    user_role text;
    first_name_val text;
    last_name_val text;
BEGIN
    meta := new.raw_user_meta_data;
    user_role := COALESCE(meta->>'role', 'independent_agent');

    SELECT p.first_name, p.last_name INTO first_name_val, last_name_val
    FROM public.split_name(meta->>'name') p;

    INSERT INTO public.agent_users (id, email, first_name, last_name, phone, role, work_type, subscription_tier)
    VALUES (
        new.id,
        new.email,
        first_name_val,
        last_name_val,
        meta->>'phone',
        (user_role)::user_role,
        COALESCE(meta->>'workType', 'independent'),
        COALESCE(meta->>'subscription_tier', 'standard')
    );

    INSERT INTO public.agent_profiles (user_id, headline, bio, service_locations, years_experience, specializations)
    VALUES (
        new.id,
        meta->>'headline',
        meta->>'bio',
        meta->>'serviceLocations',
        meta->>'yearsExperience',
        meta->>'specializations'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage on the public schema to the postgres role
GRANT USAGE ON SCHEMA public TO postgres;

-- Grant execute permissions on the function to the postgres role
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Create the trigger that fires after a new user is added to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
