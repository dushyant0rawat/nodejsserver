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
