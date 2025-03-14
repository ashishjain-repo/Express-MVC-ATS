import dbClient from "../index.js";

const checkExistingUser = async(email) => {
    const query = `SELECT "Id" FROM "public"."Company" WHERE "Email" = $1`;
    const field = [email];
    const result = await dbClient.query(query, field);
    return result;
};

const addNewCompany = async(cName, cEmail, cPassword, cType) => {
    const query = `INSERT INTO "public"."Company" ("Name", "Email", "Password", "CompanyTypeId") VALUES ($1, $2, $3, $4)`;
    const fields = [cName, cEmail, cPassword, cType];
}

export {checkExistingUser}