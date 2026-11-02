REVOKE INSERT, UPDATE, DELETE ON places FROM anon, authenticated;
REVOKE ALL ON favorites FROM anon;
REVOKE UPDATE ON favorites FROM authenticated;