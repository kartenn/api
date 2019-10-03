# kartenn api

setup-host-init:
```bash
sudo apt-get install postgresql
sudo su postgres -c "psql -c \"CREATE ROLE lafourchette ENCRYPTED PASSWORD 'lafourchette' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;\""
```
