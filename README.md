# Generate random bytes

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex));
```

# Settings up a user and database in psql

## Create and configure admin user

```
    CREATE USER eztrack_admin WITH ENCRYPTED PASSWORD '******';
    ALTER USER eztrack_admin WITH SUPERUSER;
```

## Create database

Replace ${env} with the environment the database is being made for (i.e., dev, test, prod).

```
    CREATE DATABASE eztrack_${env} WITH OWNER eztrack_admin;
```

## Create and configure npe user

```
    CREATE USER eztrack_npe with ENCRYPTED PASASWORD '******';
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eztrack_npe;
    GRANT CONNECT ON DATABASE eztrack_${env} TO eztrack_npe;
    GRANT USAGE ON SCHEMA public TO eztrack_npe;

    GRANT CONNECT ON DATABASE eztrack_${env} TO eztrack_npe;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eztrack_npe;
    GRANT USAGE ON SCHEMA public TO eztrack_npe;
```

## To clear out the created resources and user, run the following:

```
    DROP OWNED BY eztrack_npe;
    DROP USER eztrack_npe;
```
