# Supabase database changes

All AFOS database changes will be stored as reviewed SQL migrations in the `migrations` directory.

Operational tables have intentionally not been created yet. The first schema migration will follow approval of the role-permission matrix and end-to-end transaction states so that the database does not freeze unvalidated business rules.

Rules:

- Do not create production tables manually through the Supabase Table Editor.
- Do not commit database passwords, secret keys, or service-role keys.
- Every schema change must have a migration, review, and rollback consideration.
- Row Level Security must be enabled and tested before participant data is introduced.

