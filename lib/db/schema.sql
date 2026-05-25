-- Inferred SQLite schema from live API field shapes and operational notes.
-- Manual summaries and auto-generated metadata persist per notice record.

CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  source_record_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  category TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'notice-boards',
  summary TEXT,
  auto_summary TEXT,
  user_primary_tag TEXT,
  auto_tags TEXT NOT NULL DEFAULT '[]',
  pdf_text TEXT,
  pdf_text_preview TEXT,
  has_extracted_text INTEGER NOT NULL DEFAULT 0,
  page_count INTEGER,
  extracted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notices_category_date
  ON notices (category, date DESC);

CREATE INDEX IF NOT EXISTS idx_notices_exam_id
  ON notices (exam_id);

CREATE TABLE IF NOT EXISTS sync_state (
  category TEXT PRIMARY KEY,
  synced_at TEXT,
  source_verified_on TEXT NOT NULL,
  pending_enrichment_count INTEGER NOT NULL DEFAULT 0
);
