
export GATES_TABLE='cicd-pipeline-deployment-gates'
export GATE_NAME='infrastructure'

aws dynamodb put-item --table-name 'cicd-pipeline-deployment-gates' \
    --item '{"gate-name": {"S": "infrastructure"}, "closed": {"BOOL": false}, "reason": {"S": ""}}'

aws dynamodb get-item \
    --table-name ${GATES_TABLE} \
    --key '{"gate-name": {"S": "infrastructure"}}' \
    --query 'Item.{"gate-name":"gate-name".S, closed:closed.BOOL, reason:reason.S}'

aws dynamodb get-item \
    --table-name ${GATES_TABLE} \
    --key "{\"gate-name\": {\"S\": \"$GATE_NAME\"}}" \
    --query 'Item.{"gate-name":"gate-name".S, closed:closed.BOOL, reason:reason.S}'

aws dynamodb get-item \
    --table-name ${GATES_TABLE} \
    --key file://key.json \
    --query 'Item.{"gate-name":"gate-name".S, closed:closed.BOOL, reason:reason.S}'

DDB_RESULT=$(aws dynamodb get-item \
    --table-name ${GATES_TABLE} \
    --key '{"gate-name": {"S": "infrastructure"}}' \
    --query 'Item.{"gate-name":"gate-name".S, closed:closed.BOOL, reason:reason.S}')

aws dynamodb get-item \
    --table-name ${GATES_TABLE} \
    --key '{"gate-name": {"S": "${GATE_NAME}"}}' \
    --query 'Item.{"gate-name":"gate-name".S, closed:closed.BOOL, reason:reason.S}'


aws dynamodb scan --table-name users \
--query "Items[].[username.S,email.S,passwordHash.S]" \
--output json | jq -r '.[] | @csv' > dump.csv
