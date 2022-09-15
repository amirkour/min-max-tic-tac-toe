# min-max-tic-tac-toe
A javascript, min/max AI for playing tic tac toe

# layer updating

## bundle layer into zip file

when lambda functions depend on this package, you can bundle it into a zip file suitable for lambda layers like so: 

`npm run layer:zip` 

that should output a file named `archive.zip` to the base folder.

## publish layer

to publish a newly updated archive.zip to an lambda layer:

`npm run layer:publish`

that should publish the zip file to aws and output some JSON w/ the results - the ARN for your new version should get outputed near the bottom.  You'll need to take note of the version of this layer/publish if you want to update any lambda functions to use this newly published layer

## update functions to use new layer

to update a function to use a new layer (after publishing one, see above)

`VERSION=2 npm run layer:deploy`

where the version number is printed in the full version arn, something like `arn:aws:lambda:<region>:<account-id>:layer:<layer-name>:2`