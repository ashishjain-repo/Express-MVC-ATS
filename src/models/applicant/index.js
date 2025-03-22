import dbClient from "../index.js";

const checkExistingUser = async(email) => {
    const query = `SELECT "Id" FROM "public"."Applicant" WHERE "Email" = $1`;
    const field = [email];
    const result = await dbClient.query(query, field);
    return result;
};

const addNewUser = async(fname, lname, gender, email, password) => {
    const query = `INSERT INTO "public"."Applicant" ("Firstname", "Lastname", "Gender", "Email", "Password") VALUES ($1, $2, $3, $4, $5)`;
    const fields = [fname, lname, gender, email, password];
    dbClient.query(query, fields);
}

const verifyUser = async(email, password) => {
    const query = `SELECT "Id" FROM "public"."Applicant" WHERE "Email" = $1 AND "Password" = $2`;
    const fields = [email, password];
    const result = await dbClient.query(query, fields);
    return result.rows[0];
};

const getUserDetails = async(id) => {
    const query = `SELECT CONCAT("Firstname",' ',"Lastname") AS "Name", "Gender", "Email", "Phone", "LinkedIn", "FullAddress", "CoverLetter" FROM "public"."Applicant" WHERE "Id" = $1`;
    const field = [id];
    const result = await dbClient.query(query, field);
    return result;
};

const updateData = async(column, data, user) => {
    const query = `UPDATE "public"."Applicant" SET "${column}" = $1 WHERE "Id" = $2`;
    const fields = [data, user];
    dbClient.query(query, fields);
};

const allAvailableJobs = async(applicantId) => {
    const query = `SELECT "J"."Id", "J"."Title", CONCAT('$',"J"."PayRangeStart", ' <-> $',"J"."PayRangeEnd") AS "Pay", "J"."Location", "C"."Name"
FROM "public"."Company" AS "C"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
    WHERE "J"."Id" NOT IN (SELECT "JobId" FROM "public"."JobApplicant" WHERE "ApplicantId" = $1);`
    const field = [applicantId]
return await dbClient.query(query, field);
};

const applyForJob = async(jobId, applicantId) => {
    const query = `INSERT INTO "public"."JobApplicant" ("JobId", "ApplicantId", "CoverLetter") VALUES ($1, $2, (SELECT "CoverLetter" FROM "public"."Applicant" WHERE "Id" = $3))`;
    const fields = [jobId, applicantId, applicantId];
    await dbClient.query(query, fields);
};

const getAppliedJobs = async(userId) => {
    const query = `SELECT DISTINCT "JA"."Id" AS "Withdraw", "JA"."JobId", "J"."Title", "C"."Name", TO_CHAR("JA"."AppliedOn", 'Month DD, YYYY') AS "AppliedOn", "JA"."IsSeen"
FROM "public"."Company" AS "C"
INNER JOIN "public"."Job" AS "J"
ON "C"."Id" = "J"."CompanyId"
INNER JOIN "public"."JobApplicant" AS "JA"
ON "J"."Id" = "JA"."JobId"
WHERE "JA"."ApplicantId" = $1`;
const field = [userId];
const results = await dbClient.query(query, field);
return results;
};

const withdrawApplication = async(jobApplicantId) => {
    const query = `DELETE FROM "public"."JobApplicant" WHERE "Id" = $1`;
    const field = [jobApplicantId];
    await dbClient.query(query,field);
};
export {checkExistingUser, addNewUser, verifyUser, getUserDetails, updateData, allAvailableJobs, applyForJob, getAppliedJobs, withdrawApplication }