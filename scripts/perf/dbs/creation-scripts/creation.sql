drop table if EXISTS config;
CREATE TABLE config (id INTEGER PRIMARY KEY, data JSON);

WITH RECURSIVE nums AS (SELECT 1 n UNION ALL SELECT n+1 FROM nums LIMIT 2000)
INSERT INTO config
SELECT n, json_array(
   json_array(hex(randomblob(200)), hex(randomblob(200)), hex(randomblob(200))),
   json_array(hex(randomblob(200)), hex(randomblob(200)), hex(randomblob(200))),
   json_array(hex(randomblob(200)), hex(randomblob(200)), hex(randomblob(200)))
)
FROM nums;

WITH matches AS (
 SELECT id, 
 CASE WHEN json_extract(data, '$[0][0]') LIKE '%AA%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[0][1]') LIKE '%BB%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[0][2]') LIKE '%CC%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[1][0]') LIKE '%DD%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[1][1]') LIKE '%EE%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][0]') LIKE '%GG%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%KK%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%LL%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%MM%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%NN%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%QQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%PP%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%LL%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%QW%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%IO%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%NU%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%PU%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%ZQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%IO%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%e3%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%HJ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][1]') LIKE '%GQ%' THEN 1 ELSE 0 END +
 CASE WHEN json_extract(data, '$[2][2]') LIKE '%II%' THEN 1 ELSE 0 END as score
 FROM config
)
SELECT * FROM matches 
WHERE score Like '43%'
limit 1;