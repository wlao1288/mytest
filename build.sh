echo "Building project..."

BUILDPATH=./root
mkdir $BUILDPATH

echo "Copying files..."
cp -R ./src/* $BUILDPATH/

echo "Compiling..."
sass --no-source-map ./src/common/nav.scss:./root/common/nav.css
rm ./root/common/nav.css.map
rm ./root/common/nav.scss
rm -rf ./root/common/components

for file in $( find src -type f -name "*.html"); do
  html-minifier $file --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js > $BUILDPATH/${file#*src/} &&
  echo "+"${file#*src/} &
done

for file in $( find src -type f -name "*.css"); do
  cleancss -o $BUILDPATH/${file#*src/} $file &&
  echo "+"${file#*src/} &
done

for file in $( find src -type f -name "*.js"); do
  uglifyjs $file -c -o $BUILDPATH/${file#*src/} &&
  echo "+"${file#*src/} &
done

wait;

echo "Build complete"
