# Operational runbook

This document covers the most common production incidents and their first-response steps. The on-call engineer should be familiar with all sections.

---

## How to declare an incident

1. Acknowledge the alert.
2. Post in `#incidents` Slack channel (or equivalent) with severity:
   - **SEV-1**: User data exposed, broken auth, AI giving harmful advice
   - **SEV-2**: Significant feature down (AI, lessons, payments, sync)
   - **SEV-3**: Degraded performance, rate-limit blowback, single feature flake
3. Open a doc with timeline, hypothesis, mitigation, fix, and post-mortem.
4. Communicate user-facing impact in a status banner if SEV-1 or SEV-2.

---

## SEV-1 incidents

### PII or health-data leak

1. **Stop the bleeding.** If a specific endpoint is leaking, set its kill switch:
   ```bash
   vercel env add SASTIPE_DISABLE_<ROUTE>=1 production
   vercel deploy --prod
   ```
2. Pull recent traffic logs from Sentry and the platform's request log.
3. Identify affected users. Query `users` table for any whose data appeared.
4. Notify Data Protection Officer within **24 hours**. EU GDPR Article 33 requires breach notification to supervisory authority within 72 hours of awareness.
5. Document scope, root cause, and notification record in the incident doc.

### AI giving genuinely harmful medical advice

1. Disable affected route immediately:
   ```bash
   # /api/consult, /api/scan, /api/symptom-check accept this kill switch.
   vercel env add OPENAI_API_KEY="" production --force
   vercel deploy --prod
   ```
2. The route returns `503 service_paused` and the deterministic emergency red-flag detector still works for the highest-risk queries.
3. Inspect Langfuse traces for the request. Get the user's locale, prompt, and the model's exact response.
4. Check whether the red-flag detector should have caught it. If so, add the missing pattern to [`src/lib/health/red-flags.ts`](../src/lib/health/red-flags.ts) and ship.
5. Re-enable AI only after a clinical reviewer signs off.

### Auth bypass

1. Rotate the Supabase service-role key.
2. Force-invalidate all sessions:
   ```sql
   UPDATE auth.users SET banned_until = now() + interval '1 hour';
   ```
3. Audit `audit_log` for the relevant time window:
   ```sql
   SELECT * FROM audit_log
   WHERE created_at > now() - interval '24 hours'
     AND action LIKE 'mediator.%'
   ORDER BY created_at DESC;
   ```
4. Patch the auth issue, deploy, then lift the ban.

---

## SEV-2 incidents

### AI cost storm (rapid OpenAI spend)

Symptoms: cost dashboard climbing fast; users reporting "service paused" 503s.

1. Check the daily budget. If `AI_DAILY_BUDGET_EUR` was tripped, that's working as intended.
2. If the budget hasn't tripped but cost is still spiking, lower it:
   ```bash
   vercel env add AI_DAILY_BUDGET_EUR=10 production --force
   vercel deploy --prod
   ```
3. Look for an attacker pattern in rate-limit logs (Upstash dashboard).
4. Block the offending IP/anon-id by adding to a deny-list:
   ```bash
   # Example: ban an anon ID for 24 hours
   redis-cli SET sastipe:ban:<anon-id> 1 EX 86400
   ```
5. Investigate why rate limits didn't catch it. The expected pattern is 15 req/60s per IP — anything past that is either Redis misconfiguration or a cluster of distinct IPs.

### Database connection failures

1. Check Neon/Supabase status.
2. Hit `/api/health` — it reports DB connectivity.
3. If transient, the `getDb()` singleton will retry on next request.
4. If extended, set a banner: "Sync paused — your progress is saving to your device. We'll restore it when service returns."
5. Roll forward fix or wait for upstream.

### Service worker poisoning (stale offline cache)

If many users report seeing an outdated UI:

1. Bump the cache version in [`public/sw.js`](../public/sw.js) (`CACHE_NAME`).
2. Deploy.
3. The service worker activate handler clears old caches automatically.
4. Users will see the new version on the next page load.

---

## SEV-3 incidents

### High error rate on a single route

1. Find the route in Sentry. Look at the error grouping.
2. Reproduce locally if possible.
3. Hot-fix or revert. Branch protection rules require PRs, but `git revert` + force-deploy is acceptable for SEV-3+.

### Email delivery degraded

1. Check Resend dashboard. Domain verification?
2. Bounce / complaint rate spike?
3. If Resend is down, queue emails in `notifications` table for later flush.

---

## Routine operations

### Weekly

- Review Sentry top issues.
- Review PostHog: lesson completion, quiz-pass rate, streak retention.
- Review AI cost vs. budget trend.
- Check error rate of `/api/consult`, `/api/symptom-check`, `/api/scan`.

### Monthly

- Audit `audit_log` for anomalies.
- Verify RLS policies still in place: `SELECT relname, relrowsecurity FROM pg_class WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace;`
- Verify content review status: any module with `lastReviewedAt > 6 months` ago should be reviewed.

### Per release

- Update CHANGELOG.
- Run Lighthouse CI report; investigate regressions in LCP, CLS, TBT.
- Run axe-core report; fix any new a11y violations.

---

## Useful commands

```bash
# Tail prod logs
vercel logs <deployment-url> --prod --follow

# Force re-deploy
vercel deploy --prod --force

# Check env in production
vercel env ls production

# Inspect Redis state
redis-cli -u $UPSTASH_REDIS_REST_URL keys 'sastipe:rl:*' | head

# Run a one-shot SQL query
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users WHERE created_at > now() - interval '7 days';"

# Test the offline shell
curl -i https://redi.healthcare/offline.html
```

---

## Escalation

- **Engineering on-call**: Slack `#incidents`, then phone tree
- **Data Protection Officer**: dpo@redi.healthcare (24h SLA for SEV-1)
- **Clinical reviewer** (medical content concerns): on-call rotation
- **Legal**: legal@redi.healthcare for data breaches and GDPR
