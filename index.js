/**
 * Per prima cosa, includiamo i due moduli installati
 * precedentemente
 */
var express = require('express');

var sqlite3 = require('sqlite3').verbose();

/**
 * A questo punto creiamo un database in memoria ( Ovvero
 * non salvandolo su disco ) dove andremo a salvare i
 * nostri dati
 */
var db = new sqlite3.Database(':memory:');

/**
 * Quindi creiamo una nuova tabella con solo due campi:
 * - title : Il titolo del libro
 * - author : Il nome completo dell'autore
 */
db.run("CREATE TABLE books (title TEXT, author TEXT)");

/**
 * Inizializziamo una nuova applicazione express
 */
var app = express();

/**
 * Utilizziamo al root principale del server per
 * elencare tutti i libri presenti
 */
app.get('/', function (req, res) {

    db.all(`SELECT * FROM books` , (err,rows) => {

        /**
         * Inviamo tutte le righe trovate nella tabella "books"
         */
        res.send( rows );
    });

});

/**
 * Invece per il salvataggio utilizzeremo il percorso
 * /save/ seguito dal titolo e dall'autore
 */
app.get('/save/:title/:author', function (req, res) {

    /**
     * Prepariamo l'istruzione di INSERT nella nostra tabella
     */
    var stmt = db.prepare("INSERT INTO books VALUES (?, ?)");

    /**
     * Ed eseguiamo la query di sopra, passando i dati presenti
     * nell url
     */
    stmt.run( req.params.title, req.params.author , (err,rows) =>{

        /**
         * Infine inviamo uno stato "true" per indicare che il
         * salvataggio è avvenuto correttamente
         */
        res.send(true);
    });

    stmt.finalize();

});

/**
 * Avviamo quindi il server in ascolto sulla porta 80
 */

app.listen( 80, function () {
    console.log('Books server ready');
});