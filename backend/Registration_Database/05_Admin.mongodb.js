use("GrievanceDatabase");

db.createCollection("AdminDB");
db.AdminDB.insertOne({
  "name": "Admin 1",
  "email": "admin@gmail.com",
  "universityId": "OUTR1981",
  "password": "Admin@123",
  "role": "Admin",
});
