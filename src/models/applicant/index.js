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

export {checkExistingUser, addNewUser, verifyUser, getUserDetails, updateData}