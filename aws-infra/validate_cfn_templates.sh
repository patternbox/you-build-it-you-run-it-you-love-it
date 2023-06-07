#!/bin/bash -e

pushd "$(dirname $0)" > /dev/null

while IFS= read -r -d '' file
do
  echo "Validate $file"
  aws cloudformation validate-template --template-body "file://$file"
  [[ "$?" == "0" ]] && echo "Return code of AWS CLI was: SUCCESS (code: $?)" || echo "Return code of AWS CLI was: $?"
done < <(find . -iname '*.yml' -print0)

popd > /dev/null
