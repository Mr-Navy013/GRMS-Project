use('GrievanceDatabase');

db.createCollection('StudentDB');
db.StudentDB.insertOne({
  "name": "Student 1",
  "email": "student@gmail.com",
  "registrationNumber": 23110662,
  "course": "B.Tech",
  "department": "Computer Science",
  "joiningYear": 2023,
  "password": "Student@123",
  "role": "Student",
});