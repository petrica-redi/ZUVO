-- Visual page-builder content for the admin CMS.
-- Stores a map of { [slug]: PageBlock[] } as JSON.
ALTER TABLE platform_config
  ADD COLUMN IF NOT EXISTS page_blocks jsonb;
