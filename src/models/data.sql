SELECT 'Id', 'Type' FROM "public"."CompanyType";

INSERT INTO "public"."CompanyType" ("Type") VALUES
    ('Manufacturing')
,   ('Construction')
,   ('Agriculture')
,   ('Transportation')
,   ('Energy')
,   ('Hospitality')
,   ('Finance')
,   ('Entertainment')
,   ('Information Technology');
INSERT INTO 'public'.'Company'('Name', 'Email', 'Password', 'CompanyTypeId') VALUES ();