#!/bin/bash
FILES=*.html
for f in $FILES
do
  echo "Processing $f file..."
  pandoc --from html --to markdown $f -o ${f//.html/.md}
done
