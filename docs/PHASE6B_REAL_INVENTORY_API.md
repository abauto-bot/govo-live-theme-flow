# GOVO Phase 6B Real Inventory API

Date: 20260709_092331

## Added
- Local API service: govo-inventory-api.service
- API port: 8093 localhost only
- Public nginx proxy:
  - /api/govo-inventory/health
  - /api/govo-inventory
  - /api/govo-leads
- Admin browser panel on /admin/login
- Server-side lead saving
- Inventory JSON remains public source:
  - /var/www/assets/govo-inventory.json

## Admin PIN
Stored only on VPS:
- /etc/govo-inventory-api.env
- /home/abu/.govo_inventory_admin_pin

Do not commit or share the PIN publicly.

## Backup
/home/abu/govo_phase6b_backup_20260709_092331
