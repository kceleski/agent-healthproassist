
-- Create table for appointment reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
    time_before TEXT NOT NULL CHECK (time_before IN ('15min', '30min', '1hour', '1day')),
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add constraints and indices for performance
    CONSTRAINT unique_appointment_reminder UNIQUE (appointment_id, user_id, type)
);

-- Create index for faster queries on appointment_id
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_appointment_id ON appointment_reminders(appointment_id);

-- Create index for faster queries on user_id
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_user_id ON appointment_reminders(user_id);

-- Create table for calendar connections
CREATE TABLE IF NOT EXISTS calendar_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
    connected BOOLEAN DEFAULT TRUE,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calendar_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add constraint to ensure one connection per provider per user
    CONSTRAINT unique_calendar_provider UNIQUE (user_id, provider)
);

-- Create index for faster queries on user_id
CREATE INDEX IF NOT EXISTS idx_calendar_connections_user_id ON calendar_connections(user_id);

-- Create table for todo items
CREATE TABLE IF NOT EXISTS todo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT FALSE,
    related_client_id UUID,
    related_facility_id UUID,
    related_appointment_id TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries on user_id
CREATE INDEX IF NOT EXISTS idx_todo_items_user_id ON todo_items(user_id);

-- Create index for faster queries on completed flag
CREATE INDEX IF NOT EXISTS idx_todo_items_completed ON todo_items(completed);

-- Create index for faster queries on due_date
CREATE INDEX IF NOT EXISTS idx_todo_items_due_date ON todo_items(due_date);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_todo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todo_items_updated_at
BEFORE UPDATE ON todo_items
FOR EACH ROW
EXECUTE FUNCTION update_todo_updated_at();

-- Add RLS policies
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to restrict access to own records only
CREATE POLICY appointment_reminders_user_policy 
ON appointment_reminders 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY calendar_connections_user_policy 
ON calendar_connections 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY todo_items_user_policy 
ON todo_items 
FOR ALL 
USING (user_id = auth.uid());
