use("GrievanceDatabase");

db.createCollection("TeachingStaffDB");
db.TeachingStaffDB.insertOne({
  "name": "teacher 1",
  "email": "teachingstaff@gmail.com",
  "teachingType": "Permanent",
  "course": "B.Tech",
  "department": "Computer Science",
  "joining year": 2013,
  "password": "Teacher@123",
  "role": "Teaching Staff",
});
