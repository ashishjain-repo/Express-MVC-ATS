import dbClient from "../index.js";

const checkExistingUser = async(email) => {
    const query = `SELECT "Id" FROM "public"."User" WHERE "Email" = $1`;
    const field = [email];
    const result = await dbClient.query(query, field);
    return result;
};

const addNewUser = async(FName, LName, Email, Password) => {
    const query = `INSERT INTO "public"."User" ("Firstname", "Lastname", "Email", "Password") VALUES ($1, $2, $3, $4)`;
    const fields = [FName, LName, Email, Password];
    dbClient.query(query, fields);
}

const verifyUser = async(email, password) => {
    const query = `SELECT "Id" FROM "public"."User" WHERE "Email" = $1 AND "Password" = $2`;
    const fields = [email, password];
    const result = await dbClient.query(query, fields);
    return result.rows[0].Id;
};

const getCompanyTypes = async() => {
    const query = `SELECT "Id", "Type" FROM "public"."CompanyType"`;
    const result = await dbClient.query(query);
    return result.rows;
}

export {checkExistingUser, addNewUser, verifyUser, getCompanyTypes}