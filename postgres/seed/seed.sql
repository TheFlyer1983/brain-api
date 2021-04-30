BEGIN TRANSACTION;

INSERT INTO 
  users (name, email, joined)
  values ('Paul', 'theflyer1983@gmail.com', '2021-04-09');

INSERT INTO
  login (hash, email)
  values ('$2a$10$ZV08//k5XdMJky4l5FTn6egCvwQqE/wyh8cOpd2PZ8iXoCrVHp.4u', 'theflyer1983@gmail.com');
COMMIT;