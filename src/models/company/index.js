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
    return result.rows[0];
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
};

const getAllJobs = async(userId) => {
    const query = `SELECT "C"."Name", "J"."Title", "J"."Id"
FROM "public"."Company" AS "C"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
WHERE "C"."UserId" = $1`
const field = [userId];
const results = await dbClient.query(query, field);
return results.rows;
};

const deleteJobById = async(jobId) => {
    const query = `DELETE FROM "public"."Job" WHERE "Id" = $1`;
    const field = [jobId];
    await dbClient.query(query, field);
};

const getNotProcessedApplicants = async(userId) => {
    const query = `SELECT DISTINCT "JA"."Id" AS "Job", "JA"."JobId", "A"."Id", CONCAT("A"."Firstname", ' ', "A"."Lastname") AS "ApplicantName", "J"."Title", "C"."Name", DATE("JA"."AppliedOn"), "JA"."IsSeen"
FROM "public"."User" AS "U"
INNER JOIN "public"."Company" AS "C"
ON "U"."Id" = "C"."UserId"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
INNER JOIN "public"."JobApplicant" AS "JA"
ON "J"."Id" = "JA"."JobId"
INNER JOIN "public"."Applicant" AS "A"
ON "JA"."ApplicantId" = "A"."Id"
WHERE "JA"."IsSeen" = FALSE AND "U"."Id" = $1;`;
    const field = [userId];
    const results = await dbClient.query(query, field);
    return results.rows;
};

const showApplicantDetails = async(jobId) => {
    const query = `SELECT CONCAT("A"."Firstname", ' ', "A"."Lastname") AS "ApplicantName", "A"."Email", "A"."Gender", "A"."Phone", "A"."LinkedIn", "A"."FullAddress", "JA"."CoverLetter"
FROM "public"."JobApplicant" AS "JA"
INNER JOIN "public"."Applicant" AS "A"
ON "JA"."ApplicantId" = "A"."Id"
WHERE "JA"."Id" = $1`;
    const field = [jobId];
    const results = await dbClient.query(query, field);
    return results.rows;
}

const processApplicant = async(applicantId, jobId) => {
    const query = `UPDATE "public"."JobApplicant" SET "IsSeen" = 'TRUE' WHERE "ApplicantId" = $1 AND "Id" = $2`
    const fields = [applicantId, jobId];
    dbClient.query(query, fields);
};

const getProcessedApplicants = async(userId) => {
    const query = `SELECT DISTINCT CONCAT("A"."Firstname", ' ', "A"."Lastname") AS "ApplicantName", "J"."Title", "C"."Name", "JA"."Id"
FROM "public"."User" AS "U"
INNER JOIN "public"."Company" AS "C"
ON "U"."Id" = "C"."UserId"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
INNER JOIN "public"."JobApplicant" AS "JA"
ON "J"."Id" = "JA"."JobId"
INNER JOIN "public"."Applicant" AS "A"
ON "JA"."ApplicantId" = "A"."Id"
WHERE "JA"."IsSeen" = TRUE AND "U"."Id" = $1;`
    const field = [userId];
    const results = await dbClient.query(query, field);
    return results.rows;
};


export { checkExistingUser, addNewUser, verifyUser, getCompanyTypes, createNewCompany, createNewJob, getUserCompanies, getJustCompanies, getAllJobs, deleteJobById, getNotProcessedApplicants, showApplicantDetails, processApplicant, getProcessedApplicants };