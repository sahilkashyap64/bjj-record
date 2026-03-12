-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pseudonym VARCHAR(255) NOT NULL,
  real_name VARCHAR(255),
  belt_level VARCHAR(50),
  average_weight DECIMAL(5, 1),
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, pseudonym)
);

-- Techniques table
CREATE TABLE techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  custom BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Session logs table
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  duration_min INTEGER NOT NULL,
  sRPE DECIMAL(3, 1) NOT NULL,
  session_type VARCHAR(50) DEFAULT 'other',
  gi BOOLEAN DEFAULT true,
  metadata JSONB,
  sync_status VARCHAR(50) DEFAULT 'synced',
  device_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  server_updated_at TIMESTAMP DEFAULT NOW()
);

-- Rounds table
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_log_id UUID NOT NULL REFERENCES session_logs(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  round_number INTEGER NOT NULL,
  duration_sec INTEGER NOT NULL,
  position VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Round actions table
CREATE TABLE round_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  result VARCHAR(50) NOT NULL,
  technique_id UUID REFERENCES techniques(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Injuries table
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body_part VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  occurred_date DATE NOT NULL,
  resolved_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_session_logs_user_created ON session_logs(user_id, created_at);
CREATE INDEX idx_partners_user_status ON partners(user_id, status);
CREATE INDEX idx_techniques_user_category ON techniques(user_id, category);
CREATE INDEX idx_rounds_session ON rounds(session_log_id);
CREATE INDEX idx_round_actions_round ON round_actions(round_id);
CREATE INDEX idx_injuries_user_status ON injuries(user_id, status);
