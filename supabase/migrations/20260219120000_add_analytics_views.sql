-- Analytics views for chat widget data
-- Run: SELECT * FROM popular_questions LIMIT 20;
-- Run: SELECT * FROM chat_summary;

CREATE OR REPLACE VIEW popular_questions AS
SELECT
  content AS question,
  COUNT(*) AS times_asked,
  MAX(created_at) AS last_asked
FROM chat_messages
WHERE role = 'user'
GROUP BY content
ORDER BY times_asked DESC;

CREATE OR REPLACE VIEW chat_summary AS
SELECT
  DATE(created_at) AS date,
  COUNT(DISTINCT conversation_id) AS conversations,
  COUNT(*) FILTER (WHERE role = 'user') AS user_messages
FROM chat_messages
GROUP BY DATE(created_at)
ORDER BY date DESC;
