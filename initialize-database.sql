-- CREATE DATABASE smartbrain;
-- \c smartbrain;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth CASCADE;
DROP TABLE IF EXISTS history CASCADE;

CREATE TABLE users (
   uuid uuid NOT NULL default uuid_generate_v4(),
   username VARCHAR(100) UNIQUE NOT NULL,
   first_name VARCHAR(100),
   last_name VARCHAR(100),
   email_address VARCHAR(100) UNIQUE NOT NULL,
   date_of_birth TIMESTAMP,
   entries BIGINT DEFAULT 0,
   joined_at TIMESTAMP WITH TIME ZONE NOT NULL,
   PRIMARY KEY(uuid)
);

CREATE TABLE auth (
   user_uuid uuid NOT NULL,
   hash VARCHAR (100) NOT NULL,
   CONSTRAINT fk_user
      FOREIGN KEY(user_uuid)
         REFERENCES users(uuid)
         ON DELETE CASCADE
);

-- * will contain data from each previous Clarifai search per user
CREATE TABLE history (
   user_uuid uuid NOT NULL,
   data JSON,
   CONSTRAINT fk_user
      FOREIGN KEY(user_uuid)
         REFERENCES users(uuid)
         ON DELETE CASCADE
);
