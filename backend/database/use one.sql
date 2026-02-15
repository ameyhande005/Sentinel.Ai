USE ProjectIntelligenceDB;
GO
SELECT name, type_desc
FROM sys.database_principals
WHERE type IN ('S', 'U');
ALTER ROLE db_owner ADD MEMBER [sys];
GO
EXEC sp_helpuser;
