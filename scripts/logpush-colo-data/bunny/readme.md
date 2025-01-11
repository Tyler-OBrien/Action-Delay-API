Based on https://github.com/Tyler-OBrien/axiom-cloudflare-logpush, need same AuthSecret (Axiom, if unset will not push to axiom) and LogpushSecret (for logpush to pass)

We use two SQLite DBs for redunancy/just in case. This was built during the earlier betas/alphas of D1, so I was just being careful. new-data includes required table schemas. 