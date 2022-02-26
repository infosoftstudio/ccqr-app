local:
	tns debug android --bundle

build:
	tns build android --force

build-production:
	tns build android --release --key-store-path="./tapatgensan.keystore" --key-store-password="123456" --key-store-alias="tapatgensan" --key-store-alias-password="123456"

generate-keytool:
	keytool -v -genkey -v -keystore tapatgensan.keystore -alias tapatgensan -keyalg RSA -validity 10000


clean:
	tns platform clean android
