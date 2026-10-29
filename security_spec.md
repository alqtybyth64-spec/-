# Firestore Security Specification - TAHA Platform

## 1. System Invariants
- Global Catch-All: Any document path not explicitly whitelisted is denied.
- Read Separation: Public visitors can only read published apps, published advertisements, enabled social links, and public settings.
- Private Requests: Service requests (`/serviceRequests`) can be created by visitors if payload satisfies validation constraints, but can NEVER be read, listed, modified, or deleted by unauthorized visitors.
- Admin Protection: Settings, apps, advertisements, and social links are only writable by authorized administrator sessions.
- No Red/Yellow/Gold slop or mock data.

## 2. Dirty Dozen Attack Payloads
1. Visitor attempting to read `/serviceRequests/{requestId}` -> PERMISSION_DENIED
2. Visitor attempting to list `/serviceRequests` -> PERMISSION_DENIED
3. Attacker modifying `siteName` without authentication -> PERMISSION_DENIED
4. Attacker deleting an app document without authentication -> PERMISSION_DENIED
5. Attacker injecting a 100KB string into `id` field -> PERMISSION_DENIED
6. Attacker setting `isPublished: true` with empty `downloadUrl` -> PERMISSION_DENIED
7. Attacker updating another user's request status -> PERMISSION_DENIED
8. Attacker injecting shadow properties into `settings/general` -> PERMISSION_DENIED
9. Visitor creating a `serviceRequest` missing required contact info -> PERMISSION_DENIED
10. Attacker modifying `downloadCount` arbitrarily -> PERMISSION_DENIED
11. Attacker attempting to read non-published draft apps as public user -> PERMISSION_DENIED
12. Attacker attempting to overwrite administrative keys -> PERMISSION_DENIED
