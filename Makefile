.PHONY: package-browser-extension deploy

package-browser-extension:
	@(cd ./browser-extension && rm extension.zip &&  zip -r extension.zip ./)
	@echo  'Successfully packaged extension'

deploy-lambda:
	@(cd ./screenshot-lambda && zip -r function.zip . && aws lambda update-function-code --function-name screenshot --zip-file fileb://function.zip)