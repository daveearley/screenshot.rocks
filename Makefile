package-browser-extension:
	@(cd ./browser-extension && rm extension.zip &&  zip -r extension.zip ./)
	@echo  'Successfully packaged extension'