# scgasapp

Guia de configuração e instalação

Para instalar o Ionic, Cordova e NodeJS siga as instruções contidas em: http://ionicframework.com/getting-started/

Após realizar as configurações acima, execute os passos seguintes no prompt de comando dentro da pasta raiz do projeto.

1. Removendo plataformas

		1.1 ionic cordova platform remove android
		1.2 ionic cordova platform remove ios
		1.3 ionic cordova platform remove browser

2. Adicionando plataformas

		2.1 ionic cordova platform add android
		2.2 ionic cordova platform add ios
		2.3 ionic cordova platform add browser
			
3. Instalando dependências

		3.1 npm install

4. Executando builds	

		4.1 ionic cordova run android
		4.2 ionic cordova build android
		4.3 ionic cordova run android
