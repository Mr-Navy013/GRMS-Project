    use("GrievanceDatabase");

    db.createCollection("OfficerDB");
    db.OfficerDB.insertOne({
      Name: "Officer 1",
      "email-ID": "Officer@gmail.com",
      "department": "Computer Science",
      "joining year": 2015,
      "password": "Officer@123",
    });
