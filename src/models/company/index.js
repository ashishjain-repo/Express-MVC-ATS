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

export {checkExistingUser, addNewUser}