**node.js https server**  
if openssl is not installed, openssl which come with git can be used  
[Https openssl](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/)  
extfile parmeter  
[open ssl extfile parm](https://www.openssl.org/docs/man3.0/man1/openssl-x509.html)  
subject alternative name  
[Subject Alternative Name](https://www.openssl.org/docs/man3.0/man5/x509v3_config.html)  
add certificate to the root store. Certutil require administer permissions so run gitbash as administrator  
[certutil](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certutil)  
certutil -addstore root cert.pem  

remove certificate button is greyed in chrome unless chrome was run as administrator  

run the following commands openssl commands to create x509 certificate  
* openssl genrsa -out key.pem  
* openssl req -new -key key.pem -out csr.pem  
* openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem  -extfile extfile.cnf  
* certutil -addstore root cert.pem  

Couldn't install self certificate without root to /system/etc/security/cacerts/ on android for use in flutter app.
so loaded cert.pem to the asset folder in flutter app to be used in httpclient of dart.io package.  

PKCS#12(PKCS12 or PFX)  is a binary format for storing a certificate chain and private key in a single file,, encryptable file. To create pkcs12 using openssl git is  
winpty openssl pkcs12 -inkey key.pem -in cert.pem -export -out keystore.p12  

To output p12 certificate:  
winpty openssl pkcs12 -info -in keystore.p12  

gitbash hangs if winpty is not used before openssl.  

In order to access the node.js website on private network from public network, do port forwarding on the router and enable "Node.js JavaScript Runtime" in windows firewall defender.
