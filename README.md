# kartenn api

setup-host-init:
```bash
sudo apt-get install postgresql
sudo su postgres -c "psql -c \"CREATE ROLE lafourchette ENCRYPTED PASSWORD 'lafourchette' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;\""
```

```bash
git clone git@github.com:kartenn/api.git
npm install
make build-all
vim config/local.js # add your accessToken for Github API with read accesses
node populate-database.js
```

