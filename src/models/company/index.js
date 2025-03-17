import dbClient from "../index.js";

const checkExistingUser = async (email) => {
    const query = `SELECT "Id" FROM "public"."User" WHERE "Email" = $1`;
    const field = [email];
    const result = await dbClient.query(query, field);
    return result;
};

const addNewUser = async (fname, lname, email, password) => {
    const query = `INSERT INTO "public"."User" ("Firstname", "Lastname", "Email", "Password") VALUES ($1, $2, $3, $4)`;
    const fields = [fname, lname, email, password];
    dbClient.query(query, fields);
}

const verifyUser = async (email, password) => {
    const query = `SELECT "Id" FROM "public"."User" WHERE "Email" = $1 AND "Password" = $2`;
    const fields = [email, password];
    const result = await dbClient.query(query, fields);
    return result.rows[0].Id;
};

const getCompanyTypes = async () => {
    const query = `SELECT "Id", "Type" FROM "public"."CompanyType"`;
    const result = await dbClient.query(query);
    return result.rows;
};

const createNewCompany = async (companyName, companyTypeId, userId) => {
    const query = `INSERT INTO "public"."Company" ("Name", "CompanyTypeId", "UserId") VALUES ($1, $2, $3)`;
    const fields = [companyName, companyTypeId, userId];
    dbClient.query(query, fields);
};

const createNewJob = async (title, payRangeStart, payRangeEnd, description, location, companyId) => {
    const query = `INSERT INTO "public"."Job" ("Title","PayRangeStart", "PayRangeEnd", "Description", "Location", "CompanyId") VALUES ($1, $2, $3, $4, $5, $6)`;
    const fields = [title, payRangeStart, payRangeEnd, description, location, companyId];
    dbClient.query(query, fields);
};

const getUserCompanies = async (userId) => {
    const query = `
    SELECT "c"."Name", "ct"."Type"  
    FROM "public"."User" AS "u" 
    INNER JOIN "public"."Company" AS "c" ON "u"."Id" = "c"."UserId" 
    INNER JOIN "public"."CompanyType" AS "ct" ON "c"."CompanyTypeId" = "ct"."Id"
    WHERE "u"."Id" = $1`
    const field = [userId];
    const results = await dbClient.query(query, field);
    return results.rows;
};

const getJustCompanies = async(userId) => {
    const query = `SELECT "Id", "Name" FROM "public"."Company" WHERE "UserId" = $1`;
    const field = [userId];
    const results = await dbClient.query(query, field);
    return results.rows;
}

export { checkExistingUser, addNewUser, verifyUser, getCompanyTypes, createNewCompany, createNewJob, getUserCompanies, getJustCompanies }