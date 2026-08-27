use("GrievanceDatabase");

db.createCollection("NonTeachingStaffDB");
db.NonTeachingStaffDB.insertOne({
  "Name": "teacher 1",
  "email-ID": "teachingstaff@gmail.com",
  "job Role": "Clerical",
  "joining year": 2013,
  "password": "NonTeachingStaff@123",
});
