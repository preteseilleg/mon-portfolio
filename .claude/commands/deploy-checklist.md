---
description: Checklist pré-déploiement
---

Exécute dans l'ordre :
1. `npm run build` - le build doit réussir sans erreur
2. Cherche les `console.log` restants dans `src/`
3. Vérifie que `.env.local` contient toutes les variables de `.env.example`
4. `npm run test` - tous les tests doivent passer
5. Affiche un résumé : ✅ prêt / ❌ bloqué (avec la raison)
