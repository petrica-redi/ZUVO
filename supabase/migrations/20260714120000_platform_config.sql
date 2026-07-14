-- Platform configuration for admin CMS (branding, hero, fonts, custom CSS)
CREATE TABLE IF NOT EXISTS platform_config (
  id text PRIMARY KEY,
  logo_url text,
  hero_title text,
  hero_subtitle text,
  hero_image text,
  hero_layout text DEFAULT 'split',
  font_sans text,
  font_display text,
  font_editorial text,
  custom_css text,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO platform_config (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;
