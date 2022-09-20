local:
	tns debug android --bundle

build:
	tns build android --force

build-production:
	tns build android --release --key-store-path="./ccqr.keystore" --key-store-password="123456" --key-store-alias="ccqr" --key-store-alias-password="123456"

generate-keytool:
	keytool -v -genkey -v -keystore ccqr.keystore -alias ccqr -keyalg RSA -validity 10000

splash:
	tns resources generate splashes App_Resources/Android/src/main/res/drawable/applogo.png --background "#43a9ad"

clean:
	tns platform clean android
